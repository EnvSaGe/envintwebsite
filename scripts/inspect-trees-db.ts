import path from 'path';
import { config } from 'dotenv';
config({ path: path.resolve(__dirname, '../packages/db/.env') });

import { db } from '../packages/db/src/client';

async function main() {
  const all = await db.query.pages.findMany({
    orderBy: (p, { asc }) => [asc(p.slug)],
  });

  console.log(`Found ${all.length} pages in DB:\n`);
  for (const p of all) {
    const draft = p.draftBlocks as any;
    const pub = p.publishedBlocks as any;
    const hasDraft = Boolean(draft && draft.rootIds && draft.nodes);
    const hasPub = Boolean(pub && pub.rootIds && pub.nodes);
    const draftNodes = hasDraft ? Object.keys(draft.nodes).length : 0;
    const pubNodes = hasPub ? Object.keys(pub.nodes).length : 0;
    const contentBlocks = Array.isArray(p.contentBlocks) ? p.contentBlocks.length : 0;
    console.log(
      `${p.slug.padEnd(28)} status=${p.status.padEnd(9)} schemaV=${p.schemaVersion} ` +
      `contentBlocks=${String(contentBlocks).padEnd(3)} draftTree=${hasDraft ? draftNodes + ' nodes' : '-'} ` +
      `publishedTree=${hasPub ? pubNodes + ' nodes' : '-'}`
    );
  }
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
