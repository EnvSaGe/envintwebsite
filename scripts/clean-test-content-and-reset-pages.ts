import path from 'node:path';
import { config as loadEnv } from 'dotenv';
import { getCanonicalPageTree } from '../packages/shared/src/page-trees';

loadEnv({ path: path.resolve(process.cwd(), 'apps/admin/.env.local') });
loadEnv({ path: path.resolve(process.cwd(), 'packages/db/.env') });

async function main() {
  const { db, pages, impactCaseStudies, insights, eq, or, ilike } = await import('../packages/db/src');

  console.log('=== 1. CHECKING FOR TEST CASE STUDIES IN impact_case_studies ===');
  const allCaseStudies = await db.select().from(impactCaseStudies);
  for (const cs of allCaseStudies) {
    const isTest = cs.slug.includes('test') || cs.title.toLowerCase().includes('test');
    if (isTest) {
      console.log(`Deleting test case study: "${cs.title}" (slug: ${cs.slug}, id: ${cs.id})`);
      await db.delete(impactCaseStudies).where(eq(impactCaseStudies.id, cs.id));
    }
  }

  console.log('\n=== 2. CHECKING FOR TEST INSIGHTS/ARTICLES ===');
  const allInsights = await db.select().from(insights);
  for (const ins of allInsights) {
    const isTest = ins.slug.includes('test') || ins.title.toLowerCase().includes('test');
    if (isTest) {
      console.log(`Deleting test insight: "${ins.title}" (slug: ${ins.slug}, id: ${ins.id})`);
      await db.delete(insights).where(eq(insights.id, ins.id));
    }
  }

  console.log('\n=== 3. RESETTING ALL 18 CANONICAL PAGES TO CLEAN TREES ===');
  const allPages = await db.select().from(pages);
  for (const p of allPages) {
    const isTestPage = p.slug.includes('test') || p.slug.includes('copy');
    if (isTestPage) {
      console.log(`Deleting test page: "${p.title}" (slug: ${p.slug}, id: ${p.id})`);
      await db.delete(pages).where(eq(pages.id, p.id));
      continue;
    }

    const canonicalTree = getCanonicalPageTree(p.slug);
    if (!canonicalTree) {
      console.warn(`No canonical tree for slug: ${p.slug}, skipping reset.`);
      continue;
    }

    console.log(`Resetting page "${p.title}" (${p.slug})...`);
    await db.update(pages).set({
      draftBlocks: canonicalTree,
      publishedBlocks: canonicalTree,
      schemaVersion: 2,
      updatedAt: new Date(),
      publishedAt: new Date(),
    }).where(eq(pages.id, p.id));
  }

  console.log('\n=== 4. VERIFYING HOMEPAGE BLOCKS IN DB ===');
  const [home] = await db.select().from(pages).where(eq(pages.slug, '/'));
  const draft = home.draftBlocks as any;
  const pub = home.publishedBlocks as any;
  console.log('Homepage draft img_vantage:', draft?.nodes?.img_vantage?.content);
  console.log('Homepage draft btn_vantage_read:', draft?.nodes?.btn_vantage_read?.content);
  console.log('Homepage pub img_vantage:', pub?.nodes?.img_vantage?.content);
  console.log('Homepage pub btn_vantage_read:', pub?.nodes?.btn_vantage_read?.content);

  console.log('\n✓ Database cleanup and canonical reset complete!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
