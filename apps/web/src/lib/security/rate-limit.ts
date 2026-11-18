import { NextRequest, NextResponse } from 'next/server';

const MAX_TRACKED_KEYS = 5000;
const buckets = new Map<string, number[]>();

/**
 * Extracts the most trustworthy client IP from Netlify / reverse-proxy headers.
 */
export function getClientIp(req: NextRequest | Request): string {
  const headers = req.headers;
  const nfIp = headers.get('x-nf-client-connection-ip')?.trim();
  if (nfIp) return nfIp.slice(0, 64);

  const xff = headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0]?.trim();
    if (first) return first.slice(0, 64);
  }

  const realIp = headers.get('x-real-ip')?.trim();
  if (realIp) return realIp.slice(0, 64);

  return '127.0.0.1';
}

export interface RateLimitResult {
  limited: boolean;
  remaining: number;
  resetSeconds: number;
}

/**
 * Memory-bounded sliding-window rate limiter per (namespace, key).
 * Protects serverless instances and downstream Neon DB compute from floods.
 */
export function checkRateLimit(
  namespace: string,
  key: string,
  maxRequests: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const compositeKey = `${namespace}:${key}`;

  // Bound map size to prevent memory exhaustion under distributed floods
  if (buckets.size >= MAX_TRACKED_KEYS && !buckets.has(compositeKey)) {
    const oldestKey = buckets.keys().next().value;
    if (oldestKey) buckets.delete(oldestKey);
  }

  const existing = buckets.get(compositeKey) || [];
  const valid = existing.filter((ts) => now - ts < windowMs);

  if (valid.length >= maxRequests) {
    buckets.set(compositeKey, valid);
    const oldestValid = valid[0] ?? now;
    const resetSeconds = Math.max(1, Math.ceil((windowMs - (now - oldestValid)) / 1000));
    return {
      limited: true,
      remaining: 0,
      resetSeconds,
    };
  }

  valid.push(now);
  buckets.set(compositeKey, valid);

  return {
    limited: false,
    remaining: Math.max(0, maxRequests - valid.length),
    resetSeconds: Math.ceil(windowMs / 1000),
  };
}

export function rateLimitExceededResponse(resetSeconds: number, message = 'Too many requests. Please try again later.'): NextResponse {
  return NextResponse.json(
    { error: message },
    {
      status: 429,
      headers: {
        'Retry-After': String(resetSeconds),
        'Cache-Control': 'no-store',
      },
    },
  );
}

/**
 * Validates that a relative redirect path stays strictly on the current origin.
 * Blocks protocol-relative URLs (`//evil.com`), backslash tricks (`/\evil.com`),
 * and external origins (`https://evil.com`).
 */
export function sanitizeInternalRedirectPath(rawRedirect: string | null | undefined, fallback = '/'): string {
  if (!rawRedirect || typeof rawRedirect !== 'string') return fallback;
  const trimmed = rawRedirect.trim();
  if (!trimmed.startsWith('/') || trimmed.startsWith('//') || trimmed.startsWith('/\\')) {
    return fallback;
  }
  try {
    const parsed = new URL(trimmed, 'https://envintglobal.com');
    if (parsed.origin !== 'https://envintglobal.com') {
      return fallback;
    }
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
}
