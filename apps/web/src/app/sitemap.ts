import { MetadataRoute } from 'next';
import { getInsights } from '@/lib/data/insights';
import { getImpacts } from '@/lib/data/impacts';
import { getTeamMembers } from '@/lib/data/team';
import { db, pages, eq } from '@envint/db';
import archiveRoutes from '@/data/archive-routes.json';

/** Priority mapping based on slug patterns */
function slugPriority(slug: string): number {
  if (slug === '/') return 1.0;
  if (['/services', '/impact', '/connect', '/about'].includes(slug)) return 0.9;
  if (['/sustainability-integration', '/climate-action', '/responsible-investment'].some((s) => slug.startsWith(s))) return 0.8;
  if (['/envision', '/enviki'].some((s) => slug.startsWith(s))) return 0.8;
  return 0.7;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://envintglobal.com';
  const now = new Date();

  // ── 1. DB-driven CMS pages ────────────────────────────────────────────────
  let cmsPageEntries: MetadataRoute.Sitemap = [];
  try {
    const publishedPages = await db.query.pages.findMany({
      where: eq(pages.status, 'PUBLISHED'),
      columns: { slug: true, updatedAt: true },
    });
    cmsPageEntries = publishedPages.map((p) => ({
      url: `${baseUrl}${p.slug === '/' ? '' : p.slug}/`,
      lastModified: p.updatedAt || now,
      changeFrequency: 'weekly' as const,
      priority: slugPriority(p.slug),
    }));
  } catch (err) {
    console.warn('[sitemap] DB page query failed, using fallback list:', err);
    // Fallback to static list if DB is unavailable
    cmsPageEntries = [
      { url: `${baseUrl}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
      { url: `${baseUrl}/about/`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
      { url: `${baseUrl}/services/`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
      { url: `${baseUrl}/impact/`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
      { url: `${baseUrl}/careers-at-envint/`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
      { url: `${baseUrl}/connect/`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
      { url: `${baseUrl}/sustainability-integration/`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
      { url: `${baseUrl}/climate-action/`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
      { url: `${baseUrl}/responsible-investment/`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
      { url: `${baseUrl}/envision/`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
      { url: `${baseUrl}/enviki/`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
      { url: `${baseUrl}/behind-the-buzz/`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
      { url: `${baseUrl}/glossary-zone/`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
      { url: `${baseUrl}/how-to-articles/`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
      { url: `${baseUrl}/esq/`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
      { url: `${baseUrl}/mapsense/`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
      { url: `${baseUrl}/connect-gbc2024/`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
      { url: `${baseUrl}/disclaimer/`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    ];
  }

  // Author pages
  const authorReviewPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/author/fiona/`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/author/anand/`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];

  // ── 2. Content collections ─────────────────────────────────────────────────
  const [insights, impacts, members] = await Promise.all([
    getInsights(),
    getImpacts(),
    getTeamMembers(),
  ]);

  const insightEntries: MetadataRoute.Sitemap = insights.map((i: any) => ({
    url: `${baseUrl}/${i.slug}/`,
    lastModified: i.updatedAt || now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const impactEntries: MetadataRoute.Sitemap = impacts.map((imp: any) => ({
    url: `${baseUrl}/impact/${imp.slug}/`,
    lastModified: imp.updatedAt || now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const memberEntries: MetadataRoute.Sitemap = members
    .filter((m: any) => m.hasStandaloneRoute === true || (m as any).slug !== 'anand-krishnamurthy')
    .map((m: any) => ({
      url: `${baseUrl}/member/${m.slug}/`,
      lastModified: m.updatedAt || now,
      changeFrequency: 'yearly',
      priority: 0.5,
    }));

  // Taxonomy archives
  const taxonomyEntries: MetadataRoute.Sitemap = (archiveRoutes as { type: string; slug: string }[]).map((r) => ({
    url: `${baseUrl}/${r.type}/${r.slug}/`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [
    ...cmsPageEntries,
    ...authorReviewPages,
    ...insightEntries,
    ...impactEntries,
    ...memberEntries,
    ...taxonomyEntries,
  ];
}
