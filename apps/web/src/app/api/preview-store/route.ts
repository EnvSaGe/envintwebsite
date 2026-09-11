import { NextRequest, NextResponse } from 'next/server';
import { setPreviewBlocks } from '@/lib/preview-store';
import crypto from 'crypto';

export const runtime = 'nodejs';

/**
 * POST /api/preview-store?slug=/about
 * Headers: Authorization: Bearer <PREVIEW_HMAC_TOKEN>
 * Body: { blocks: [...], title, seoTitle, seoDescription }
 *
 * Authenticated endpoint — only the admin app (which signs its requests)
 * may write to the preview store.
 */
export async function POST(req: NextRequest) {
  // ── Authentication ──────────────────────────────────────────────────────
  const authHeader = req.headers.get('authorization') || '';
  const providedToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  const secret = process.env.DRAFT_PREVIEW_SECRET;

  if (!secret) {
    console.error('[preview-store] DRAFT_PREVIEW_SECRET env var not set');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  if (!providedToken) {
    return NextResponse.json({ error: 'Authorization header required' }, { status: 401 });
  }

  // Verify HMAC token: the admin sends SHA256(secret + slug) as Bearer token
  const slug = req.nextUrl.searchParams.get('slug') || '/';
  const expectedToken = crypto.createHmac('sha256', secret).update(slug).digest('hex');
  const providedBuffer = Buffer.from(providedToken, 'hex');
  const expectedBuffer = Buffer.from(expectedToken, 'hex');

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    return NextResponse.json({ error: 'Invalid authorization token' }, { status: 401 });
  }

  // ── Parse & Store ───────────────────────────────────────────────────────
  const body = await req.json().catch(() => null);

  if (!body || !Array.isArray(body.blocks)) {
    return NextResponse.json({ error: 'blocks array is required' }, { status: 400 });
  }

  await setPreviewBlocks(slug, {
    blocks: body.blocks,
    title: body.title,
    seoTitle: body.seoTitle,
    seoDescription: body.seoDescription,
  });

  return NextResponse.json({ success: true });
}
