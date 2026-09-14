import { normalizeRoutePath } from './normalize';
import type { ArchiveRouteRecord, RecordType } from './types';

export type ParsedContentRoute =
  | { kind: 'record'; recordType: RecordType; slug: string; templateSlug: 'article' | 'impact' | 'team-member' }
  | { kind: 'archive'; archiveType: 'author' | 'category' | 'tag' | 'service' | 'sub-service' | 'sector' | 'theme' | 'member'; slug: string; templateSlug: 'author' | 'taxonomy' };

const ARCHIVE_PREFIXES = new Set(['author', 'category', 'tag', 'service', 'sub-service', 'sector', 'theme']);

export function parseContentRoute(pathnameInput: string): ParsedContentRoute | null {
  const pathname = normalizeRoutePath(pathnameInput);
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return null;
  if (segments[0] === 'impact' && segments.length === 2) {
    return { kind: 'record', recordType: 'impact', slug: segments[1], templateSlug: 'impact' };
  }
  if (segments[0] === 'member' && segments.length === 2) {
    return { kind: 'record', recordType: 'team-member', slug: segments[1], templateSlug: 'team-member' };
  }
  if (segments[0] === 'member' && segments.length === 1) {
    return { kind: 'archive', archiveType: 'member', slug: 'member', templateSlug: 'taxonomy' };
  }
  if (ARCHIVE_PREFIXES.has(segments[0]) && segments.length >= 2) {
    const archiveType = segments[0] as Extract<ParsedContentRoute, { kind: 'archive' }>['archiveType'];
    return { kind: 'archive', archiveType, slug: segments.slice(1).join('/'), templateSlug: archiveType === 'author' ? 'author' : 'taxonomy' };
  }
  if (segments.length === 1) {
    return { kind: 'record', recordType: 'insight', slug: segments[0], templateSlug: 'article' };
  }
  return null;
}

function titleFromSlug(slug: string): string {
  return slug.split('/').pop()!.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function createArchiveRoute(type: ArchiveRouteRecord['type'], slug: string): ArchiveRouteRecord {
  const lastSlug = slug.split('/').pop()!;
  const source = ['service', 'sub-service', 'sector', 'theme'].includes(type) ? 'impacts' : type === 'member' ? 'team' : 'insights';
  const field = type === 'category' && lastSlug === 'all-categories' ? null
    : type === 'sub-service' ? 'categories'
    : type === 'category' ? 'categories'
      : type === 'tag' ? 'tags'
        : type === 'author' ? 'author.slug'
          : type === 'member' ? null
            : `${type}.slug`;
  return {
    type,
    slug,
    title: type === 'member' ? 'Our Team' : titleFromSlug(slug),
    description: '',
    query: {
      source,
      filters: field ? [{ field, operator: field === 'categories' || field === 'tags' ? 'contains' : 'eq', value: lastSlug }] : [],
      sort: source === 'team' ? 'orderIndex:asc' : 'publishedAt:desc',
      limit: 100,
      pagination: 'pages',
    },
  } as ArchiveRouteRecord;
}
