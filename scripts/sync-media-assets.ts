import path from 'node:path';
import fs from 'node:fs';
import { config as loadEnv } from 'dotenv';

loadEnv({ path: path.resolve(process.cwd(), 'apps/admin/.env.local') });
loadEnv({ path: path.resolve(process.cwd(), 'packages/db/.env') });

async function main() {
  const { db, mediaAssets, eq, sql } = await import('../packages/db/src');

  console.log('Querying media_assets for vantage...');
  const allAssets = await db.select().from(mediaAssets);
  const existing = allAssets.filter(a => a.filename.toLowerCase().includes('van'));
  console.log('Existing vantage assets:', existing.map(e => ({ id: e.id, filename: e.filename, s3Key: e.s3Key, url: e.url })));

  const coverWebpPath = path.resolve(process.cwd(), 'apps/web/public/images/vantage-2026-cover.webp');
  const coverSize = fs.existsSync(coverWebpPath) ? fs.statSync(coverWebpPath).size : 202662;

  const pdfPath = path.resolve(process.cwd(), 'docs/migration/Vantage.pdf');
  const pdfSize = fs.existsSync(pdfPath) ? fs.statSync(pdfPath).size : 12185485;

  const assetsToUpsert = [
    {
      filename: 'vantage-2026-cover.webp',
      s3Key: 'images/vantage-2026-cover.webp',
      url: 'https://envintcms.s3.ap-south-1.amazonaws.com/images/vantage-2026-cover.webp',
      altText: 'Vantage 2026: Navigating the ESG Reset - Envint Publication',
      mimeType: 'image/webp',
      fileSizeBytes: coverSize,
      width: 1600,
      height: 1003,
    },
    {
      filename: 'vantage-2026.webp',
      s3Key: 'images/vantage-2026.webp',
      url: 'https://envintcms.s3.ap-south-1.amazonaws.com/images/vantage-2026-cover.webp',
      altText: 'Vantage 2026: Navigating the ESG Reset - Envint Publication',
      mimeType: 'image/webp',
      fileSizeBytes: coverSize,
      width: 1600,
      height: 1003,
    },
    {
      filename: 'Vantage-2026-Navigating-the-ESG-Reset.pdf',
      s3Key: 'media/uploads/Vantage-2026-Navigating-the-ESG-Reset.pdf',
      url: 'https://envintcms.s3.ap-south-1.amazonaws.com/media/uploads/Vantage-2026-Navigating-the-ESG-Reset.pdf',
      altText: 'Vantage 2026 Publication PDF',
      mimeType: 'application/pdf',
      fileSizeBytes: pdfSize,
      width: null,
      height: null,
    },
    {
      filename: 'Vantage.pdf',
      s3Key: 'media/uploads/Vantage.pdf',
      url: 'https://envintcms.s3.ap-south-1.amazonaws.com/media/uploads/Vantage-2026-Navigating-the-ESG-Reset.pdf',
      altText: 'Vantage 2026 PDF',
      mimeType: 'application/pdf',
      fileSizeBytes: pdfSize,
      width: null,
      height: null,
    }
  ];

  for (const item of assetsToUpsert) {
    const found = await db.select().from(mediaAssets).where(eq(mediaAssets.s3Key, item.s3Key));
    if (found.length > 0) {
      await db.update(mediaAssets).set({
        filename: item.filename,
        url: item.url,
        altText: item.altText,
        mimeType: item.mimeType,
        fileSizeBytes: item.fileSizeBytes,
        width: item.width,
        height: item.height,
        updatedAt: new Date(),
      }).where(eq(mediaAssets.id, found[0].id));
      console.log(`✓ Updated existing media asset: ${item.filename} (id: ${found[0].id})`);
    } else {
      const [inserted] = await db.insert(mediaAssets).values({
        filename: item.filename,
        s3Key: item.s3Key,
        url: item.url,
        altText: item.altText,
        mimeType: item.mimeType,
        fileSizeBytes: item.fileSizeBytes,
        width: item.width,
        height: item.height,
      }).returning();
      console.log(`✓ Inserted new media asset: ${item.filename} (id: ${inserted.id})`);
    }
  }

  console.log('\n--- VERIFYING ALL VANTAGE MEDIA ASSETS ---');
  const finalCheck = (await db.select().from(mediaAssets)).filter(f => f.filename.toLowerCase().includes('van'));
  console.log(finalCheck.map(f => ({ filename: f.filename, url: f.url })));
}

main().catch(err => {
  console.error('Error syncing media assets:', err);
  process.exit(1);
});
