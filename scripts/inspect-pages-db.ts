import path from 'path';
import { config } from 'dotenv';
config({ path: path.resolve(__dirname, '../packages/db/.env') });

import { db } from '../packages/db/src/client';
import { pages } from '../packages/db/src/schema';

async function main() {
  const all = await db.query.pages.findMany({
    orderBy: (p, { asc }) => [asc(p.slug)],
  });

  console.log(`Found ${all.length} pages in DB:\n`);
  for (const p of all) {
    const blocks = Array.isArray(p.contentBlocks) ? p.contentBlocks : [];
    console.log(`- Slug: "${p.slug}", Title: "${p.title}", Status: ${p.status}, Blocks: ${blocks.length}`);
    if (blocks.length > 0) {
      console.log(`    Block types: ${blocks.map((b: any) => b.type).join(', ')}`);
    }
  }
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
