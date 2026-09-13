import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import crypto from 'crypto';
import { normalizeRevalidationRequest } from '@/lib/revalidation/targets';

const MAX_AGE_SECONDS = 300; // 5-minute validity window

// Track seen nonces during the 5-minute validity window for replay prevention
const seenNonces = new Map<string, number>();

function cleanExpiredNonces(now: number) {
  for (const [nonce, ts] of seenNonces.entries()) {
    if (now - ts > MAX_AGE_SECONDS) {
      seenNonces.delete(nonce);
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-revalidation-signature');
    const timestampHeader = request.headers.get('x-revalidation-timestamp');
    const nonce = request.headers.get('x-revalidation-nonce') || '';
    const secret = process.env.REVALIDATION_SECRET_TOKEN;

    if (!signature || !timestampHeader || !secret || !/^[a-f0-9]{32}$/i.test(nonce)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const timestamp = parseInt(timestampHeader, 10);
    const now = Math.floor(Date.now() / 1000);

    // Freshness verification
    if (isNaN(timestamp) || Math.abs(now - timestamp) > MAX_AGE_SECONDS) {
      return NextResponse.json({ error: 'Request expired' }, { status: 401 });
    }

    const rawBody = await request.text();
    if (rawBody.length > 10240) {
      return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
    }

    // Verify HMAC-SHA256 signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${timestamp}.${nonce}.${rawBody}`)
      .digest('hex');

    const sigBuffer = Buffer.from(signature, 'hex');
    const expBuffer = Buffer.from(expectedSignature, 'hex');

    if (sigBuffer.length !== expBuffer.length || !crypto.timingSafeEqual(sigBuffer, expBuffer)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Only authenticated requests may consume a nonce. This also allows a
    // dispatcher to safely retry a request that never reached this handler.
    cleanExpiredNonces(now);
    if (seenNonces.has(nonce)) {
      return NextResponse.json({ error: 'Replay detected: duplicate nonce' }, { status: 401 });
    }
    seenNonces.set(nonce, now);

    const { paths, tags, rejectedPaths, rejectedTags } = normalizeRevalidationRequest(JSON.parse(rawBody));
    const results: Array<{ type: 'path' | 'tag'; target: string; success: boolean }> = [];

    // Invalidate tags
    for (const tag of tags) {
      try {
        revalidateTag(tag, 'max');
        results.push({ type: 'tag', target: tag, success: true });
      } catch {
        results.push({ type: 'tag', target: tag, success: false });
      }
    }

    // Invalidate paths
    for (const path of paths) {
      try {
        revalidatePath(path);
        results.push({ type: 'path', target: path, success: true });
      } catch {
        results.push({ type: 'path', target: path, success: false });
      }
    }

    return NextResponse.json({
      revalidated: true,
      paths,
      tags,
      rejectedPaths,
      rejectedTags,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof SyntaxError || (error instanceof Error && /invalid|array|at most/i.test(error.message))) {
      return NextResponse.json({ error: 'Invalid revalidation payload' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 });
  }
}
