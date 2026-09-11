'use server';

import { db, pages, pageRevisions, eq } from '@envint/db';
import { requireRole, getCurrentUserInfo } from '@/lib/clerk-rbac';
import { dispatchRevalidation } from '@/lib/revalidate-dispatcher';
import {
  safeValidateBlocks,
  PageBlockTree,
  createAboutPageTree,
  createStarterPageTree,
  convertLegacyPageBlocksToTree,
} from '@envint/shared';

import pagesContentJson from '@/data/pages-content.json';

// ─── Fetch ─────────────────────────────────────────────────────────────────

function getPageCategory(slug: string): 'core' | 'practices' | 'hubs' | 'custom' {
  const coreSlugs = ['/', '/about', '/services', '/careers-at-envint', '/connect', '/impact', '/disclaimer'];
  const practiceSlugs = ['/sustainability-integration', '/climate-action', '/responsible-investment'];
  const hubSlugs = ['/envision', '/behind-the-buzz', '/how-to-articles', '/enviki', '/glossary-zone', '/esq', '/mapsense', '/connect-gbc2024'];

  if (coreSlugs.includes(slug)) return 'core';
  if (practiceSlugs.includes(slug)) return 'practices';
  if (hubSlugs.includes(slug)) return 'hubs';
  return 'custom';
}

export async function fetchPagesList() {
  await requireRole(['super_admin', 'editor']);

  const dbPages = await db.query.pages.findMany({
    orderBy: (p, { desc }) => [desc(p.updatedAt)],
  });

  return dbPages.map((p) => {
    const fallback = (pagesContentJson as Record<string, any>)[p.slug];
    const rawBlocks = Array.isArray(p.contentBlocks) && (p.contentBlocks as any[]).length > 0
      ? (p.contentBlocks as any[])
      : (fallback?.contentBlocks ?? []);

    return {
      slug: p.slug,
      title: p.title || fallback?.title || p.slug,
      category: getPageCategory(p.slug),
      layoutTemplate: p.layoutTemplate || fallback?.layoutTemplate || 'standard',
      sectionsCount: rawBlocks.length,
      status: p.status || fallback?.status || 'PUBLISHED',
      updatedAt: p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : 'Recently',
      scheduledAt: p.scheduledAt ? new Date(p.scheduledAt).toISOString() : null,
    };
  });
}

export async function fetchPageBySlug(slug: string) {
  await requireRole(['super_admin', 'editor']);

  const record = await db.query.pages.findFirst({
    where: eq(pages.slug, slug),
  });

  const fallback = (pagesContentJson as Record<string, any>)[slug];

  if (!record && !fallback) return null;

  const contentBlocks = (Array.isArray(record?.contentBlocks) && (record.contentBlocks as any[]).length > 0)
    ? (record.contentBlocks as any[])
    : (fallback?.contentBlocks ?? []);

  return {
    slug: record?.slug || fallback?.slug || slug,
    title: record?.title || fallback?.title || slug,
    seoTitle: record?.seoTitle || fallback?.seoTitle || record?.title || fallback?.title || slug,
    seoDescription: record?.seoDescription || fallback?.seoDescription || '',
    layoutTemplate: record?.layoutTemplate || fallback?.layoutTemplate || 'standard',
    status: record?.status || fallback?.status || 'PUBLISHED',
    schemaVersion: record?.schemaVersion || 1,
    contentBlocks,
    scheduledAt: record?.scheduledAt ? new Date(record.scheduledAt).toISOString() : null,
  };
}

// ─── Save / Publish ────────────────────────────────────────────────────────

