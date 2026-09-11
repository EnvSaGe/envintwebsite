import { db, insights, eq, and, desc } from '@envint/db';
import { unstable_cache } from 'next/cache';
import localInsights from '@/data/insights.json';

export async function getInsights() {
  return unstable_cache(
    async () => {
      try {
        const records = await db.query.insights.findMany({
          where: eq(insights.status, 'PUBLISHED'),
          orderBy: [desc(insights.publishedAt)],
          with: { author: true, coverImage: true },
        });
        if (records && records.length > 0) {
          return records;
        }
      } catch {
        // Fallback to local canonical data
      }
      return localInsights;
    },
    ['insights-list'],
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
        if (record) return record;
      } catch {
        // Fallback to local canonical data
      }
      const found = localInsights.find((item: any) => item.slug === slug);
      return found ?? null;
    },
    [`insight-${slug}`],
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
