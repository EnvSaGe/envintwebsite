import { and, contentDependencies, db, eq } from '@envint/db';
import { normalizeRoutePath } from '../routes/normalize';

export type RevalidationChange =
  | { type: 'page'; slug: string }
  | { type: 'global'; key: string }
  | { type: 'template'; slug: string }
  | { type: 'record'; recordType: 'insight' | 'impact' | 'team' | 'service'; slug: string };

export interface RevalidationTargets {
  paths: string[];
  tags: string[];
}

const MAX_TARGETS = 200;
const TAG_PATTERN = /^(?:(?:page:|template:|record:|global:|archive:|insight:|impact:|team:|service:|tax:)[a-z0-9_:/.-]+|insights:list|impacts:list|team:list|services:list)$/;
const SAFE_PATH_PATTERN = /^\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]*\/?$/;

function trailingSlash(pathname: string): string {
  const normalized = normalizeRoutePath(pathname);
  return normalized === '/' ? '/' : `${normalized}/`;
}

export function collectStaticRevalidationTargets(change: RevalidationChange): RevalidationTargets {
  if (change.type === 'page') {
    const normalized = normalizeRoutePath(change.slug);
    return { paths: [trailingSlash(normalized)], tags: [`page:${normalized}`] };
  }
  if (change.type === 'global') {
    return { paths: [], tags: [`global:${change.key.replace(/^\/+|\/+$/g, '')}`] };
  }
  if (change.type === 'template') {
    return { paths: [], tags: [`template:${change.slug.replace(/^\/+|\/+$/g, '')}`] };
  }

  const slug = change.slug.replace(/^\/+|\/+$/g, '');
  const prefix = change.recordType === 'impact'
    ? '/impact/'
    : change.recordType === 'team'
      ? '/member/'
      : change.recordType === 'service'
        ? '/service/'
        : '/';
  return {
    paths: [trailingSlash(`${prefix}${slug}`)],
    tags: [`record:${change.recordType}:${slug}`, `archive:${change.recordType}`],
  };
}

export async function collectRevalidationTargets(change: RevalidationChange): Promise<RevalidationTargets> {
  const targets = collectStaticRevalidationTargets(change);
  if (change.type === 'page' || change.type === 'global') return targets;
  const sourceType = change.type === 'template' ? 'template' : change.recordType;
  const sourceKey = change.slug.replace(/^\/+|\/+$/g, '');
  const dependencies = await db.query.contentDependencies.findMany({
    where: and(
      eq(contentDependencies.sourceType, sourceType),
      eq(contentDependencies.sourceKey, sourceKey),
    ),
  });
  return {
    paths: [...new Set([...targets.paths, ...dependencies.map((item) => trailingSlash(item.routePath))])],
    tags: targets.tags,
  };
}

export function normalizeRevalidationRequest(input: unknown): RevalidationTargets & {
  rejectedPaths: string[];
  rejectedTags: string[];
} {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Invalid revalidation payload.');
  const value = input as { paths?: unknown; tags?: unknown };
  if (value.paths !== undefined && !Array.isArray(value.paths)) throw new Error('paths must be an array.');
  if (value.tags !== undefined && !Array.isArray(value.tags)) throw new Error('tags must be an array.');
  const rawPaths = value.paths ?? [];
  const rawTags = value.tags ?? [];
  if (rawPaths.length > MAX_TARGETS || rawTags.length > MAX_TARGETS) {
    throw new Error('Revalidation accepts at most 200 paths and 200 tags.');
  }

  const paths: string[] = [];
  const tags: string[] = [];
  const rejectedPaths: string[] = [];
  const rejectedTags: string[] = [];
  for (const item of rawPaths) {
    if (typeof item !== 'string' || !SAFE_PATH_PATTERN.test(item)) rejectedPaths.push(String(item));
    else paths.push(trailingSlash(item));
  }
  for (const item of rawTags) {
    if (typeof item !== 'string' || item.length > 255 || !TAG_PATTERN.test(item)) rejectedTags.push(String(item));
    else tags.push(item);
  }
  return {
    paths: [...new Set(paths)],
    tags: [...new Set(tags)],
    rejectedPaths,
    rejectedTags,
  };
}
