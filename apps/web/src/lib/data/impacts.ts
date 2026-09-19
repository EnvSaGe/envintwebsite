import { db, impactCaseStudies, eq, and, asc } from '@envint/db';
import { unstable_cache } from 'next/cache';
import localImpacts from '@/data/impacts.json';
import { resolveCmsImage } from '@envint/shared';

function sanitizeImpact(item: any) {
  if (!item) return null;
  const local = (localImpacts as any[]).find((l: any) => l.slug === item.slug);
  const heroImage = resolveCmsImage(
    item.coverImageUrl ||
    item.coverImage?.url ||
    local?.heroImage ||
    local?.coverImage?.url ||
    '/images/services-sustainability.webp'
  );

  return {
    ...local,
    ...item,
    title: item.title ? String(item.title).replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1').trim() : (local?.title || ''),
    summary: item.summary ? String(item.summary).replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1').trim() : (local?.summary || ''),
    cardExcerpt: item.cardExcerpt || local?.cardExcerpt || item.summary || local?.summary || '',
    heroImage,
    categories:
      item.categories && item.categories.length > 0
        ? item.categories
        : item.keyMetrics && typeof item.keyMetrics === 'object' && Array.isArray((item.keyMetrics as any).categories) && (item.keyMetrics as any).categories.length > 0
        ? (item.keyMetrics as any).categories
        : local?.categories || [],
  };
}

export async function getImpacts() {
  return unstable_cache(
    async () => {
      try {
        const records = await db.query.impactCaseStudies.findMany({
          where: eq(impactCaseStudies.status, 'PUBLISHED'),
          orderBy: [asc(impactCaseStudies.orderIndex)],
          with: { service: true, sector: true, theme: true, coverImage: true },
        });
        if (records && records.length > 0) {
          return records.map(sanitizeImpact);
        }
      } catch {
        // Fallback to local canonical data
      }
      return (localImpacts as any[]).map(sanitizeImpact);
    },
    ['impacts-list-clean-v4'],
    { tags: ['impacts:list'] }
  )();
}

export async function getImpact(slug: string) {
  return unstable_cache(
    async () => {
      try {
        const record = await db.query.impactCaseStudies.findFirst({
          where: and(eq(impactCaseStudies.slug, slug), eq(impactCaseStudies.status, 'PUBLISHED')),
          with: { service: true, sector: true, theme: true, coverImage: true },
        });
        if (record) return sanitizeImpact(record);
      } catch {
        // Fallback to local canonical data
      }
      const found = localImpacts.find((item: any) => item.slug === slug);
      return found ? sanitizeImpact(found) : null;
    },
    [`impact-clean-v4-${slug}`],
    { tags: [`impact:${slug}`] }
  )();
}

export async function getImpactAdjacentSlugs(slug: string) {
  const all = await getImpacts();
  const index = all.findIndex((a: any) => a.slug === slug);
  if (index === -1) {
    return { previous: null, next: null };
  }
  const previous = index > 0 ? all[index - 1] : null;
  const next = index < all.length - 1 ? all[index + 1] : null;
  return { previous, next };
}
