import path from 'path';
import { config } from 'dotenv';
config({ path: path.resolve(__dirname, '../packages/db/.env') });

import { db } from '../packages/db/src/client';

/** Dump the structure of a page's draft tree: sections + key content. */
async function main() {
  const slug = process.argv[2] || '/services';
  const page = await db.query.pages.findFirst({ where: (p, { eq }) => eq(p.slug, slug) });
  if (!page) { console.error(`No page: ${slug}`); process.exit(1); }

  const tree = page.draftBlocks as any;
  if (!tree?.rootIds) { console.error('No draft tree'); process.exit(1); }

  console.log(`=== ${slug} draft tree: ${tree.rootIds.length} sections, ${Object.keys(tree.nodes).length} nodes ===\n`);

  for (const rootId of tree.rootIds) {
    const sec = tree.nodes[rootId];
    if (!sec) { console.log(`- ${rootId} (MISSING)`); continue; }
    const bg = sec.styles?.backgroundImage ? ' [bg-image]' : '';
    console.log(`■ ${sec.name} (${sec.type})${bg}`);
    printChildren(tree, sec.children, 1);
    console.log('');
  }
  process.exit(0);
}

function printChildren(tree: any, ids: string[] | undefined, depth: number) {
  if (!ids) return;
  for (const id of ids) {
    const n = tree.nodes[id];
    if (!n) { console.log(`${'  '.repeat(depth)}- ${id} (MISSING)`); continue; }
    let detail = '';
    if (n.content?.text) detail = `"${String(n.content.text).slice(0, 60)}"`;
    else if (n.content?.html) detail = `"${String(n.content.html).replace(/<[^>]*>/g, '').slice(0, 60)}"`;
    else if (n.content?.src) detail = `img=${n.content.src}`;
    else if (n.content?.label) detail = `btn="${n.content.label}"`;
    console.log(`${'  '.repeat(depth)}- ${n.type}: ${n.name} ${detail}`);
    printChildren(tree, n.children, depth + 1);
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
