/**
 * apps/web/src/lib/preview-store.ts
 *
 * Distributed preview store backed by Upstash Redis.
 * Falls back to an in-memory Map when Upstash env vars are not set
 * (local development without a Redis instance).
 *
 * Redis key: preview:{slug}
 * TTL: 10 minutes
 *
 * This solves the multi-instance serverless problem: every Netlify/Vercel
 * function reads from the same Redis database regardless of which instance
 * handled the POST from the admin editor.
 */

const TTL_SECONDS = 600; // 10 minutes

export interface PreviewEntry {
  blocks: any[];
  title?: string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: number;
}

// ─── Redis client (lazy-initialized) ────────────────────────────────────────

let redisClient: any = null;

async function getRedis(): Promise<any | null> {
  if (redisClient) return redisClient;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return null; // Fallback to memory store in dev

  try {
    const { Redis } = await import('@upstash/redis');
    redisClient = new Redis({ url, token });
    return redisClient;
  } catch (err) {
    console.warn('[preview-store] Upstash Redis not available, using in-memory fallback:', err);
    return null;
  }
}

// ─── In-memory fallback (development only) ────────────────────────────────

const memStore = new Map<string, PreviewEntry>();

function memCleanup() {
  const now = Date.now();
  for (const [key, entry] of memStore.entries()) {
    if (now - entry.createdAt > TTL_SECONDS * 1000) memStore.delete(key);
  }
}

// ─── Public API ───────────────────────────────────────────────────────────

export async function setPreviewBlocks(
  slug: string,
  entry: Omit<PreviewEntry, 'createdAt'>,
): Promise<void> {
  const redis = await getRedis();
  const payload: PreviewEntry = { ...entry, createdAt: Date.now() };

  if (redis) {
    try {
      await redis.set(`preview:${slug}`, JSON.stringify(payload), { ex: TTL_SECONDS });
      return;
    } catch (err) {
      console.error('[preview-store] Redis write failed, falling back to memory:', err);
    }
  }

  // Memory fallback
  memCleanup();
  memStore.set(slug, payload);
}

export async function getPreviewBlocks(slug: string): Promise<PreviewEntry | null> {
  const redis = await getRedis();

  if (redis) {
    try {
      const raw = await redis.get(`preview:${slug}`);
      if (!raw) return null;
      const entry: PreviewEntry = typeof raw === 'string' ? JSON.parse(raw) : raw;
      if (Date.now() - entry.createdAt > TTL_SECONDS * 1000) return null;
      return entry;
    } catch (err) {
      console.error('[preview-store] Redis read failed, falling back to memory:', err);
    }
  }

  // Memory fallback
  const entry = memStore.get(slug);
  if (!entry) return null;
  if (Date.now() - entry.createdAt > TTL_SECONDS * 1000) {
    memStore.delete(slug);
    return null;
  }
  return entry;
}

export async function deletePreviewBlocks(slug: string): Promise<void> {
  const redis = await getRedis();
  if (redis) {
    try {
      await redis.del(`preview:${slug}`);
      return;
    } catch {
      // Ignore
    }
  }
  memStore.delete(slug);
}
