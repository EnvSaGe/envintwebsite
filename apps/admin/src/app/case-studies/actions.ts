'use server';

import { db, impactCaseStudies, eq } from '@envint/db';
import { requireRole } from '@/lib/clerk-rbac';
import { dispatchRevalidation } from '@/lib/revalidate-dispatcher';
import localImpacts from '@/data/impacts.json';

export async function fetchImpacts() {
  await requireRole(['super_admin', 'editor']);

  const records = await db.query.impactCaseStudies.findMany({
    orderBy: (i, { asc }) => [asc(i.orderIndex)],
    with: { service: true, sector: true, theme: true, coverImage: true },
  });

  return records.map((r) => {
    const local = (localImpacts as any[]).find((l) => l.slug === r.slug);
    const metricsCategories =
      r.keyMetrics && typeof r.keyMetrics === 'object' && !Array.isArray(r.keyMetrics)
        ? (r.keyMetrics as any).categories
        : null;
    const categories =
      Array.isArray(metricsCategories) && metricsCategories.length > 0
        ? metricsCategories
        : (local?.categories || [r.service?.title, r.sector?.name, r.theme?.name].filter(Boolean));

    return {
      id: r.id,
      slug: r.slug,
      title: r.title,
      summary: r.summary,
      clientType: r.clientType,
      contentHtml: r.contentHtml,
      coverImageUrl: r.coverImageUrl || r.coverImage?.url || null,
      categories: categories || [],
      orderIndex: r.orderIndex,
      status: r.status,
      seoTitle: r.seoTitle,
      seoDescription: r.seoDescription,
      publishedAt: r.publishedAt ? new Date(r.publishedAt).toISOString().split('T')[0] : null,
      updatedAt: r.updatedAt ? new Date(r.updatedAt).toLocaleDateString() : 'Never',
      serviceName: r.service?.title || null,
      sectorName: r.sector?.name || null,
      themeName: r.theme?.name || null,
      scheduledAt: r.scheduledAt ? new Date(r.scheduledAt).toISOString() : null,
    };
  });
}

export async function fetchImpactBySlug(slug: string) {
  await requireRole(['super_admin', 'editor']);

  const record = await db.query.impactCaseStudies.findFirst({
    where: eq(impactCaseStudies.slug, slug),
    with: { service: true, sector: true, theme: true, coverImage: true },
  });

  if (!record) return null;

  const local = (localImpacts as any[]).find((l) => l.slug === record.slug);
  const metricsCategories =
    record.keyMetrics && typeof record.keyMetrics === 'object' && !Array.isArray(record.keyMetrics)
      ? (record.keyMetrics as any).categories
      : null;
  const categories =
    Array.isArray(metricsCategories) && metricsCategories.length > 0
      ? metricsCategories
      : (local?.categories || [record.service?.title, record.sector?.name, record.theme?.name].filter(Boolean));

  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    summary: record.summary,
    clientType: record.clientType,
    challenge: record.challenge,
    solution: record.solution,
    outcome: record.outcome,
    contentHtml: record.contentHtml,
    keyMetrics: record.keyMetrics,
    categories: categories || [],
    coverImageUrl: record.coverImageUrl || record.coverImage?.url || null,
    orderIndex: record.orderIndex,
    status: record.status,
    seoTitle: record.seoTitle,
    seoDescription: record.seoDescription,
    publishedAt: record.publishedAt?.toISOString() || null,
    scheduledAt: record.scheduledAt?.toISOString() || null,
  };
}

