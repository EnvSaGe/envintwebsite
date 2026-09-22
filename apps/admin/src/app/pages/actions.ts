'use server';

import { db, pages, pageRevisions, teamMembers, insights, impactCaseStudies, eq, asc, desc, or } from '@envint/db';
import { requireRole, getCurrentUserInfo } from '@/lib/clerk-rbac';
import { dispatchRevalidation } from '@/lib/revalidate-dispatcher';
import {
  safeValidateBlocks,
  PageBlockTree,
  createAboutPageTree,
  createStarterPageTree,
  convertLegacyPageBlocksToTree,
  convertArticleToPageTree,
  convertCaseStudyToPageTree,
  getCanonicalPageTree,
  ALL_CANONICAL_PAGE_SLUGS,
  buildStudioDynamicModules,
  type StudioDynamicRecord,
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

    const draftTree = (p.draftBlocks && (p.draftBlocks as any).rootIds) ? (p.draftBlocks as any) : null;
    const canonicalTree = getCanonicalPageTree(p.slug);
    const sectionsCount = draftTree ? draftTree.rootIds.length : (canonicalTree ? canonicalTree.rootIds.length : rawBlocks.length);

    return {
      slug: p.slug,
      title: p.title || fallback?.title || p.slug,
      category: getPageCategory(p.slug),
      layoutTemplate: p.layoutTemplate || fallback?.layoutTemplate || 'standard',
      sectionsCount,
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
    canonicalUrl: record?.canonicalUrl || '',
    ogImageUrl: record?.ogImageUrl || '',
    noIndex: record?.noIndex ?? false,
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
  canonicalUrl?: string;
  ogImageUrl?: string;
  noIndex?: boolean;
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
      canonicalUrl: pageData.canonicalUrl || null,
      ogImageUrl: pageData.ogImageUrl || null,
      noIndex: pageData.noIndex ?? false,
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
        canonicalUrl: pageData.canonicalUrl || null,
        ogImageUrl: pageData.ogImageUrl || null,
        noIndex: pageData.noIndex ?? false,
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

  // Draft saves never touch the public cache. A publish invalidates only this page.
  const revalidation = status === 'PUBLISHED'
    ? await dispatchRevalidation({
        tags: [`page:${pageData.slug}`],
        paths: [pageData.slug === '/' ? '/' : pageData.slug],
      })
    : null;

  return { success: true, revalidation };
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

  const revalidation = await dispatchRevalidation({
    tags: [`page:${slug}`],
    paths: [slug === '/' ? '/' : slug],
  });

  return { success: true, revalidation };
}

export async function unpublishPageAction(slug: string) {
  await requireRole(['super_admin', 'editor']);

  await db
    .update(pages)
    .set({ status: 'DRAFT', scheduledAt: null, updatedAt: new Date() })
    .where(eq(pages.slug, slug));

  const revalidation = await dispatchRevalidation({
    tags: [`page:${slug}`],
    paths: [slug === '/' ? '/' : slug],
  });

  return { success: true, revalidation };
}

export async function createPageAction(newPage: {
  title: string;
  slug: string;
  seoDescription?: string;
}): Promise<{ success: boolean; slug?: string; error?: string }> {
  try {
    await requireRole(['super_admin', 'editor']);

    const pageTitle = newPage.title?.trim() || '';
    if (!pageTitle) {
      return { success: false, error: 'Page title is required.' };
    }

    let cleanSlug = newPage.slug?.trim().toLowerCase().replace(/[^a-z0-9-/]/g, '-') || '';
    if (!cleanSlug.startsWith('/')) cleanSlug = `/${cleanSlug}`;
    if (!cleanSlug || cleanSlug === '/') {
      return { success: false, error: 'A valid page URL slug is required.' };
    }

    const starterTree = createStarterPageTree(pageTitle);
    const userInfo = await getCurrentUserInfo();

    await db.insert(pages).values({
      slug: cleanSlug,
      title: pageTitle,
      seoTitle: pageTitle,
      seoDescription: newPage.seoDescription || '',
      layoutTemplate: 'standard',
      contentBlocks: [],
      draftBlocks: starterTree,
      publishedBlocks: starterTree,
      schemaVersion: 2,
      status: 'DRAFT',
      updatedAt: new Date(),
    }).onConflictDoUpdate({
      target: pages.slug,
      set: {
        title: pageTitle,
        seoTitle: pageTitle,
        seoDescription: newPage.seoDescription || '',
        draftBlocks: starterTree,
        updatedAt: new Date(),
      },
    });

    await db.insert(pageRevisions).values({
      pageSlug: cleanSlug,
      contentBlocks: starterTree as any,
      schemaVersion: 2,
      status: 'DRAFT',
      savedByClerkId: userInfo?.clerkId ?? null,
      savedByName: userInfo?.name ?? null,
      note: 'Initial page creation',
      savedAt: new Date(),
    });

    return { success: true, slug: cleanSlug };
  } catch (err: any) {
    console.error('createPageAction error:', err);
    return { success: false, error: err.message || 'Failed to create page' };
  }
}

export async function duplicatePageAction(input: {
  sourceSlug: string;
  newSlug: string;
  newTitle: string;
}): Promise<{ success: boolean; slug?: string; error?: string }> {
  try {
    await requireRole(['super_admin', 'editor']);

    const newTitle = input.newTitle?.trim() || '';
    if (!newTitle) return { success: false, error: 'New page title is required.' };

    let cleanNewSlug = input.newSlug?.trim().toLowerCase().replace(/[^a-z0-9-/]/g, '-') || '';
    if (!cleanNewSlug.startsWith('/')) cleanNewSlug = `/${cleanNewSlug}`;
    if (!cleanNewSlug || cleanNewSlug === '/') {
      return { success: false, error: 'A valid, unique URL slug is required.' };
    }

    // Check if destination slug already exists in pages table
    const existing = await db.query.pages.findFirst({
      where: eq(pages.slug, cleanNewSlug),
    });
    if (existing) {
      return { success: false, error: `A page with URL path "${cleanNewSlug}" already exists. Please choose a different slug.` };
    }

    // Fetch the source page tree
    const sourceResult = await fetchPageTreeAction(input.sourceSlug);
    let treeToClone: PageBlockTree;

    if (sourceResult.tree && sourceResult.tree.rootIds && sourceResult.tree.nodes) {
      treeToClone = JSON.parse(JSON.stringify(sourceResult.tree));
    } else {
      treeToClone = createStarterPageTree(newTitle);
    }

    const userInfo = await getCurrentUserInfo();

    // Insert cloned page as DRAFT
    await db.insert(pages).values({
      slug: cleanNewSlug,
      title: newTitle,
      seoTitle: newTitle,
      seoDescription: sourceResult.seoDescription || `Copy of ${sourceResult.title}`,
      layoutTemplate: 'standard',
      contentBlocks: [],
      draftBlocks: treeToClone,
      publishedBlocks: treeToClone,
      schemaVersion: 2,
      status: 'DRAFT',
      updatedAt: new Date(),
    });

    // Record audit revision
    await db.insert(pageRevisions).values({
      pageSlug: cleanNewSlug,
      contentBlocks: treeToClone as any,
      schemaVersion: 2,
      status: 'DRAFT',
      savedByClerkId: userInfo?.clerkId ?? null,
      savedByName: userInfo?.name ?? null,
      note: `Duplicated from ${input.sourceSlug}`,
      savedAt: new Date(),
    });

    return { success: true, slug: cleanNewSlug };
  } catch (err: any) {
    console.error('duplicatePageAction error:', err);
    return { success: false, error: err.message || 'Failed to duplicate page.' };
  }
}

export async function deletePageAction(slug: string): Promise<{ success: boolean; error?: string; revalidation?: any }> {
  try {
    await requireRole(['super_admin', 'editor']);

    const protectedSlugs = [
      '/',
      '/about',
      '/services',
      '/careers-at-envint',
      '/connect',
      '/impact',
      '/disclaimer',
      '/sustainability-integration',
      '/climate-action',
      '/responsible-investment',
      '/envision',
      '/behind-the-buzz',
      '/how-to-articles',
      '/enviki',
      '/glossary-zone',
      '/esq',
      '/mapsense',
      '/connect-gbc2024',
    ];

    if (protectedSlugs.includes(slug)) {
      return { success: false, error: 'Core website pages cannot be deleted.' };
    }

    await db.delete(pageRevisions).where(eq(pageRevisions.pageSlug, slug));
    await db.delete(pages).where(eq(pages.slug, slug));

    const revalidation = await dispatchRevalidation({
      tags: [`page:${slug}`],
      paths: [slug === '/' ? '/' : slug],
    });

    return { success: true, revalidation };
  } catch (err: any) {
    console.error('deletePageAction error:', err);
    return { success: false, error: err.message || 'Failed to delete page.' };
  }
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

  const revalidation = await dispatchRevalidation({ tags: [`page:${slug}`] });

  return { success: true, revalidation };
}

// ─── Visual Builder Tree Actions ──────────────────────────────────────────

export async function fetchPageTreeAction(slug: string) {
  await requireRole(['super_admin', 'editor']);

  const cleanSlug = slug.startsWith('/') ? slug.slice(1) : slug;
  const pathSlug = slug.startsWith('/') ? slug : `/${slug}`;

  const record = await db.query.pages.findFirst({
    where: or(eq(pages.slug, pathSlug), eq(pages.slug, cleanSlug)),
  });
  const canonicalTree = getCanonicalPageTree(pathSlug) || getCanonicalPageTree(cleanSlug);

  // Check if draftBlocks or publishedBlocks has Schema v2 tree
  let tree: PageBlockTree | null = null;
  let pageTitle = record?.title || '';
  let pageSeoTitle = record?.seoTitle || '';
  let pageSeoDescription = record?.seoDescription || '';

  if (record?.draftBlocks && (record.draftBlocks as any).rootIds && (record.draftBlocks as any).nodes) {
    tree = record.draftBlocks as PageBlockTree;
  } else if (record?.publishedBlocks && (record.publishedBlocks as any).rootIds && (record.publishedBlocks as any).nodes) {
    tree = record.publishedBlocks as PageBlockTree;
  } else if (canonicalTree) {
    // Authentic initial Schema v2 tree for this page
    tree = canonicalTree;
  } else if (record?.contentBlocks && Array.isArray(record.contentBlocks) && record.contentBlocks.length > 0) {
    // Convert existing legacy content blocks into Schema v2 element tree
    tree = convertLegacyPageBlocksToTree(record.contentBlocks, pathSlug, record.title);
  } else {
    // Check if it's an Insight (Article)
    const insight = await db.query.insights.findFirst({
      where: or(eq(insights.slug, cleanSlug), eq(insights.slug, pathSlug)),
      with: {
        author: true,
        coverImage: true,
        categories: {
          with: { category: true },
        },
        tags: {
          with: { tag: true },
        },
      },
    });

    if (insight) {
      pageTitle = insight.title;
      pageSeoTitle = insight.seoTitle || insight.title;
      pageSeoDescription = insight.seoDescription || insight.excerpt || '';

      const categoryNames = insight.categories?.map((c) => c.category?.name).filter(Boolean) as string[];
      const tagNames = insight.tags?.map((t) => t.tag?.name).filter(Boolean) as string[];
      const coverUrl = insight.coverImageUrl || (insight.coverImage as any)?.url || null;

      tree = convertArticleToPageTree({
        slug: cleanSlug,
        title: insight.title,
        excerpt: insight.excerpt,
        coverImageUrl: coverUrl,
        contentHtml: insight.contentHtml,
        categories: categoryNames && categoryNames.length > 0 ? categoryNames : ['Insights'],
        tags: tagNames,
        readingTimeMinutes: insight.readingTimeMinutes || 5,
        publishedAt: insight.publishedAt || insight.createdAt,
      });
    } else {
      // Check if it's an Impact Case Study
      // Note: case study slugs can be passed as 'foo' or '/impact/foo' or 'impact/foo'
      const caseStudySlug = cleanSlug.startsWith('impact/') ? cleanSlug.replace('impact/', '') : cleanSlug;
      const caseStudy = await db.query.impactCaseStudies.findFirst({
        where: or(
          eq(impactCaseStudies.slug, caseStudySlug),
          eq(impactCaseStudies.slug, cleanSlug),
          eq(impactCaseStudies.slug, pathSlug)
        ),
        with: {
          service: true,
          sector: true,
          theme: true,
          coverImage: true,
        },
      });

      if (caseStudy) {
        pageTitle = caseStudy.title;
        pageSeoTitle = caseStudy.seoTitle || caseStudy.title;
        pageSeoDescription = caseStudy.seoDescription || caseStudy.summary || '';

        const coverUrl = caseStudy.coverImageUrl || (caseStudy.coverImage as any)?.url || null;

        tree = convertCaseStudyToPageTree({
          slug: caseStudySlug,
          title: caseStudy.title,
          summary: caseStudy.summary,
          challenge: caseStudy.challenge,
          solution: caseStudy.solution,
          outcome: caseStudy.outcome,
          contentHtml: caseStudy.contentHtml,
          coverImageUrl: coverUrl,
          sectorName: caseStudy.sector?.name,
          themeName: caseStudy.theme?.name,
          serviceName: caseStudy.service?.title,
          publishedAt: caseStudy.publishedAt || caseStudy.createdAt,
        });
      } else {
        // Fresh starter tree
        tree = createStarterPageTree(record?.title || cleanSlug.replace(/-/g, ' '));
      }
    }
  }

  // If this is an individual impact case study, strip any legacy badge or CTA sections to match public case study layout
  if (pathSlug.startsWith('/impact/') && pathSlug !== '/impact' && tree) {
    const rootIds = tree.rootIds.filter((id) => !id.includes('cta'));
    const nodes: Record<string, any> = {};
    for (const [id, node] of Object.entries(tree.nodes)) {
      if (id.includes('badge_') || id.includes('cta')) continue;
      const cleanNode = { ...node };
      if (Array.isArray(cleanNode.children)) {
        cleanNode.children = cleanNode.children.filter(
          (childId) => !childId.includes('badge_') && !childId.includes('cta')
        );
      }
      nodes[id] = cleanNode;
    }
    tree = { ...tree, rootIds, nodes };
  }

  // Real team members so dynamic team-grid modules render with live data in the studio canvas
  let studioTeamMembers: Array<{ name: string; role?: string | null; imageUrl?: string | null }> = [];
  try {
    const members = await db.query.teamMembers.findMany({
      where: eq(teamMembers.status, 'PUBLISHED'),
      orderBy: [asc(teamMembers.orderIndex)],
      limit: 50,
    });
    studioTeamMembers = (members || []).map((m) => ({
      name: m.name,
      role: m.roleTitle,
      imageUrl: m.avatarUrl || null,
    }));
  } catch {
    studioTeamMembers = [];
  }

  const nodeTypes = new Set(Object.values(tree?.nodes || {}).map((node) => node.type));
  let studioInsights: StudioDynamicRecord[] = [];
  let studioImpacts: StudioDynamicRecord[] = [];

  if (nodeTypes.has('insights-grid')) {
    try {
      const records = await db.query.insights.findMany({
        where: eq(insights.status, 'PUBLISHED'),
        orderBy: [desc(insights.publishedAt)],
        with: {
          coverImage: true,
          categories: { with: { category: true } },
        },
      });
      studioInsights = records.map((record) => ({
        slug: record.slug,
        title: record.title,
        excerpt: record.excerpt,
        seoDescription: record.seoDescription,
        coverImageUrl: record.coverImageUrl || record.coverImage?.url || null,
        heroImage: record.coverImageUrl || record.coverImage?.url || null,
        publishedAt: record.publishedAt?.toISOString() || null,
        categories: record.categories
          .map((link) => link.category?.name)
          .filter((name): name is string => Boolean(name)),
      }));
    } catch {
      studioInsights = [];
    }
  }

  if (nodeTypes.has('impact-grid')) {
    try {
      const records = await db.query.impactCaseStudies.findMany({
        where: eq(impactCaseStudies.status, 'PUBLISHED'),
        orderBy: [asc(impactCaseStudies.orderIndex)],
        with: { service: true, sector: true, theme: true, coverImage: true },
      });
      studioImpacts = records.map((record) => {
        const service = record.service
          ? { name: record.service.title, slug: record.service.slug }
          : null;
        const sector = record.sector
          ? { name: record.sector.name, slug: record.sector.slug }
          : null;
        const theme = record.theme
          ? { name: record.theme.name, slug: record.theme.slug }
          : null;
        return {
          slug: record.slug,
          title: record.title,
          summary: record.summary,
          cardExcerpt: record.summary,
          coverImageUrl: record.coverImageUrl || record.coverImage?.url || null,
          heroImage: record.coverImageUrl || record.coverImage?.url || null,
          categories: [service?.name, sector?.name, theme?.name].filter(
            (name): name is string => Boolean(name),
          ),
          service,
          sector,
          theme,
        };
      });
    } catch {
      studioImpacts = [];
    }
  }

  const dynamicModules = tree
    ? buildStudioDynamicModules(tree, { insights: studioInsights, impacts: studioImpacts })
    : {};

  return {
    slug: pathSlug,
    title: pageTitle || record?.title || (pathSlug === '/about' ? 'About Envint' : pathSlug),
    seoTitle: pageSeoTitle || record?.seoTitle || pageTitle || pathSlug,
    seoDescription: pageSeoDescription || record?.seoDescription || '',
    canonicalUrl: record?.canonicalUrl || '',
    ogImageUrl: record?.ogImageUrl || '',
    noIndex: record?.noIndex ?? false,
    status: record?.status || 'PUBLISHED',
    scheduledAt: record?.scheduledAt ? new Date(record.scheduledAt).toISOString() : null,
    schemaVersion: record?.schemaVersion || 2,
    tree,
    hasDraft: Boolean(record?.draftBlocks && (record.draftBlocks as any).rootIds),
    teamMembers: studioTeamMembers,
    dynamicModules,
  };
}

export async function saveDraftTreeAction(
  slug: string,
  tree: PageBlockTree,
  meta?: { title?: string; seoTitle?: string; seoDescription?: string; canonicalUrl?: string; ogImageUrl?: string; noIndex?: boolean }
) {
  await requireRole(['super_admin', 'editor']);

  const pathSlug = slug.startsWith('/') ? slug : `/${slug}`;
  const cleanSlug = slug.startsWith('/') ? slug.slice(1) : slug;

  await db
    .insert(pages)
    .values({
      slug: pathSlug,
      title: meta?.title || cleanSlug.replace(/-/g, ' '),
      seoTitle: meta?.seoTitle,
      seoDescription: meta?.seoDescription,
      canonicalUrl: meta?.canonicalUrl || null,
      ogImageUrl: meta?.ogImageUrl || null,
      noIndex: meta?.noIndex ?? false,
      // Explicit defaults: the live DB column has NOT NULL without a DB-level default
      layoutTemplate: 'standard',
      contentBlocks: [],
      draftBlocks: tree,
      schemaVersion: 2,
      status: 'DRAFT',
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: pages.slug,
      set: {
        draftBlocks: tree,
        updatedAt: new Date(),
        ...(meta?.title ? { title: meta.title } : {}),
        ...(meta?.seoTitle ? { seoTitle: meta.seoTitle } : {}),
        ...(meta?.seoDescription ? { seoDescription: meta.seoDescription } : {}),
        ...(meta?.canonicalUrl !== undefined ? { canonicalUrl: meta.canonicalUrl || null } : {}),
        ...(meta?.ogImageUrl !== undefined ? { ogImageUrl: meta.ogImageUrl || null } : {}),
        ...(meta?.noIndex !== undefined ? { noIndex: meta.noIndex } : {}),
      },
    });

  return { success: true };
}

export async function publishTreeAction(pageData: {
  slug: string;
  title: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  ogImageUrl?: string;
  noIndex?: boolean;
  tree: PageBlockTree;
}) {
  await requireRole(['super_admin', 'editor']);
  const userInfo = await getCurrentUserInfo();

  const pathSlug = pageData.slug.startsWith('/') ? pageData.slug : `/${pageData.slug}`;
  const cleanSlug = pageData.slug.startsWith('/') ? pageData.slug.slice(1) : pageData.slug;
  const caseStudySlug = cleanSlug.startsWith('impact/') ? cleanSlug.replace('impact/', '') : cleanSlug;

  // 1. Upsert into pages table
  await db
    .insert(pages)
    .values({
      slug: pathSlug,
      title: pageData.title,
      seoTitle: pageData.seoTitle,
      seoDescription: pageData.seoDescription,
      canonicalUrl: pageData.canonicalUrl || null,
      ogImageUrl: pageData.ogImageUrl || null,
      noIndex: pageData.noIndex ?? false,
      // Explicit defaults: the live DB column has NOT NULL without a DB-level default
      layoutTemplate: 'standard',
      contentBlocks: [],
      publishedBlocks: pageData.tree,
      draftBlocks: pageData.tree,
      schemaVersion: 2,
      status: 'PUBLISHED',
      publishedAt: new Date(),
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: pages.slug,
      set: {
        title: pageData.title,
        seoTitle: pageData.seoTitle,
        seoDescription: pageData.seoDescription,
        canonicalUrl: pageData.canonicalUrl || null,
        ogImageUrl: pageData.ogImageUrl || null,
        noIndex: pageData.noIndex ?? false,
        publishedBlocks: pageData.tree,
        draftBlocks: pageData.tree,
        schemaVersion: 2,
        status: 'PUBLISHED',
        publishedAt: new Date(),
        updatedAt: new Date(),
        scheduledAt: null, // a direct publish supersedes any pending schedule
      },
    });

  // 2. Also keep insights / impactCaseStudies metadata in sync if this slug matches
  try {
    await db
      .update(insights)
      .set({
        title: pageData.title,
        seoTitle: pageData.seoTitle,
        seoDescription: pageData.seoDescription,
        updatedAt: new Date(),
        status: 'PUBLISHED',
        publishedAt: new Date(),
      })
      .where(or(eq(insights.slug, cleanSlug), eq(insights.slug, pathSlug)));
  } catch (e) {
    console.error('Failed to sync insight metadata on publish:', e);
  }

  try {
    await db
      .update(impactCaseStudies)
      .set({
        title: pageData.title,
        seoTitle: pageData.seoTitle,
        seoDescription: pageData.seoDescription,
        updatedAt: new Date(),
        status: 'PUBLISHED',
        publishedAt: new Date(),
      })
      .where(
        or(
          eq(impactCaseStudies.slug, caseStudySlug),
          eq(impactCaseStudies.slug, cleanSlug),
          eq(impactCaseStudies.slug, pathSlug)
        )
      );
  } catch (e) {
    console.error('Failed to sync impactCaseStudy metadata on publish:', e);
  }

  // 3. Snapshot into pageRevisions
  await db.insert(pageRevisions).values({
    pageSlug: pathSlug,
    contentBlocks: pageData.tree as any,
    schemaVersion: 2,
    isPublishedSnapshot: true,
    status: 'PUBLISHED',
    savedByClerkId: userInfo?.clerkId ?? null,
    savedByName: userInfo?.name ?? null,
    note: 'Published via Visual Page Builder',
    savedAt: new Date(),
  });

  // 4. Revalidate public web cache
  const revalidation = await dispatchRevalidation({
    tags: [`page:${pathSlug}`],
    paths: [pathSlug === '/' ? '/' : pathSlug],
  });

  return { success: true, revalidation };
}

/* ─── Scheduled publishing ─────────────────────────────────────────────────

   Design: scheduling never touches `status`, so a live page stays live
   (rendering the current publishedBlocks) while the new draft waits.
   The cron endpoint /api/cron/publish-scheduled (web app) promotes
   draftBlocks → publishedBlocks when scheduledAt is due.

   ─────────────────────────────────────────────────────────────────────── */

export async function scheduleTreePublishAction(pageData: {
  slug: string;
  title: string;
  seoTitle?: string;
  seoDescription?: string;
  tree: PageBlockTree;
  scheduledAt: string; // ISO timestamp — must be in the future
}) {
  await requireRole(['super_admin', 'editor']);

  const when = new Date(pageData.scheduledAt);
  if (Number.isNaN(when.getTime())) throw new Error('Invalid schedule date.');
  if (when.getTime() <= Date.now()) throw new Error('Schedule time must be in the future.');

  const userInfo = await getCurrentUserInfo();
  const pathSlug = pageData.slug.startsWith('/') ? pageData.slug : `/${pageData.slug}`;
  const cleanSlug = pageData.slug.startsWith('/') ? pageData.slug.slice(1) : pageData.slug;

  await db
    .insert(pages)
    .values({
      slug: pathSlug,
      title: pageData.title,
      seoTitle: pageData.seoTitle,
      seoDescription: pageData.seoDescription,
      // Explicit defaults: the live DB column has NOT NULL without a DB-level default
      layoutTemplate: 'standard',
      contentBlocks: [],
      draftBlocks: pageData.tree,
      schemaVersion: 2,
      status: 'DRAFT',
      scheduledAt: when,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: pages.slug,
      set: {
        title: pageData.title,
        seoTitle: pageData.seoTitle,
        seoDescription: pageData.seoDescription,
        draftBlocks: pageData.tree,
        schemaVersion: 2,
        scheduledAt: when,
        updatedAt: new Date(),
        // Note: `status` intentionally NOT set — keep live pages live.
      },
    });

  await db.insert(pageRevisions).values({
    pageSlug: pathSlug,
    contentBlocks: pageData.tree as any,
    schemaVersion: 2,
    status: 'DRAFT',
    savedByClerkId: userInfo?.clerkId ?? null,
    savedByName: userInfo?.name ?? null,
    note: `Scheduled publish for ${when.toISOString()}`,
    savedAt: new Date(),
  });

  return { success: true, scheduledAt: when.toISOString() };
}

export async function cancelScheduledPublishAction(slug: string) {
  await requireRole(['super_admin', 'editor']);

  const pathSlug = slug.startsWith('/') ? slug : `/${slug}`;

  await db
    .update(pages)
    .set({ scheduledAt: null, updatedAt: new Date() })
    .where(eq(pages.slug, pathSlug));

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
