import { db, insights, eq, and, desc } from '@envint/db';
import { unstable_cache } from 'next/cache';
import localInsights from '@/data/insights.json';
import { resolveCmsImage } from '@envint/shared';

const localBySlug = new Map((localInsights as any[]).map((l: any) => [l.slug, l]));

function enrichRecord(record: any, categoriesList?: string[]) {
  if (!record) return null;
  const local = localBySlug.get(record.slug);
  const categories = (categoriesList && categoriesList.length > 0)
    ? categoriesList
    : (record.categories && record.categories.length > 0 ? record.categories : (local?.categories || []));
  const heroImage = resolveCmsImage(
    record.coverImageUrl ||
    record.coverImage?.url ||
    local?.heroImage ||
    '/images/services-climate.webp'
  );

  return {
    ...local,
    ...record,
    categories,
    tags: record.tags || local?.tags || [],
    heroImage,
    coverImage: heroImage ? { ...(record.coverImage || {}), url: heroImage } : null,
  };
}

export async function getInsights() {
  return unstable_cache(
    async () => {
      try {
        const [records, allCats, allLinks] = await Promise.all([
          db.query.insights.findMany({
            where: eq(insights.status, 'PUBLISHED'),
            orderBy: [desc(insights.publishedAt)],
            with: { author: true, coverImage: true },
          }),
          db.query.categories.findMany().catch(() => []),
          db.query.insightCategories.findMany().catch(() => []),
        ]);

        const catNameMap = new Map((allCats as any[]).map((c: any) => [c.id, c.name]));
        const insightCatMap = new Map<string, string[]>();
        for (const link of (allLinks as any[])) {
          const name = catNameMap.get(link.categoryId);
          if (name) {
            const list = insightCatMap.get(link.insightId) || [];
            list.push(name);
            insightCatMap.set(link.insightId, list);
          }
        }

        if (records && records.length > 0) {
          return records.map((r: any) => enrichRecord(r, insightCatMap.get(r.id)));
        }
      } catch {
        // Fallback to local canonical data
      }
      return (localInsights as any[]).map((l: any) => enrichRecord(l));
    },
    ['insights-list-enriched-v5'],
    { tags: ['insights:list'] }
  )();
}

export async function getInsight(slug: string) {
  return unstable_cache(
    async () => {
      try {
        const record = await db.query.insights.findFirst({
          where: and(eq(insights.slug, slug), eq(insights.status, 'PUBLISHED')),
          with: { author: true, coverImage: true },
        });
        if (record) {
          const links = await db.query.insightCategories.findMany({
            where: (ic: any, { eq: eqOp }: any) => eqOp(ic.insightId, record.id),
          }).catch(() => []);
          let categoriesList: string[] | undefined;
          if (links.length > 0) {
            const catIds = links.map((l: any) => l.categoryId);
            const cats = await db.query.categories.findMany({
              where: (c: any, { inArray }: any) => inArray(c.id, catIds),
            }).catch(() => []);
            categoriesList = cats.map((c: any) => c.name);
          }
          return enrichRecord(record, categoriesList);
        }
      } catch {
        // Fallback to local canonical data
      }
      const found = localInsights.find((item: any) => item.slug === slug);
      return found ? enrichRecord(found) : null;
    },
    [`insight-enriched-v3-${slug}`],
    { tags: [`insight:${slug}`] }
  )();
}

export const getInsightBySlug = getInsight;

export async function getInsightAdjacentSlugs(slug: string) {
  const all = await getInsights();
  const index = all.findIndex((a: any) => a.slug === slug);
  if (index === -1) {
    return { previous: null, next: null };
  }
  const previous = index > 0 ? all[index - 1] : null;
  const next = index < all.length - 1 ? all[index + 1] : null;
  return { previous, next };
}
