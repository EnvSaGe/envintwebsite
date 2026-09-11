import archiveRoutes from '@/data/archive-routes.json';

export interface ArchiveRoute {
  type: string;
  slug: string;
}

export const ARCHIVE_TYPES = [
  'category',
  'tag',
  'service',
  'sub-service',
  'sector',
  'theme',
] as const;

export type ArchiveType = (typeof ARCHIVE_TYPES)[number];

export function getArchiveRoutes(type: string): ArchiveRoute[] {
  return (archiveRoutes as ArchiveRoute[]).filter((r) => r.type === type);
}

export function humanizeTerm(slug: string): string {
  const base = slug.split('/').pop() || slug;
  return base
    .split('-')
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(' ');
}

export function typeLabel(type: string): string {
  const labels: Record<string, string> = {
    category: 'Category',
    tag: 'Tag',
    service: 'Service',
    'sub-service': 'Sub Service',
    sector: 'Sector',
    theme: 'Theme',
  };
  return labels[type] || 'Archive';
}

export function archivePath(type: string, slug: string): string {
  return `/${type}/${slug}/`;
}
