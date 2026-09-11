import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import crypto from 'crypto';

const ALLOWED_TAG_PATTERN = /^(insights:list|impacts:list|team:list|services:list|page:home|insight:[a-z0-9-]+|impact:[a-z0-9-]+|team:[a-z0-9-]+|service:[a-z0-9-]+|page:[a-z0-9-]+|tax:[a-z-]+:[a-z0-9-]+)$/;
const ALLOWED_PATH_PATTERN = /^\/([a-zA-Z0-9-_\/]+)?$/;
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

    if (!signature || !timestampHeader || !secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const timestamp = parseInt(timestampHeader, 10);
    const now = Math.floor(Date.now() / 1000);

    // Freshness verification
    if (isNaN(timestamp) || Math.abs(now - timestamp) > MAX_AGE_SECONDS) {
      return NextResponse.json({ error: 'Request expired' }, { status: 401 });
    }

    // Nonce replay protection
    cleanExpiredNonces(now);
    if (nonce) {
      if (seenNonces.has(nonce)) {
        return NextResponse.json({ error: 'Replay detected: duplicate nonce' }, { status: 401 });
      }
      seenNonces.set(nonce, now);
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

    const { paths = [], tags = [] } = JSON.parse(rawBody);

    // Invalidate tags
    for (const tag of tags) {
      if (typeof tag === 'string' && ALLOWED_TAG_PATTERN.test(tag)) {
        revalidateTag(tag, 'max');
      }
    }

    // Invalidate paths
    for (const path of paths) {
      if (typeof path === 'string' && ALLOWED_PATH_PATTERN.test(path)) {
        revalidatePath(path);
      }
    }

    return NextResponse.json({
      revalidated: true,
      paths,
      tags,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 });
  }
}
