import { db, navigationItems, eq, and } from '@envint/db';
import { unstable_cache } from 'next/cache';

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
export const getNavigationItems = unstable_cache(
  async (navGroup: string = 'primary'): Promise<NavItem[]> => {
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
  },
  ['navigation-items'],
  { tags: ['navigation'], revalidate: 3600 },
);