export async function savePageAction(pageData: {
  slug: string;
  title: string;
  seoTitle?: string;
  seoDescription?: string;
  contentBlocks: any[];
  layoutTemplate?: string;
  status?: 'DRAFT' | 'PUBLISHED';
  scheduledAt?: string | null;
}) {
  await requireRole(['super_admin', 'editor']);

  const status = pageData.status || 'DRAFT';

  // Validate block schema — throws ZodError if invalid
  const { success: blocksValid, errors } = safeValidateBlocks(pageData.contentBlocks);
  if (!blocksValid) {
    const messages = errors?.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new Error(`Content block validation failed: ${messages}`);
  }

  const userInfo = await getCurrentUserInfo();
  const scheduledAt = pageData.scheduledAt ? new Date(pageData.scheduledAt) : null;

  // 1. Persist to Neon Postgres
  await db
    .insert(pages)
    .values({
      slug: pageData.slug,
      title: pageData.title,
      seoTitle: pageData.seoTitle,
      seoDescription: pageData.seoDescription,
      layoutTemplate: pageData.layoutTemplate || 'standard',
      contentBlocks: pageData.contentBlocks,
      schemaVersion: 1,
      status,
      scheduledAt,
      updatedAt: new Date(),
      publishedAt: status === 'PUBLISHED' ? new Date() : null,
    })
    .onConflictDoUpdate({
      target: pages.slug,
      set: {
        title: pageData.title,
        seoTitle: pageData.seoTitle,
        seoDescription: pageData.seoDescription,
        contentBlocks: pageData.contentBlocks,
        schemaVersion: 1,
        status,
        scheduledAt,
        layoutTemplate: pageData.layoutTemplate || 'standard',
        updatedAt: new Date(),
        ...(status === 'PUBLISHED' ? { publishedAt: new Date() } : {}),
      },
    });

  // 2. Record revision for audit history
  await db.insert(pageRevisions).values({
    pageSlug: pageData.slug,
    contentBlocks: pageData.contentBlocks,
    schemaVersion: 1,
    status,
    savedByClerkId: userInfo?.clerkId ?? null,
    savedByName: userInfo?.name ?? null,
    note: `Saved via CMS editor — status: ${status}`,
    savedAt: new Date(),
  });

  // 3. Dispatch cache invalidation to public web app (non-throwing)
  await dispatchRevalidation({
    tags: [`page:${pageData.slug}`],
    paths: [pageData.slug === '/' ? '/' : pageData.slug],
  });

  return { success: true };
}

export async function publishPageAction(slug: string) {
  await requireRole(['super_admin', 'editor']);

  const record = await db.query.pages.findFirst({ where: eq(pages.slug, slug) });
  if (!record) throw new Error(`Page not found: ${slug}`);

  await db
    .update(pages)
    .set({ status: 'PUBLISHED', publishedAt: new Date(), updatedAt: new Date(), scheduledAt: null })
    .where(eq(pages.slug, slug));

  const userInfo = await getCurrentUserInfo();
  await db.insert(pageRevisions).values({
    pageSlug: slug,
    contentBlocks: record.contentBlocks as any[],
    schemaVersion: record.schemaVersion ?? 1,
    status: 'PUBLISHED',
    savedByClerkId: userInfo?.clerkId ?? null,
    savedByName: userInfo?.name ?? null,
    note: 'Published via CMS',
    savedAt: new Date(),
  });

  await dispatchRevalidation({
    tags: [`page:${slug}`],
    paths: [slug === '/' ? '/' : slug],
  });

  return { success: true };
}

export async function unpublishPageAction(slug: string) {
  await requireRole(['super_admin', 'editor']);

  await db
    .update(pages)
    .set({ status: 'DRAFT', updatedAt: new Date() })
    .where(eq(pages.slug, slug));

  await dispatchRevalidation({
    tags: [`page:${slug}`],
    paths: [slug === '/' ? '/' : slug],
  });

  return { success: true };
}

