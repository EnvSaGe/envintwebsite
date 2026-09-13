'use server';

import { db, navigationItems, eq } from '@envint/db';
import { requireRole } from '@/lib/clerk-rbac';
import { dispatchRevalidation } from '@/lib/revalidate-dispatcher';

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

  await dispatchRevalidation({ tags: ['global:navigation', `global:${(item.navGroup ?? 'primary') === 'primary' ? 'header' : 'footer'}`] });
  return { success: true };
}

export async function deleteNavigationItem(id: string) {
  await requireRole(['super_admin', 'editor']);
  await db.delete(navigationItems).where(eq(navigationItems.id, id));
  await dispatchRevalidation({ tags: ['global:navigation', 'global:header', 'global:footer'] });
  return { success: true };
}

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
