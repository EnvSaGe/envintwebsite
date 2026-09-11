import path from 'path';
import { config } from 'dotenv';
config({ path: path.resolve(__dirname, '../packages/db/.env') });

import { eq } from 'drizzle-orm';
import { db } from '../packages/db/src/client';
import { pages, pageRevisions } from '../packages/db/src/schema';
import { createAboutPageTree } from '../packages/shared/src/builder-schema';

async function main() {
  console.log('Seeding Schema v2 Dynamic Block Tree for About Page (/about)...\n');

  const tree = createAboutPageTree();

  console.log(`Generated About Page Tree:`);
  console.log(`- Version: ${tree.version}`);
  console.log(`- Root Sections: ${tree.rootIds.join(', ')} (${tree.rootIds.length} sections)`);
  console.log(`- Total Elements in Tree: ${Object.keys(tree.nodes).length}`);

  // Check section 2 headline
  const h2Node = tree.nodes['h2_purpose'];
  console.log(`- Section 2 Headline: "${h2Node?.content?.text}" (Tag: ${h2Node?.content?.tag})`);

  // Update Neon Postgres
  await db
    .update(pages)
    .set({
      title: 'About Envint',
      publishedBlocks: tree,
      draftBlocks: tree,
      schemaVersion: 2,
      status: 'PUBLISHED',
      updatedAt: new Date(),
    })
    .where(eq(pages.slug, '/about'));

  console.log('✓ Successfully updated /about in Neon Postgres with Schema v2 Dynamic Tree!');

  // Record revision
  await db.insert(pageRevisions).values({
    pageSlug: '/about',
    contentBlocks: tree as any,
    schemaVersion: 2,
    isPublishedSnapshot: true,
    status: 'PUBLISHED',
    savedByName: 'System Migration',
    note: 'Initial Schema v2 Dynamic Tree POC for About Envint',
    savedAt: new Date(),
  });
  console.log('✓ Recorded revision snapshot in page_revisions');

  process.exit(0);
}

main().catch((err) => {
  console.error('Failed to seed about tree:', err);
  process.exit(1);
});
