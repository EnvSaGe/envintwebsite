import { normalizeRoutePath } from './normalize';

export function pageTag(pathname: string): string {
  return `page:${normalizeRoutePath(pathname)}`;
}

export function templateTag(slug: string): string {
  return `template:${slug.replace(/^\/+|\/+$/g, '')}`;
}

export function globalTag(key: string): string {
  return `global:${key.replace(/^\/+|\/+$/g, '')}`;
}

export function recordTag(type: string, slug: string): string {
  return `record:${type}:${slug.replace(/^\/+|\/+$/g, '')}`;
}
