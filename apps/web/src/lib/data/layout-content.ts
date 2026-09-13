export interface LayoutNavItem {
  label: string;
  href: string;
  children?: LayoutNavItem[];
  openInNewTab?: boolean;
}

export interface HeaderNavEntry {
  label: string;
  href: string;
  items: Array<{ label: string; href: string }>;
}

function withTrailingSlash(href: string): string {
  if (!href.startsWith('/') || href === '/') return href;
  return `${href.replace(/\/+$/g, '')}/`;
}

export function buildHeaderNavigation(items: LayoutNavItem[]): HeaderNavEntry[] {
  return items.map((item) => ({
    label: item.label,
    href: withTrailingSlash(item.href),
    items: (item.children ?? []).map((child) => ({
      label: child.label,
      href: withTrailingSlash(child.href),
    })),
  }));
}
