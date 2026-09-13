export type PublicRouteKind =
  | 'unique-page'
  | 'article'
  | 'impact'
  | 'team-member'
  | 'taxonomy'
  | 'author';

export interface PublicRouteEntry {
  path: string;
  source: string;
  kind: PublicRouteKind;
  lastModified?: string;
}

export interface PublicRouteInventory {
  capturedAt: string;
  sourceSitemaps: string[];
  routes: PublicRouteEntry[];
}

const LIVE_ORIGIN = 'https://envintglobal.com';
const SITEMAP_INDEX = `${LIVE_ORIGIN}/wp-sitemap.xml`;
const CONTENT_SITEMAP_NAMES = new Set([
  'post-sitemap.xml',
  'page-sitemap.xml',
  'impact-sitemap.xml',
  'ex_team-sitemap.xml',
  'category-sitemap.xml',
  'post_tag-sitemap.xml',
  'service-sitemap.xml',
  'sub_service-sitemap.xml',
  'sector-sitemap.xml',
  'theme-sitemap.xml',
  'author-sitemap.xml',
]);
const TAXONOMY_PREFIXES = [
  '/category/',
  '/tag/',
  '/service/',
  '/sub-service/',
  '/sector/',
  '/theme/',
];
const UNIQUE_PAGE_PATHS = new Set([
  '/',
  '/about/',
  '/behind-the-buzz/',
  '/careers-at-envint/',
  '/climate-action/',
  '/connect/',
  '/connect-gbc2024/',
  '/disclaimer/',
  '/enviki/',
  '/envision/',
  '/esq/',
  '/glossary-zone/',
  '/how-to-articles/',
  '/impact/',
  '/mapsense/',
  '/responsible-investment/',
  '/services/',
  '/sustainability-integration/',
]);

export function normalizePublicPath(input: string): string {
  const pathname = /^https?:\/\//i.test(input) ? new URL(input).pathname : input;
  const clean = pathname.split(/[?#]/, 1)[0].replace(/^\/+|\/+$/g, '');
  return clean.length === 0 ? '/' : `/${clean}/`;
}

export function classifyPublicPath(input: string): PublicRouteKind {
  const path = normalizePublicPath(input);
  if (path.startsWith('/member/')) return 'team-member';
  if (path.startsWith('/impact/') && path !== '/impact/') return 'impact';
  if (TAXONOMY_PREFIXES.some((prefix) => path.startsWith(prefix))) return 'taxonomy';
  if (path.startsWith('/author/')) return 'author';
  if (UNIQUE_PAGE_PATHS.has(path)) return 'unique-page';
  return 'article';
}

export function isContentSitemap(input: string): boolean {
  try {
    const url = new URL(input);
    return url.origin === LIVE_ORIGIN && CONTENT_SITEMAP_NAMES.has(url.pathname.split('/').pop() ?? '');
  } catch {
    return false;
  }
}

function decodeXml(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function extractTagValues(xml: string, tagName: string): string[] {
  const values: string[] = [];
  const expression = new RegExp(`<${tagName}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tagName}>`, 'gi');
  for (const match of xml.matchAll(expression)) {
    values.push(decodeXml(match[1].trim()));
  }
  return values;
}

function extractUrlEntries(xml: string): Array<{ loc: string; lastModified?: string }> {
  const entries: Array<{ loc: string; lastModified?: string }> = [];
  const expression = /<url>([\s\S]*?)<\/url>/gi;
  for (const match of xml.matchAll(expression)) {
    const loc = extractTagValues(match[1], 'loc')[0];
    const lastModified = extractTagValues(match[1], 'lastmod')[0];
    if (loc) entries.push({ loc, lastModified });
  }
  return entries;
}

async function fetchXml(url: string, fetchImpl: typeof fetch): Promise<string> {
  const parsed = new URL(url);
  if (parsed.origin !== LIVE_ORIGIN) {
    throw new Error(`Refusing to fetch a sitemap outside ${LIVE_ORIGIN}: ${url}`);
  }
  const response = await fetchImpl(parsed, {
    headers: { 'user-agent': 'Envint CMS migration inventory/1.0' },
  });
  if (!response.ok) {
    throw new Error(`Unable to fetch ${url}: HTTP ${response.status}`);
  }
  return response.text();
}

export async function loadPublicRouteInventory(
  options: { fetchImpl?: typeof fetch; capturedAt?: string } = {},
): Promise<PublicRouteInventory> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const indexXml = await fetchXml(SITEMAP_INDEX, fetchImpl);
  const childSitemaps = extractTagValues(indexXml, 'loc').filter(isContentSitemap);
  const routeMap = new Map<string, PublicRouteEntry>();

  for (const sitemapUrl of childSitemaps) {
    const xml = await fetchXml(sitemapUrl, fetchImpl);
    for (const entry of extractUrlEntries(xml)) {
      let url: URL;
      try {
        url = new URL(entry.loc);
      } catch {
        continue;
      }
      if (url.origin !== LIVE_ORIGIN) continue;
      const path = normalizePublicPath(url.pathname);
      routeMap.set(path, {
        path,
        source: sitemapUrl,
        kind: classifyPublicPath(path),
        ...(entry.lastModified ? { lastModified: entry.lastModified } : {}),
      });
    }
  }

  return {
    capturedAt: options.capturedAt ?? new Date().toISOString(),
    sourceSitemaps: childSitemaps,
    routes: [...routeMap.values()].sort((left, right) => left.path.localeCompare(right.path)),
  };
}
