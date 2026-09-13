import { db, pages, eq, and } from '@envint/db';
import { unstable_cache } from 'next/cache';
import { draftMode } from 'next/headers';
import { getPreviewBlocks } from '@/lib/preview-store';

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
export function pageHasRenderableContent(page: CmsPage | null): page is CmsPage {
  if (!page) return false;
  if (Array.isArray(page.contentBlocks) && page.contentBlocks.length > 0) return true;
  const tree = (page.publishedBlocks ?? page.draftBlocks) as any;
  return Boolean(tree && tree.rootIds && tree.nodes);
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

  if (isDraft) {
    // 1. Check preview store first (live unsaved editor state)
    const preview = await getPreviewBlocks(slug);
    if (preview) {
      return {
        slug,
        title: preview.title || slug,
        seoTitle: preview.seoTitle || preview.title || slug,
        seoDescription: preview.seoDescription || '',
        layoutTemplate: 'standard',
        status: 'DRAFT',
        contentBlocks: preview.blocks || [],
        draftBlocks: (preview.blocks && (preview.blocks as any).rootIds) ? preview.blocks : null,
      };
    }

    // 2. Load saved draft from DB (no status filter)
    try {
      const record = await db.query.pages.findFirst({
        where: eq(pages.slug, slug),
      });
      if (record) {
        return {
          slug: record.slug,
          title: record.title,
          seoTitle: record.seoTitle,
          seoDescription: record.seoDescription,
          layoutTemplate: record.layoutTemplate,
          status: record.status,
          contentBlocks: (record.contentBlocks as any[]) ?? [],
          draftBlocks: record.draftBlocks,
          publishedBlocks: record.publishedBlocks,
          schemaVersion: record.schemaVersion,
        };
      }
    } catch {
      // Fallback below
    }
  }

  // Normal (non-draft) mode — use cached published data
  return unstable_cache(
    async (): Promise<CmsPage | null> => {
      try {
        const record = await db.query.pages.findFirst({
          where: and(eq(pages.slug, slug), eq(pages.status, 'PUBLISHED')),
        });
        if (
          record &&
          ((record.contentBlocks && (record.contentBlocks as any[]).length > 0) ||
           (record.publishedBlocks && (record.publishedBlocks as any).rootIds))
        ) {
          return {
            slug: record.slug,
            title: record.title,
            seoTitle: record.seoTitle,
            seoDescription: record.seoDescription,
            layoutTemplate: record.layoutTemplate,
            status: record.status,
            contentBlocks: (record.contentBlocks as any[]) ?? [],
            publishedBlocks: record.publishedBlocks,
            draftBlocks: record.draftBlocks,
            schemaVersion: record.schemaVersion,
          };
        }
      } catch {
        // Fallback to null — caller renders hard-coded fallback
      }
      return null;
    },
    [`page-${slug}`],
    { tags: [`page:${slug}`] },
  )();
}
