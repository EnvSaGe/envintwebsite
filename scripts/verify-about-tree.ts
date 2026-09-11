import path from 'path';
import { config } from 'dotenv';
config({ path: path.resolve(__dirname, '../packages/db/.env') });

import { eq } from 'drizzle-orm';
import { db } from '../packages/db/src/client';
import { pages } from '../packages/db/src/schema';

async function main() {
  const page = await db.query.pages.findFirst({
    where: eq(pages.slug, '/about'),
  });

  if (!page) {
    console.error('Page /about not found!');
    process.exit(1);
  }

  console.log(`Page: ${page.title} (${page.slug})`);
  console.log(`Status: ${page.status}`);
  console.log(`Schema Version: ${page.schemaVersion}`);

  const pub = page.publishedBlocks as any;
  console.log(`Published Blocks Version: ${pub?.version}`);
  console.log(`Root IDs:`, pub?.rootIds);
  console.log(`Total Nodes:`, Object.keys(pub?.nodes || {}).length);

  const sec2 = pub?.nodes['sec_about_purpose'];
  console.log(`\nSection 2: ${sec2?.name} (Type: ${sec2?.type})`);
  const h2 = pub?.nodes['h2_purpose'];
  console.log(`Section 2 Headline Text: "${h2?.content?.text}"`);
  console.log(`Section 2 Headline Tag: ${h2?.content?.tag}`);
  console.log(`Section 2 Headline Font: ${h2?.styles?.fontSize}, Color: ${h2?.styles?.textColor}`);

  const p1 = pub?.nodes['p1_purpose'];
  console.log(`Section 2 Paragraph 1: "${p1?.content?.html}"`);

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
