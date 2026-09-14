import type { PageBlockTree } from '@envint/shared';
import { getPreviewPage, getPublishedPage, type CmsPage } from '@/lib/data/pages';
import { normalizeRoutePath } from './normalize';
import { choosePreviewTree, choosePublishedTree } from './tree-selection';
import type { ResolvedPublicRoute } from './types';
import { getPublishedTemplate } from '@/lib/data/content-templates';
import { getInsight } from '@/lib/data/insights';
import { getImpact } from '@/lib/data/impacts';
import { getTeamMember } from '@/lib/data/team';
import { createArchiveRoute, parseContentRoute } from './content-route';
import type { ArchiveRouteRecord, ContentTemplateRecord, RecordType } from './types';

export { choosePreviewTree, choosePublishedTree } from './tree-selection';

function resolvedPage(pathname: string, page: CmsPage, tree: PageBlockTree | null): ResolvedPublicRoute {
  return { kind: 'page', pathname, page, tree };
}

export async function resolvePublicRoute(pathnameInput: string): Promise<ResolvedPublicRoute | null> {
  const pathname = normalizeRoutePath(pathnameInput);
  const page = await getPublishedPage(pathname);
  if (page) {
    const tree = choosePublishedTree(page);
    if (tree || (Array.isArray(page.contentBlocks) && page.contentBlocks.length > 0)) {
      return resolvedPage(pathname, page, tree);
    }
  }

  const parsed = parseContentRoute(pathname);
  if (!parsed) return null;
  const template = await getPublishedTemplate(parsed.templateSlug);
  if (!template) return null;
  if (parsed.kind === 'record') {
    const record = await loadRecord(parsed.recordType, parsed.slug);
    return record ? { kind: 'record', pathname, recordType: parsed.recordType, record, template } : null;
  }
  const archive = createArchiveRoute(parsed.archiveType, parsed.slug);
  return { kind: 'archive', pathname, archive, template: withArchiveQuery(template, archive) };
}

export async function resolvePreviewRoute(pathnameInput: string): Promise<ResolvedPublicRoute | null> {
  const pathname = normalizeRoutePath(pathnameInput);
  const page = await getPreviewPage(pathname);
  if (!page) return null;
  const tree = choosePreviewTree(page);
  if (!tree && (!Array.isArray(page.contentBlocks) || page.contentBlocks.length === 0)) return null;
  return resolvedPage(pathname, page, tree);
}

async function loadRecord(recordType: RecordType, slug: string): Promise<unknown | null> {
  if (recordType === 'insight') return getInsight(slug);
  if (recordType === 'impact') return getImpact(slug);
  const member = await getTeamMember(slug);
  if (!member) return null;
  return {
    ...member,
    avatarUrl: (member as any).avatarUrl || (member as any).avatar?.url || (member as any).image?.url || null,
  };
}

function withArchiveQuery(template: ContentTemplateRecord, archive: ArchiveRouteRecord): ContentTemplateRecord {
  const tree = structuredClone(template.publishedBlocks);
  const node = tree.nodes['archive-grid'];
  if (node) {
    node.type = archive.query.source === 'impacts' ? 'impact-grid' : archive.query.source === 'team' ? 'team-grid' : 'insights-grid';
    node.content = { ...node.content, query: archive.query, limit: archive.query.limit };
  }
  return { ...template, publishedBlocks: tree };
}