export async function saveImpactAction(impact: {
  slug: string;
  title: string;
  summary?: string;
  clientType?: string;
  challenge?: string;
  solution?: string;
  outcome?: string;
  contentHtml?: string;
  coverImageUrl?: string;
  categories?: string[];
  status?: 'DRAFT' | 'PUBLISHED';
  orderIndex?: number;
  seoTitle?: string;
  seoDescription?: string;
  scheduledAt?: string | null;
}): Promise<{ success: boolean; error?: string }> {
  try {
    await requireRole(['super_admin', 'editor']);

    const cleanTitle = impact.title?.trim() || '';
    const cleanSlug = impact.slug?.trim().toLowerCase().replace(/[^a-z0-9-/]/g, '-').replace(/^\/+|\/+$/g, '') || '';

    if (!cleanSlug || !cleanTitle) {
      return { success: false, error: 'Impact slug and title are required.' };
    }

    const summary = impact.summary?.trim() || cleanTitle;
    const status = impact.status || 'DRAFT';
    const scheduledAt = impact.scheduledAt ? new Date(impact.scheduledAt) : null;

    const keyMetricsPayload = {
      categories: impact.categories || [],
    };

    await db
      .insert(impactCaseStudies)
      .values({
        slug: cleanSlug,
        title: cleanTitle,
        summary,
        clientType: impact.clientType || null,
        challenge: impact.challenge || null,
        solution: impact.solution || null,
        outcome: impact.outcome || null,
        contentHtml: impact.contentHtml || null,
        coverImageUrl: impact.coverImageUrl || null,
        keyMetrics: keyMetricsPayload,
        orderIndex: impact.orderIndex ?? 0,
        status,
        scheduledAt,
        seoTitle: impact.seoTitle || cleanTitle,
        seoDescription: impact.seoDescription || summary || null,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: impactCaseStudies.slug,
        set: {
          title: cleanTitle,
          summary,
          clientType: impact.clientType || null,
          challenge: impact.challenge || null,
          solution: impact.solution || null,
          outcome: impact.outcome || null,
          contentHtml: impact.contentHtml || null,
          coverImageUrl: impact.coverImageUrl || null,
          keyMetrics: keyMetricsPayload,
          orderIndex: impact.orderIndex ?? 0,
          status,
          scheduledAt,
          seoTitle: impact.seoTitle || cleanTitle,
          seoDescription: impact.seoDescription || null,
          updatedAt: new Date(),
          ...(status === 'PUBLISHED' ? { publishedAt: new Date() } : {}),
        },
      });

    if (status === 'PUBLISHED') {
      await dispatchRevalidation({
        tags: ['impacts:list', `impact:${cleanSlug}`, `record:impact:${cleanSlug}`, 'archive:impact'],
        paths: [`/impact/${cleanSlug}/`, '/impact/'],
      });
    }

    return { success: true };
  } catch (err: any) {
    console.error('saveImpactAction error:', err);
    return { success: false, error: err.message || 'Failed to save case study.' };
  }
}

export async function publishImpactAction(slug: string): Promise<{ success: boolean; error?: string }> {
  try {
    await requireRole(['super_admin', 'editor']);

    await db
      .update(impactCaseStudies)
      .set({ status: 'PUBLISHED', publishedAt: new Date(), updatedAt: new Date(), scheduledAt: null })
      .where(eq(impactCaseStudies.slug, slug));

    await dispatchRevalidation({
      tags: ['impacts:list', `impact:${slug}`, `record:impact:${slug}`, 'archive:impact'],
      paths: [`/impact/${slug}/`, '/impact/'],
    });

    return { success: true };
  } catch (err: any) {
    console.error('publishImpactAction error:', err);
    return { success: false, error: err.message || 'Failed to publish case study.' };
  }
}

export async function deleteImpactAction(slug: string): Promise<{ success: boolean; error?: string }> {
  try {
    await requireRole(['super_admin', 'editor']);

    const record = await db.query.impactCaseStudies.findFirst({
      where: eq(impactCaseStudies.slug, slug),
      columns: { id: true },
    });

    if (!record) {
      return { success: false, error: `Impact case study not found: ${slug}` };
    }

    await db.delete(impactCaseStudies).where(eq(impactCaseStudies.id, record.id));

    await dispatchRevalidation({
      tags: ['impacts:list', `impact:${slug}`, `record:impact:${slug}`, 'archive:impact'],
      paths: [`/impact/${slug}/`, '/impact/'],
    });

    return { success: true };
  } catch (err: any) {
    console.error('deleteImpactAction error:', err);
    return { success: false, error: err.message || 'Failed to delete case study.' };
  }
}
