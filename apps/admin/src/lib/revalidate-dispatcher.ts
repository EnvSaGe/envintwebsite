import crypto from 'crypto';

interface RevalidateOptions {
  tags?: string[];
  paths?: string[];
}

export interface RevalidationDispatchResult {
  success: boolean;
  skipped: boolean;
  attempts: number;
  error?: string;
}

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 200;

/**
 * Dispatches a signed revalidation request to the public web app.
 *
 * Uses HMAC-SHA256 with timestamp + nonce to authenticate the request.
 * Includes exponential backoff retry (3 attempts) for transient failures.
 *
 * Errors are logged but never thrown — a revalidation failure must never
 * fail a content save operation.
 */
export async function dispatchRevalidation({ tags = [], paths = [] }: RevalidateOptions): Promise<RevalidationDispatchResult> {
  const publicSiteUrl = process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL;
  const secret = process.env.REVALIDATION_SECRET_TOKEN;

  if (!publicSiteUrl || !secret) {
    const error = 'Missing PUBLIC_SITE_URL or REVALIDATION_SECRET_TOKEN';
    console.warn(`[revalidate] ${error} — skipping revalidation.`);
    return { success: false, skipped: true, attempts: 0, error };
  }

  const body = JSON.stringify({ tags, paths });

  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      // Each retry is a distinct authenticated request. Reusing a nonce after
      // a transient response failure would correctly be rejected as replay.
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const nonce = crypto.randomBytes(16).toString('hex');
      const signature = crypto
        .createHmac('sha256', secret)
        .update(`${timestamp}.${nonce}.${body}`)
        .digest('hex');
      const response = await fetch(`${publicSiteUrl}/api/revalidate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-revalidation-signature': signature,
          'x-revalidation-timestamp': timestamp,
          'x-revalidation-nonce': nonce,
        },
        body,
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`[revalidate] ✅ Revalidated — tags: [${tags.join(', ')}] paths: [${paths.join(', ')}]`, result);
        return { success: true, skipped: false, attempts: attempt };
      }

      const errText = await response.text().catch(() => '(no body)');
      console.warn(`[revalidate] Attempt ${attempt}/${MAX_RETRIES} failed — HTTP ${response.status}: ${errText}`);
      lastError = new Error(`HTTP ${response.status}: ${errText}`);
    } catch (err) {
      console.warn(`[revalidate] Attempt ${attempt}/${MAX_RETRIES} network error:`, err);
      lastError = err;
    }

    if (attempt < MAX_RETRIES) {
      const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // Don't throw — revalidation failure should never fail a content save
  console.error(`[revalidate] ❌ All ${MAX_RETRIES} attempts failed. Last error:`, lastError);
  return {
    success: false,
    skipped: false,
    attempts: MAX_RETRIES,
    error: lastError instanceof Error ? lastError.message : String(lastError),
  };
}
