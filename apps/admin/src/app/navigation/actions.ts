'use server';

/**
 * ============================================================================
 * NAVIGATION SERVER ACTIONS
 * ============================================================================
 * 
 * PURPOSE:
 * This file contains Next.js Server Actions used by the Admin CMS to manage
 * the website's navigation menus (Header Navbar links and Footer link columns).
 * 
 * DATABASE TABLE:
 * Modifies the `navigation_items` table in PostgreSQL via Drizzle ORM.
 * 
 * SECURITY:
 * All actions are protected by `requireRole(['super_admin', 'editor'])` via Clerk.
 * 
 * CACHE REVALIDATION:
 * Whenever an item is saved, deleted, or reordered, this file calls
 * `dispatchRevalidation()` to instantly purge the Next.js cache on the public
 * website (`apps/web`) so visitors see updated navigation menus immediately.
 * ============================================================================
 */

import { db, navigationItems, eq } from '@envint/db';
import { requireRole } from '@/lib/clerk-rbac';
import { dispatchRevalidation } from '@/lib/revalidate-dispatcher';

/**
 * Fetches all navigation links for a given menu group (e.g. 'primary' for header, 'footer' for footer).
 * Sorted in ascending display order (orderIndex).
 * 
 * @param navGroup - 'primary' (Header Navigation) or 'footer' (Footer Columns)
 */
export async function fetchNavigationItems(navGroup: string = 'primary') {
  await requireRole(['super_admin', 'editor']);

  const items = await db.query.navigationItems.findMany({
    where: eq(navigationItems.navGroup, navGroup),
    orderBy: (n, { asc }) => [asc(n.orderIndex)],
  });

  return items.map((i) => ({
    id: i.id,
    label: i.label,
    href: i.href,
    parentId: i.parentId,
    orderIndex: i.orderIndex,
    isActive: i.isActive,
    navGroup: i.navGroup,
    openInNewTab: i.openInNewTab,
  }));
}

/**
 * Creates a new navigation link or updates an existing one by ID.
 * Automatically dispatches cache revalidation so the public website updates instantly.
 * 
 * @param item.id - If present, updates existing row; if undefined, inserts a new row
 * @param item.label - Link text displayed to visitors (e.g. 'About Us', 'Enviki')
 * @param item.href - Target URL (e.g. '/about/', 'https://...')
 * @param item.parentId - Optional parent ID for multi-level dropdown menus
 * @param item.orderIndex - Sort order index (0, 1, 2...)
 * @param item.isActive - Whether this link is visible on the live site
 * @param item.navGroup - Menu group ('primary' or 'footer')
 * @param item.openInNewTab - Whether clicking opens link in a new browser tab
 */
export async function saveNavigationItem(item: {
  id?: string;
  label: string;
  href: string;
  parentId?: string | null;
  orderIndex?: number;
  isActive?: boolean;
  navGroup?: string;
  openInNewTab?: boolean;
}) {
  await requireRole(['super_admin', 'editor']);

  if (!item.label?.trim() || !item.href?.trim()) {
    throw new Error('Label and href are required.');
  }

  if (item.id) {
    // Update existing navigation link
    await db
      .update(navigationItems)
      .set({
        label: item.label,
        href: item.href,
        parentId: item.parentId || null,
        orderIndex: item.orderIndex ?? 0,
        isActive: item.isActive !== undefined ? item.isActive : true,
        navGroup: item.navGroup || 'primary',
        openInNewTab: item.openInNewTab ?? false,
        updatedAt: new Date(),
      })
      .where(eq(navigationItems.id, item.id));
  } else {
    // Create new navigation link
    await db.insert(navigationItems).values({
      label: item.label,
      href: item.href,
      parentId: item.parentId || null,
      orderIndex: item.orderIndex ?? 0,
      isActive: item.isActive !== undefined ? item.isActive : true,
      navGroup: item.navGroup || 'primary',
      openInNewTab: item.openInNewTab ?? false,
    });
  }

  // Purge public site cache tags so changes go live immediately
  await dispatchRevalidation({
    tags: [
      'global:navigation',
      `global:${(item.navGroup ?? 'primary') === 'primary' ? 'header' : 'footer'}`,
    ],
  });

  return { success: true };
}

/**
 * Permanently deletes a navigation link from the database.
 * Triggers cache revalidation to remove the link from the live website.
 * 
 * @param id - UUID of the navigation item to delete
 */
export async function deleteNavigationItem(id: string) {
  await requireRole(['super_admin', 'editor']);
  await db.delete(navigationItems).where(eq(navigationItems.id, id));
  await dispatchRevalidation({ tags: ['global:navigation', 'global:header', 'global:footer'] });
  return { success: true };
}

/**
 * Bulk updates the sort order (orderIndex) of multiple navigation items.
 * Used when drag-and-dropping menu items in the admin UI to reorder them.
 * 
 * @param items - Array of items with their new orderIndex values
 */
export async function reorderNavigationItems(items: Array<{ id: string; orderIndex: number }>) {
  await requireRole(['super_admin', 'editor']);

  for (const item of items) {
    await db
      .update(navigationItems)
      .set({ orderIndex: item.orderIndex, updatedAt: new Date() })
      .where(eq(navigationItems.id, item.id));
  }

  await dispatchRevalidation({ tags: ['global:navigation', 'global:header', 'global:footer'] });
  return { success: true };
}
