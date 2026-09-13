import path from 'path';
import { config } from 'dotenv';
config({ path: path.resolve(__dirname, '../packages/db/.env') });

import { eq } from 'drizzle-orm';
import { db } from '../packages/db/src/client';
import { pages, pageRevisions } from '../packages/db/src/schema';
import { getCanonicalPageTree, ALL_CANONICAL_PAGE_SLUGS } from '../packages/shared/src/index';

const PAGE_TITLES: Record<string, string> = {
  '/': 'Home - Advisory for Sustainable Growth',
  '/about': 'About Envint',
  '/services': 'Services & Advisory Capabilities',
  '/careers-at-envint': 'Careers at Envint',
  '/mapsense': 'MapSense - Physical Climate Risk Intelligence',
  '/connect': 'Connect with Envint',
  '/sustainability-integration': 'Sustainability Integration Practice',
  '/climate-action': 'Climate Action & Decarbonisation Practice',
  '/responsible-investment': 'Responsible Investment & ESG Due Diligence Practice',
  '/impact': 'Impact & Case Studies',
  '/enviki': 'Enviki - Climate & ESG Knowledge Base',
  '/disclaimer': 'Disclaimer & Legal Notices',
  '/envision': 'Envision - Strategic Insights',
  '/behind-the-buzz': 'Behind the Buzz - Industry Analysis',
  '/how-to-articles': 'How-To Articles & Guides',
  '/glossary-zone': 'ESG & Climate Glossary Zone',
  '/esq': 'ESQ - Environmental, Social & Governance Quarterly',
  '/connect-gbc2024': 'Envint at Global Business Challenge 2024',
};

async function main() {
  console.log('🚀 Seeding authentic Schema v2 trees for all 18 pages...\n');

  let successCount = 0;

  for (const slug of ALL_CANONICAL_PAGE_SLUGS) {
    const tree = getCanonicalPageTree(slug);
    if (!tree) {
      console.warn(`⚠️ No canonical tree found for slug: ${slug}`);
      continue;
    }

    const title = PAGE_TITLES[slug] || slug;
    const rootCount = tree.rootIds.length;
    const nodeCount = Object.keys(tree.nodes).length;

    console.log(`Processing [${slug}]: ${rootCount} sections, ${nodeCount} elements...`);

    // Check if page exists in DB
    const existing = await db.query.pages.findFirst({
      where: eq(pages.slug, slug),
    });

    if (existing) {
      // Update draftBlocks, schemaVersion, and updatedAt
      // Note: For /about, publishedBlocks is also kept in sync since it is already published in v2
      const updateData: any = {
        title: existing.title || title,
        draftBlocks: tree,
        schemaVersion: 2,
        updatedAt: new Date(),
      };

      if (slug === '/about') {
        updateData.publishedBlocks = tree;
      }

      await db
        .update(pages)
        .set(updateData)
        .where(eq(pages.slug, slug));

      console.log(`  ✓ Updated existing page draft_blocks`);
    } else {
      // Insert new page record
      await db.insert(pages).values({
        slug,
        title,
        seoTitle: title,
        seoDescription: `Envint advisory solutions and intelligence for ${title}.`,
        layoutTemplate: 'standard',
        draftBlocks: tree,
        schemaVersion: 2,
        status: 'PUBLISHED',
        updatedAt: new Date(),
      });
      console.log(`  ✓ Inserted new page record`);
    }

    // Record revision snapshot
    await db.insert(pageRevisions).values({
      pageSlug: slug,
      contentBlocks: tree as any,
      schemaVersion: 2,
      isPublishedSnapshot: slug === '/about',
      status: 'DRAFT',
      savedByName: 'Canonical Tree Migration',
      note: `Canonical Schema v2 Tree Initial Draft (${rootCount} sections, ${nodeCount} elements)`,
      savedAt: new Date(),
    });

    successCount++;
  }

  console.log(`\n🎉 Successfully seeded ${successCount} / ${ALL_CANONICAL_PAGE_SLUGS.length} page trees into Neon Postgres!\n`);
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Error during tree seeding:', err);
  process.exit(1);
});
