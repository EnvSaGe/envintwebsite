import { NextRequest, NextResponse } from 'next/server';
import { draftMode } from 'next/headers';
import { deletePreviewBlocks } from '@/lib/preview-store';

export const runtime = 'nodejs';

/**
 * GET /api/draft/disable  — redirect to home (original behavior preserved)
 * POST /api/draft/disable — JSON response + Redis cleanup (new behavior)
 */
export async function GET(request: NextRequest) {
  const draft = await draftMode();
  draft.disable();
  return NextResponse.redirect(new URL('/', request.url));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const slug = body.slug as string | undefined;

    const draft = await draftMode();
    draft.disable();

    // Clean up Upstash Redis preview entry if slug provided
    if (slug) {
      await deletePreviewBlocks(slug);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to disable draft mode' }, { status: 500 });
  }
}