export async function createPageAction(newPage: {
  title: string;
  slug: string;
  seoDescription?: string;
}) {
  await requireRole(['super_admin', 'editor']);

  let cleanSlug = newPage.slug.trim().toLowerCase().replace(/[^a-z0-9-/]/g, '-');
  if (!cleanSlug.startsWith('/')) cleanSlug = `/${cleanSlug}`;

  const pageTitle = newPage.title.trim();

  const defaultBlocks = [
    {
      id: `block_hero_${Date.now()}`,
      name: 'Hero Banner Section',
      type: 'hero-banner',
      enabled: true,
      props: {
        title: pageTitle,
        subtitle: newPage.seoDescription || `Comprehensive advisory solutions for ${pageTitle}.`,
        bgImage: '/images/about-hero.webp',
        ctaLabel: 'Get in Touch',
        ctaUrl: '/connect',
      },
    },
    {
      id: `block_story_${Date.now() + 1}`,
      name: 'Overview & Narrative',
      type: 'story-narrative',
      enabled: true,
      props: {
        tagline: 'OVERVIEW',
        headline: `Strategic focus and solutions for ${pageTitle}.`,
        description: newPage.seoDescription || `Our advisory solutions combine deep technical rigor with commercial insight to deliver lasting value.`,
      },
    },
    {
      id: `block_cta_${Date.now() + 2}`,
      name: 'Call to Action Banner',
      type: 'cta-banner',
      enabled: true,
      props: {
        headline: `Partner with Envint on ${pageTitle}`,
        subtext: 'Speak with our advisory leaders to initiate a tailored consultation.',
        buttonLabel: 'Connect With Us',
        buttonUrl: '/connect',
      },
    },
  ];

  await savePageAction({
    slug: cleanSlug,
    title: pageTitle,
    seoTitle: pageTitle,
    seoDescription: newPage.seoDescription || '',
    contentBlocks: defaultBlocks,
    layoutTemplate: 'standard',
    status: 'DRAFT',
  });

  return { success: true, slug: cleanSlug };
}

export async function deletePageAction(slug: string) {
  await requireRole(['super_admin']);

  await db.delete(pages).where(eq(pages.slug, slug));

  await dispatchRevalidation({
    tags: [`page:${slug}`],
    paths: [slug === '/' ? '/' : slug],
  });

  return { success: true };
}

export async function fetchPageRevisions(slug: string) {
  await requireRole(['super_admin', 'editor']);

  const revisions = await db.query.pageRevisions.findMany({
    where: eq(pageRevisions.pageSlug, slug),
    orderBy: (r, { desc }) => [desc(r.savedAt)],
  });

  return revisions.map((r) => ({
    id: r.id,
    status: r.status,
    savedByName: r.savedByName,
    savedAt: r.savedAt ? new Date(r.savedAt).toLocaleString() : 'Unknown',
    note: r.note,
    blocksCount: Array.isArray(r.contentBlocks) ? (r.contentBlocks as any[]).length : 0,
  }));
}

export async function restorePageRevision(slug: string, revisionId: string) {
  await requireRole(['super_admin', 'editor']);

  const revision = await db.query.pageRevisions.findFirst({
    where: eq(pageRevisions.id, revisionId),
  });

  if (!revision || revision.pageSlug !== slug) {
    throw new Error('Revision not found or does not belong to this page.');
  }

  const userInfo = await getCurrentUserInfo();

  const isV2 = (revision.schemaVersion ?? 1) === 2;

  await db
    .update(pages)
    .set({
      ...(isV2
        ? {
            draftBlocks: revision.contentBlocks as any,
            publishedBlocks: revision.contentBlocks as any,
          }
        : {
            contentBlocks: revision.contentBlocks as any[],
          }),
      schemaVersion: revision.schemaVersion ?? 1,
      status: 'DRAFT',
      updatedAt: new Date(),
    })
    .where(eq(pages.slug, slug));

  await db.insert(pageRevisions).values({
    pageSlug: slug,
    contentBlocks: revision.contentBlocks as any[],
    schemaVersion: revision.schemaVersion ?? 1,
    status: 'DRAFT',
    savedByClerkId: userInfo?.clerkId ?? null,
    savedByName: userInfo?.name ?? null,
    note: `Restored from revision ${revisionId.slice(0, 8)}`,
    savedAt: new Date(),
  });

  await dispatchRevalidation({ tags: [`page:${slug}`] });

  return { success: true };
}

