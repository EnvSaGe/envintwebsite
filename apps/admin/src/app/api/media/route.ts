import { NextRequest, NextResponse } from 'next/server';
import { db, mediaAssets, eq } from '@envint/db';
import { requireRole } from '@/lib/clerk-rbac';

export const runtime = 'nodejs';

/**
 * GET /api/media — list assets (newest first)
 * DELETE /api/media?id=... — delete asset row (S3 object deletion left to bucket lifecycle or manual)
 */
export async function GET() {
  try {
    await requireRole(['super_admin', 'editor']);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const assets = await db.query.mediaAssets.findMany({
      orderBy: (assets, { desc }) => [desc(assets.createdAt)],
      limit: 500,
    });
    return NextResponse.json({ assets });
  } catch (err: any) {
    console.error('Media list failed:', err);
    return NextResponse.json({ error: 'Failed to load media assets' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireRole(['super_admin']);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = new URL(req.url).searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  try {
    await db.delete(mediaAssets).where(eq(mediaAssets.id, id));
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Media delete failed:', err);
    return NextResponse.json({ error: 'Failed to delete asset' }, { status: 500 });
  }
}
