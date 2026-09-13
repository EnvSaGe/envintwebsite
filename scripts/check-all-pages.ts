import path from 'path';
import { config } from 'dotenv';
config({ path: path.resolve(__dirname, '../apps/web/.env.local') });

import { db } from '../packages/db/src/client';
import { pages } from '../packages/db/src/schema';

async function main() {
  const all = await db.query.pages.findMany();
  console.log(`TOTAL PAGES IN DB: ${all.length}\n`);
  for (const p of all) {
    const hasPub = !!p.publishedBlocks;
    const blocksCount = Array.isArray(p.contentBlocks) ? p.contentBlocks.length : 0;
    console.log(`SLUG: ${p.slug} | TITLE: ${p.title} | SCHEMA: ${p.schemaVersion} | PUBLISHED_BLOCKS: ${hasPub} | CONTENT_BLOCKS: ${blocksCount}`);
  }
}

main().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