// ─── Visual Builder Tree Actions ──────────────────────────────────────────

export async function fetchPageTreeAction(slug: string) {
  await requireRole(['super_admin', 'editor']);

  const record = await db.query.pages.findFirst({
    where: eq(pages.slug, slug),
  });

  // Check if draftBlocks or publishedBlocks has Schema v2 tree
  let tree: PageBlockTree | null = null;
  if (record?.draftBlocks && (record.draftBlocks as any).rootIds && (record.draftBlocks as any).nodes) {
    tree = record.draftBlocks as PageBlockTree;
  } else if (record?.publishedBlocks && (record.publishedBlocks as any).rootIds && (record.publishedBlocks as any).nodes) {
    tree = record.publishedBlocks as PageBlockTree;
  } else if (slug === '/about') {
    // Authentic initial Schema v2 tree for About page
    tree = createAboutPageTree();
  } else if (record?.contentBlocks && Array.isArray(record.contentBlocks) && record.contentBlocks.length > 0) {
    // Convert existing legacy content blocks into Schema v2 element tree
    tree = convertLegacyPageBlocksToTree(record.contentBlocks, slug, record.title);
  } else {
    // Fresh starter tree
    tree = createStarterPageTree(record?.title || slug);
  }

  return {
    slug: record?.slug || slug,
    title: record?.title || (slug === '/about' ? 'About Envint' : slug),
    seoTitle: record?.seoTitle || record?.title || slug,
    seoDescription: record?.seoDescription || '',
    status: record?.status || 'PUBLISHED',
    schemaVersion: record?.schemaVersion || 2,
    tree,
    hasDraft: Boolean(record?.draftBlocks && (record.draftBlocks as any).rootIds),
  };
}

export async function saveDraftTreeAction(slug: string, tree: PageBlockTree) {
  await requireRole(['super_admin', 'editor']);

  await db
    .update(pages)
    .set({
      draftBlocks: tree,
      updatedAt: new Date(),
    })
    .where(eq(pages.slug, slug));

  return { success: true };
}

export async function publishTreeAction(pageData: {
  slug: string;
  title: string;
  seoTitle?: string;
  seoDescription?: string;
  tree: PageBlockTree;
}) {
  await requireRole(['super_admin', 'editor']);
  const userInfo = await getCurrentUserInfo();

  await db
    .update(pages)
    .set({
      title: pageData.title,
      seoTitle: pageData.seoTitle,
      seoDescription: pageData.seoDescription,
      publishedBlocks: pageData.tree,
      draftBlocks: pageData.tree,
      schemaVersion: 2,
      status: 'PUBLISHED',
      publishedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(pages.slug, pageData.slug));

  // Snapshot into pageRevisions
  await db.insert(pageRevisions).values({
    pageSlug: pageData.slug,
    contentBlocks: pageData.tree as any,
    schemaVersion: 2,
    isPublishedSnapshot: true,
    status: 'PUBLISHED',
    savedByClerkId: userInfo?.clerkId ?? null,
    savedByName: userInfo?.name ?? null,
    note: 'Published via Visual Page Builder',
    savedAt: new Date(),
  });

  // Revalidate public web cache
  await dispatchRevalidation({
    tags: [`page:${pageData.slug}`],
    paths: [pageData.slug === '/' ? '/' : pageData.slug],
  });

  return { success: true };
}

export async function fetchPageRevisionsAction(slug: string) {
  await requireRole(['super_admin', 'editor']);

  const revs = await db.query.pageRevisions.findMany({
    where: eq(pageRevisions.pageSlug, slug),
    orderBy: (r, { desc }) => [desc(r.savedAt)],
    limit: 20,
  });

  return revs.map((r) => ({
    id: r.id,
    versionNumber: r.versionNumber,
    isPublishedSnapshot: r.isPublishedSnapshot,
    status: r.status,
    savedByName: r.savedByName || 'Admin',
    note: r.note,
    savedAt: r.savedAt.toISOString(),
  }));
}
