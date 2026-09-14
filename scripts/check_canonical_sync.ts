import path from 'node:path';
import { config as loadEnv } from 'dotenv';
loadEnv({ path: path.resolve(process.cwd(), 'packages/db/.env') });

import { ALL_CANONICAL_PAGE_SLUGS, getCanonicalPageTree } from '../packages/shared/src';

async function checkSync() {
  const { db } = await import('../packages/db/src/client');

  const allDbPages = await db.query.pages.findMany();
  console.log(`Found ${allDbPages.length} pages in DB`);

  for (const slug of ALL_CANONICAL_PAGE_SLUGS) {
    const dbPage = allDbPages.find(p => p.slug === slug);
    const tree = getCanonicalPageTree(slug);
    if (!dbPage) {
      console.log(`[MISSING IN DB] ${slug}`);
    } else if (!dbPage.publishedBlocks) {
      console.log(`[NO PUBLISHED BLOCKS] ${slug}`);
    } else {
      const dbRoots = (dbPage.publishedBlocks as any)?.rootIds?.length || 0;
      const treeRoots = tree?.rootIds?.length || 0;
      const dbNodes = Object.keys((dbPage.publishedBlocks as any)?.nodes || {}).length;
      const treeNodes = Object.keys(tree?.nodes || {}).length;
      console.log(`[SYNCED] ${slug.padEnd(30)} dbRoots=${dbRoots} treeRoots=${treeRoots} dbNodes=${dbNodes} treeNodes=${treeNodes}`);
    }
  }
}

checkSync().catch(console.error);
