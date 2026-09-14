import { db, pages, eq, and } from '@envint/db';
import { unstable_cache } from 'next/cache';
import { draftMode } from 'next/headers';
import { getPreviewBlocks } from '@/lib/preview-store';
import { pageTag } from '@/lib/routes/cache-tags';

export interface CmsPage {
  slug: string;
  title: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  layoutTemplate?: string | null;
  status?: string;
  contentBlocks: any[];
  draftBlocks?: any | null;
  publishedBlocks?: any | null;
  schemaVersion?: number;
}

/**
 * Whether a page has renderable CMS content: either legacy content blocks
 * (Schema v1) or a published element tree (Schema v2, preferred).
 *
 * Used by page routes to decide between CMS rendering and the hard-coded
 * fallback. In normal (non-draft) mode, getPage() only returns records with
 * contentBlocks or a published tree, so a draft-only tree still falls back
 * gracefully until the page is published from the studio.
 */
export function pageHasRenderableContent(
  page: CmsPage | null,
  mode: 'published' | 'preview' = 'published',
): page is CmsPage {
  if (!page) return false;
  if (Array.isArray(page.contentBlocks) && page.contentBlocks.length > 0) return true;
  const tree = (mode === 'preview'
    ? (page.draftBlocks ?? page.publishedBlocks)
    : page.publishedBlocks) as any;
  return Boolean(tree && tree.rootIds && tree.nodes);
}

function mapPageRecord(record: typeof pages.$inferSelect, includeDraft: boolean): CmsPage {
  return {
    slug: record.slug,
    title: record.title,
    seoTitle: record.seoTitle,
    seoDescription: record.seoDescription,
    layoutTemplate: record.layoutTemplate,
    status: record.status,
    contentBlocks: (record.contentBlocks as any[]) ?? [],
    ...(includeDraft ? { draftBlocks: record.draftBlocks } : {}),
    publishedBlocks: record.publishedBlocks,
    schemaVersion: record.schemaVersion,
  };
}

export async function getPreviewPage(slug: string): Promise<CmsPage | null> {
  const preview = await getPreviewBlocks(slug);
  if (preview) {
    return {
      slug,
      title: preview.title || slug,
      seoTitle: preview.seoTitle || preview.title || slug,
      seoDescription: preview.seoDescription || '',
      layoutTemplate: 'standard',
      status: 'DRAFT',
      contentBlocks: Array.isArray(preview.blocks) ? preview.blocks : [],
      draftBlocks: preview.blocks && (preview.blocks as any).rootIds ? preview.blocks : null,
    };
  }

  try {
    const record = await db.query.pages.findFirst({ where: eq(pages.slug, slug) });
    return record ? mapPageRecord(record, true) : null;
  } catch {
    return null;
  }
}

export async function getPublishedPage(slug: string): Promise<CmsPage | null> {
  return unstable_cache(
    async (): Promise<CmsPage | null> => {
      try {
        const record = await db.query.pages.findFirst({
          where: and(eq(pages.slug, slug), eq(pages.status, 'PUBLISHED')),
        });
        if (!record) return null;
        const page = mapPageRecord(record, false);
        return pageHasRenderableContent(page, 'published') ? page : null;
      } catch {
        return null;
      }
    },
    // Bump this namespace whenever the canonical page-tree migration changes
    // the persisted shape. Next's data cache survives production builds, so a
    // stable key can otherwise keep serving a superseded CMS tree even though
    // PostgreSQL contains the newly published version.
    [`published-page-v2-${slug}`],
    { tags: [pageTag(slug)] },
  )();
}

/**
 * Fetch a page for the PUBLIC site.
 *
 * - In normal mode: returns only PUBLISHED pages, cached per slug tag.
 * - In Draft Mode (preview): skips cache, returns any status, checks preview
 *   store first (for live editor previews before save).
 */
export async function getPage(slug: string): Promise<CmsPage | null> {
  // Check if Next.js Draft Mode is enabled (set by /api/draft/enable)
  let isDraft = false;
  try {
    const dm = await draftMode();
    isDraft = dm.isEnabled;
  } catch {
    // draftMode() is not available in all contexts
    isDraft = false;
  }

  return isDraft ? getPreviewPage(slug) : getPublishedPage(slug);
}
