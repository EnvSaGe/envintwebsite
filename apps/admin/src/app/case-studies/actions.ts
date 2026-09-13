'use server';

import { db, impactCaseStudies, eq } from '@envint/db';
import { requireRole } from '@/lib/clerk-rbac';
import { dispatchRevalidation } from '@/lib/revalidate-dispatcher';

export async function fetchImpacts() {
  await requireRole(['super_admin', 'editor']);

  const records = await db.query.impactCaseStudies.findMany({
    orderBy: (i, { asc }) => [asc(i.orderIndex)],
    with: { service: true, sector: true, theme: true, coverImage: true },
  });

  return records.map((r) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    summary: r.summary,
    clientType: r.clientType,
    contentHtml: r.contentHtml,
    coverImageUrl: r.coverImageUrl || r.coverImage?.url || null,
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
  }));
}

export async function fetchImpactBySlug(slug: string) {
  await requireRole(['super_admin', 'editor']);

  const record = await db.query.impactCaseStudies.findFirst({
    where: eq(impactCaseStudies.slug, slug),
    with: { service: true, sector: true, theme: true, coverImage: true },
  });

  if (!record) return null;

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
  summary: string;
  clientType?: string;
  challenge?: string;
  solution?: string;
  outcome?: string;
  contentHtml?: string;
  coverImageUrl?: string;
  status?: 'DRAFT' | 'PUBLISHED';
  orderIndex?: number;
  seoTitle?: string;
  seoDescription?: string;
  scheduledAt?: string | null;
}) {
  await requireRole(['super_admin', 'editor']);

  if (!impact.slug || !impact.title || !impact.summary) {
    throw new Error('Impact slug, title, and summary are required.');
  }

  const status = impact.status || 'DRAFT';
  const scheduledAt = impact.scheduledAt ? new Date(impact.scheduledAt) : null;

  await db
    .insert(impactCaseStudies)
    .values({
      slug: impact.slug,
      title: impact.title,
      summary: impact.summary,
      clientType: impact.clientType || null,
      challenge: impact.challenge || null,
      solution: impact.solution || null,
      outcome: impact.outcome || null,
      contentHtml: impact.contentHtml || null,
      coverImageUrl: impact.coverImageUrl || null,
      orderIndex: impact.orderIndex ?? 0,
      status,
      scheduledAt,
      seoTitle: impact.seoTitle || impact.title,
      seoDescription: impact.seoDescription || impact.summary || null,
      publishedAt: status === 'PUBLISHED' ? new Date() : null,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: impactCaseStudies.slug,
      set: {
        title: impact.title,
        summary: impact.summary,
        clientType: impact.clientType || null,
        challenge: impact.challenge || null,
        solution: impact.solution || null,
        outcome: impact.outcome || null,
        contentHtml: impact.contentHtml || null,
        coverImageUrl: impact.coverImageUrl || null,
        orderIndex: impact.orderIndex ?? 0,
        status,
        scheduledAt,
        seoTitle: impact.seoTitle || impact.title,
        seoDescription: impact.seoDescription || null,
        updatedAt: new Date(),
        ...(status === 'PUBLISHED' ? { publishedAt: new Date() } : {}),
      },
    });

  if (status === 'PUBLISHED') {
    await dispatchRevalidation({
      tags: ['impacts:list', `impact:${impact.slug}`, `record:impact:${impact.slug}`, 'archive:impact'],
      paths: [`/impact/${impact.slug}/`, '/impact/'],
    });
  }

  return { success: true };
}

export async function publishImpactAction(slug: string) {
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
}

export async function deleteImpactAction(slug: string) {
  await requireRole(['super_admin']);

  const record = await db.query.impactCaseStudies.findFirst({
    where: eq(impactCaseStudies.slug, slug),
    columns: { id: true },
  });

  if (!record) throw new Error(`Impact case study not found: ${slug}`);

  await db.delete(impactCaseStudies).where(eq(impactCaseStudies.id, record.id));

  await dispatchRevalidation({
    tags: ['impacts:list', `impact:${slug}`, `record:impact:${slug}`, 'archive:impact'],
    paths: [`/impact/${slug}/`, '/impact/'],
  });

  return { success: true };
}
