import path from 'path';
import { config } from 'dotenv';
config({ path: path.resolve(__dirname, '../packages/db/.env') });

import { eq, and, isNotNull, ne } from 'drizzle-orm';
import { db } from '../packages/db/src/client';
import { pages, pageRevisions } from '../packages/db/src/schema';

/**
 * revert-promoted-trees.ts
 *
 * Un-publishes the trees that were bulk-promoted (keeps them as DRAFTS so the
 * studio stays fully editable). The live site then falls back to the original
 * static/hardcoded pages. Pages that had a published tree BEFORE the bulk
 * promotion (/about) are left untouched.
 */
const KEEP_PUBLISHED = new Set(['/about', '/test']);

async function main() {
  const allPages = await db.query.pages.findMany({
    orderBy: (p, { asc }) => [asc(p.slug)],
  });

  let reverted = 0;
  for (const page of allPages) {
    if (KEEP_PUBLISHED.has(page.slug)) {
      console.log(`= ${page.slug.padEnd(28)} kept published (pre-existing)`);
      continue;
    }

    const published = page.publishedBlocks as any;
    if (!published?.rootIds) {
      console.log(`- ${page.slug.padEnd(28)} no published tree, nothing to do`);
      continue;
    }

    const snapshot = published;

    await db
      .update(pages)
      .set({ publishedBlocks: null, updatedAt: new Date() })
      .where(eq(pages.slug, page.slug));

    await db.insert(pageRevisions).values({
      pageSlug: page.slug,
      contentBlocks: snapshot as any,
      schemaVersion: 2,
      status: page.status || 'DRAFT',
      savedByName: 'revert-promoted-trees script',
      note: 'Reverted bulk promotion — live site back on static page; tree kept as draft for studio editing',
      savedAt: new Date(),
    });

    console.log(`✓ ${page.slug.padEnd(28)} unpublished (draft tree kept)`);
    reverted++;
  }

  console.log(`\nDone. Reverted: ${reverted}`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
