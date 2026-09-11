'use server';

import { db, mediaAssets, eq } from '@envint/db';
import { requireRole } from '@/lib/clerk-rbac';

export interface MediaItem {
  id: string;
  filename: string;
  url: string;
  altText: string | null;
  mimeType: string;
  fileSizeBytes: number;
  createdAt: string;
}

export async function fetchMediaAssets(): Promise<MediaItem[]> {
  await requireRole(['super_admin', 'editor']);

  try {
    const assets = await db.query.mediaAssets.findMany({
      orderBy: (assets, { desc }) => [desc(assets.createdAt)],
      limit: 500,
    });
    return assets.map((a) => ({
      id: a.id,
      filename: a.filename,
      url: a.url,
      altText: a.altText,
      mimeType: a.mimeType,
      fileSizeBytes: a.fileSizeBytes,
      createdAt: a.createdAt ? new Date(a.createdAt).toISOString() : new Date().toISOString(),
    }));
  } catch (err) {
    console.warn('Could not load media assets from DB:', err);
    return [];
  }
}

export async function updateMediaAltText(id: string, altText: string) {
  await requireRole(['super_admin', 'editor']);
  await db
    .update(mediaAssets)
    .set({ altText, updatedAt: new Date() })
    .where(eq(mediaAssets.id, id));
  return { success: true };
}

export async function deleteMediaAsset(id: string) {
  await requireRole(['super_admin', 'editor']);
  await db.delete(mediaAssets).where(eq(mediaAssets.id, id));
  return { success: true };
}
