import path from 'path';
import { config } from 'dotenv';
config({ path: path.resolve(__dirname, '../packages/db/.env') });

import { eq } from 'drizzle-orm';
import { db } from '../packages/db/src/client';
import { pages, pageRevisions } from '../packages/db/src/schema';

/**
 * Reverts a page's published tree so the live site falls back to the
 * hard-coded page component. The draft tree is kept for studio editing.
 *
 * Usage: npx tsx scripts/unpublish-tree.ts "/"
 */
async function main() {
  const slug = process.argv[2];
  if (!slug) {
    console.error('Usage: npx tsx scripts/unpublish-tree.ts "/slug"');
    process.exit(1);
  }

  const page = await db.query.pages.findFirst({ where: eq(pages.slug, slug) });
  if (!page) {
    console.error(`No page: ${slug}`);
    process.exit(1);
  }

  const snapshot = page.publishedBlocks ?? page.draftBlocks ?? []; 

  await db
    .update(pages)
    .set({ publishedBlocks: null, schemaVersion: 2, updatedAt: new Date() })
    .where(eq(pages.slug, slug));

  await db.insert(pageRevisions).values({
    pageSlug: slug,
    contentBlocks: snapshot as any,
    schemaVersion: 2,
    status: page.status || 'DRAFT',
    savedByName: 'unpublish-tree script',
    note: 'Unpublished tree — live site falls back to hard-coded page until tree is completed',
    savedAt: new Date(),
  });

  console.log(`✓ Unpublished tree for ${slug}. Draft tree kept for studio editing.`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
