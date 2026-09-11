import { NextRequest, NextResponse } from 'next/server';
import { createPresignedUploadUrl } from '@/lib/s3';
import { db, mediaAssets } from '@envint/db';
import { requireRole } from '@/lib/clerk-rbac';
import crypto from 'crypto';

export const runtime = 'nodejs';

/**
 * POST /api/media/upload
 * Body: { filename, contentType, size }
 * Returns a presigned PUT URL for direct browser -> S3 upload.
 * The asset row is recorded in media_assets after upload confirmation
 * (POST /api/media/confirm) or optimistically here.
 */
export async function POST(req: NextRequest) {
  try {
    await requireRole(['super_admin', 'editor']);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const { filename, contentType, size } = (body || {}) as {
    filename?: string;
    contentType?: string;
    size?: number;
  };

  if (!filename || !contentType) {
    return NextResponse.json({ error: 'filename and contentType are required' }, { status: 400 });
  }

  const allowed = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'image/avif',
  ];
  if (!allowed.includes(contentType)) {
    return NextResponse.json({ error: `Unsupported content type: ${contentType}` }, { status: 400 });
  }

  // 50 MB cap
  if (size && size > 50 * 1024 * 1024) {
    return NextResponse.json({ error: 'File exceeds 50 MB limit' }, { status: 400 });
  }

  try {
    const contentHash = crypto.randomBytes(8).toString('hex');
    const { uploadUrl, key, publicUrl } = await createPresignedUploadUrl(filename, contentType, contentHash);

    // Optimistically record the asset so it appears in the library immediately.
    // If the browser upload fails, the row can be deleted from the library.
    const [asset] = await db
      .insert(mediaAssets)
      .values({
        filename,
        s3Key: key,
        url: publicUrl,
        mimeType: contentType,
        fileSizeBytes: size ?? 0,
        altText: filename.replace(/\.[^.]+$/, ''),
      })
      .returning();

    return NextResponse.json({ uploadUrl, key, publicUrl, asset });
  } catch (err: any) {
    console.error('Media upload presign failed:', err);
    return NextResponse.json(
      { error: 'Upload presign failed. Check AWS credentials / bucket config.' },
      { status: 500 }
    );
  }
}
