import path from 'path';
import { config } from 'dotenv';
config({ path: path.resolve(__dirname, '../apps/web/.env.local') });

import { db } from '../packages/db/src/client';
import { insights } from '../packages/db/src/schema';
import { eq } from 'drizzle-orm';
import localInsights from '../apps/web/src/data/insights.json';

async function main() {
  console.log('--- LOCAL INSIGHTS ---');
  console.log('Count:', localInsights.length);
  const localEnvision = localInsights.filter((a: any) =>
    (a.categories || []).some((c: string) => c.toLowerCase().includes('envision'))
  );
  console.log('Local envision count:', localEnvision.length);
  console.log('Sample local categories:', localInsights.slice(0, 3).map((a: any) => ({ slug: a.slug, categories: a.categories })));

  console.log('\n--- DB INSIGHTS ---');
  const allCats = await db.query.categories.findMany();
  console.log('Categories in DB count:', allCats.length);
  const allLinks = await db.query.insightCategories.findMany();
  console.log('InsightCategories links in DB count:', allLinks.length);
  const catMap = new Map(allCats.map((c: any) => [c.id, c.name]));
  const insightCatMap = new Map<string, string[]>();
  for (const link of allLinks as any[]) {
    const name = catMap.get(link.categoryId);
    if (name) {
      const list = insightCatMap.get(link.insightId) || [];
      list.push(name);
      insightCatMap.set(link.insightId, list);
    }
  }
  const { getImpacts } = await import('../apps/web/src/lib/data/impacts');
  const imps = await getImpacts();
  console.log('\n--- IMPACTS AUDIT ---');
  console.log('Impacts count:', imps.length);
  const images = imps.map((i: any) => ({ slug: i.slug, heroImage: i.heroImage }));
  const uniqueImages = new Set(images.map((i: any) => i.heroImage));
  console.log('Unique images count:', uniqueImages.size, 'out of', imps.length);
  console.log('First 5 impact images:', images.slice(0, 5));

  const dbRecords = await db.query.insights.findMany({
    where: eq(insights.status, 'PUBLISHED'),
  });
  console.log('DB insights count:', dbRecords.length);

  const localBySlug = new Map((localInsights as any[]).map((l: any) => [l.slug, l]));
  const enriched = dbRecords.map((r: any) => {
    const local = localBySlug.get(r.slug);
    const dbCats = insightCatMap.get(r.id);
    return {
      ...local,
      ...r,
      heroImage: r.coverImageUrl || r.coverImage?.url || local?.heroImage || '/images/services-climate.webp',
      categories: (dbCats && dbCats.length > 0) ? dbCats : (local?.categories || []),
    };
  });

  const envisionArticles = enriched.filter((a: any) =>
    (a.categories || []).some((c: string) => c.toLowerCase().includes('envision'))
  );
  console.log('Enriched Envision count:', envisionArticles.length);
  console.log('Sample Envision article:', {
    slug: envisionArticles[0]?.slug,
    title: envisionArticles[0]?.title,
    categories: envisionArticles[0]?.categories,
    heroImage: envisionArticles[0]?.heroImage,
  });
}

main().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
