import path from 'path';
import { config } from 'dotenv';
config({ path: path.resolve(__dirname, '../packages/db/.env') });

import { eq } from 'drizzle-orm';
import { db } from '../packages/db/src/client';
import { pages, pageRevisions } from '../packages/db/src/schema';

/**
 * publish-all-trees.ts
 *
 * Promotes each page's existing Schema v2 DRAFT tree to its PUBLISHED tree so
 * that studio edits flow through to the live site for every page.
 *
 * Safety rules:
 *  - Pages that ALREADY have a published tree (e.g. /about) are skipped.
 *  - Pages WITHOUT a draft tree are skipped (they keep their current rendering).
 *  - Every promotion is snapshotted into page_revisions for easy rollback.
 *
 * Usage:  npx tsx scripts/publish-all-trees.ts            (dry-run report)
 *         npx tsx scripts/publish-all-trees.ts --apply    (write to DB)
 */
async function main() {
  const apply = process.argv.includes('--apply');

  const allPages = await db.query.pages.findMany({
    orderBy: (p, { asc }) => [asc(p.slug)],
  });

  console.log(`Found ${allPages.length} pages.\n`);

  let promoted = 0;
  let skipped = 0;

  for (const page of allPages) {
    const draft = page.draftBlocks as any;
    const published = page.publishedBlocks as any;
    const hasDraftTree = Boolean(draft?.rootIds && draft?.nodes);
    const hasPublishedTree = Boolean(published?.rootIds && published?.nodes);

    if (hasPublishedTree) {
      console.log(`= ${page.slug.padEnd(28)} already has a published tree — skipped`);
      skipped++;
      continue;
    }

    if (!hasDraftTree) {
      console.log(`- ${page.slug.padEnd(28)} no draft tree — skipped (keeps current rendering)`);
      skipped++;
      continue;
    }

    const nodeCount = Object.keys(draft.nodes).length;
    console.log(`→ ${page.slug.padEnd(28)} promoting draft tree (${nodeCount} nodes)${apply ? '' : ' [DRY-RUN]'}`);

    if (!apply) {
      promoted++;
      continue;
    }

    await db
      .update(pages)
      .set({
        publishedBlocks: draft,
        schemaVersion: 2,
        updatedAt: new Date(),
      })
      .where(eq(pages.slug, page.slug));

    await db.insert(pageRevisions).values({
      pageSlug: page.slug,
      contentBlocks: draft as any,
      schemaVersion: 2,
      isPublishedSnapshot: true,
      status: 'PUBLISHED',
      savedByName: 'publish-all-trees script',
      note: `Promoted existing draft tree to published (${nodeCount} nodes)`,
      savedAt: new Date(),
    });

    promoted++;
  }

  console.log(`\nDone. ${apply ? 'Promoted' : 'Would promote'}: ${promoted}, skipped: ${skipped}`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
