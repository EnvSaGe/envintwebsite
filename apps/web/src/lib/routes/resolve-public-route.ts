import type { PageBlockTree } from '@envint/shared';
import { getPreviewPage, getPublishedPage, type CmsPage } from '@/lib/data/pages';
import { normalizeRoutePath } from './normalize';
import { choosePreviewTree, choosePublishedTree } from './tree-selection';
import type { ResolvedPublicRoute } from './types';

export { choosePreviewTree, choosePublishedTree } from './tree-selection';

function resolvedPage(pathname: string, page: CmsPage, tree: PageBlockTree | null): ResolvedPublicRoute {
  return { kind: 'page', pathname, page, tree };
}

export async function resolvePublicRoute(pathnameInput: string): Promise<ResolvedPublicRoute | null> {
  const pathname = normalizeRoutePath(pathnameInput);
  const page = await getPublishedPage(pathname);
  if (!page) return null;
  const tree = choosePublishedTree(page);
  if (!tree && (!Array.isArray(page.contentBlocks) || page.contentBlocks.length === 0)) return null;
  return resolvedPage(pathname, page, tree);
}

export async function resolvePreviewRoute(pathnameInput: string): Promise<ResolvedPublicRoute | null> {
  const pathname = normalizeRoutePath(pathnameInput);
  const page = await getPreviewPage(pathname);
  if (!page) return null;
  const tree = choosePreviewTree(page);
  if (!tree && (!Array.isArray(page.contentBlocks) || page.contentBlocks.length === 0)) return null;
  return resolvedPage(pathname, page, tree);
}
