export function normalizeRoutePath(input: string): string {
  let pathname = input;
  if (/^https?:\/\//i.test(input)) pathname = new URL(input).pathname;
  pathname = pathname.split(/[?#]/, 1)[0];
  const clean = pathname.replace(/^\/+|\/+$/g, '');
  return clean.length === 0 ? '/' : `/${clean}`;
}

export function routePathToSlug(input: string): string {
  return normalizeRoutePath(input);
}

export function routePathWithTrailingSlash(input: string): string {
  const normalized = normalizeRoutePath(input);
  return normalized === '/' ? '/' : `${normalized}/`;
}
