import { db, navigationItems, eq, and } from '@envint/db';
import { unstable_cache } from 'next/cache';
import { globalTag } from '../routes/cache-tags';

export interface NavItem {
  id: string;
  label: string;
  href: string;
  parentId: string | null;
  orderIndex: number;
  isActive: boolean;
  navGroup: string;
  openInNewTab: boolean;
  children: NavItem[];
}

/**
 * Fetches all navigation items for a specific group (primary, footer, social).
 * Results are cached with the 'navigation' tag for cache invalidation.
 */
async function loadNavigationItems(navGroup: string): Promise<NavItem[]> {
    try {
      const records = await db.query.navigationItems.findMany({
        where: and(
          eq(navigationItems.navGroup, navGroup),
          eq(navigationItems.isActive, true),
        ),
        orderBy: (n, { asc }) => [asc(n.orderIndex)],
      });

      // Build tree (top-level items first, children attached)
      const topLevel = records.filter((r) => !r.parentId).map((r) => ({
        id: r.id,
        label: r.label,
        href: r.href,
        parentId: r.parentId,
        orderIndex: r.orderIndex,
        isActive: r.isActive,
        navGroup: r.navGroup,
        openInNewTab: r.openInNewTab,
        children: records
          .filter((c) => c.parentId === r.id)
          .map((c) => ({
            id: c.id,
            label: c.label,
            href: c.href,
            parentId: c.parentId,
            orderIndex: c.orderIndex,
            isActive: c.isActive,
            navGroup: c.navGroup,
            openInNewTab: c.openInNewTab,
            children: [],
          })),
      }));

      return topLevel;
    } catch (err) {
      console.error('[navigation] DB error, returning empty navigation:', err);
      return [];
    }
}

const getPrimaryNavigation = unstable_cache(
  () => loadNavigationItems('primary'),
  ['navigation-items', 'primary'],
  { tags: [globalTag('navigation'), globalTag('header')], revalidate: 3600 },
);

const getFooterNavigation = unstable_cache(
  () => loadNavigationItems('footer'),
  ['navigation-items', 'footer'],
  { tags: [globalTag('navigation'), globalTag('footer')], revalidate: 3600 },
);

const getSocialNavigation = unstable_cache(
  () => loadNavigationItems('social'),
  ['navigation-items', 'social'],
  { tags: [globalTag('navigation'), globalTag('footer')], revalidate: 3600 },
);

export function getNavigationItems(navGroup: string = 'primary'): Promise<NavItem[]> {
  if (navGroup === 'footer') return getFooterNavigation();
  if (navGroup === 'social') return getSocialNavigation();
  return getPrimaryNavigation();
}
