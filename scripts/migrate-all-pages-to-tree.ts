import path from 'path';
import { config } from 'dotenv';
config({ path: path.resolve(__dirname, '../packages/db/.env') });

import { eq } from 'drizzle-orm';
import { db } from '../packages/db/src/client';
import { pages, pageRevisions } from '../packages/db/src/schema';
import { convertLegacyPageBlocksToTree } from '../packages/shared/src/legacy-converter';

async function main() {
  console.log('Starting migration of all pages to Schema v2 Dynamic Element Trees...\n');

  const allPages = await db.query.pages.findMany({
    orderBy: (p, { asc }) => [asc(p.slug)],
  });

  console.log(`Found ${allPages.length} total pages in database.`);

  let migratedCount = 0;
  let skippedCount = 0;

  for (const page of allPages) {
    if (page.slug === '/about') {
      console.log(`- Skipping "/about" (already hand-tuned Schema v2 with 30 nodes).`);
      skippedCount++;
      continue;
    }

    const legacyBlocks = (page.contentBlocks as any[]) || [];
    if (legacyBlocks.length === 0) {
      console.log(`- Skipping "${page.slug}" (no legacy content blocks to convert).`);
      skippedCount++;
      continue;
    }

    // Convert legacy blocks into Schema v2 element tree
    const tree = convertLegacyPageBlocksToTree(legacyBlocks, page.slug, page.title);
    const nodeCount = Object.keys(tree.nodes).length;

    console.log(`Migrating "${page.slug}" (${page.title}):`);
    console.log(`  - Converted ${legacyBlocks.length} legacy blocks -> ${tree.rootIds.length} root sections, ${nodeCount} total element nodes.`);

    // Update database record
    await db
      .update(pages)
      .set({
        publishedBlocks: tree,
        draftBlocks: tree,
        schemaVersion: 2,
        updatedAt: new Date(),
      })
      .where(eq(pages.slug, page.slug));

    // Snapshot in pageRevisions
    await db.insert(pageRevisions).values({
      pageSlug: page.slug,
      contentBlocks: tree as any,
      schemaVersion: 2,
      isPublishedSnapshot: true,
      status: page.status || 'PUBLISHED',
      savedByName: 'Schema v2 Migration Script',
      note: `Automated migration of ${legacyBlocks.length} blocks to Schema v2 Element Tree (${nodeCount} nodes)`,
      savedAt: new Date(),
    });

    migratedCount++;
  }

  console.log(`\n======================================================`);
  console.log(`MIGRATION COMPLETE!`);
  console.log(`Total Migrated: ${migratedCount} pages`);
  console.log(`Total Skipped / Retained: ${skippedCount} pages`);
  console.log(`======================================================`);

  process.exit(0);
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
