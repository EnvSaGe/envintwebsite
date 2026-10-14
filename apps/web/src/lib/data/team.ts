import { db, teamMembers, eq, and, asc } from '@envint/db';
import { unstable_cache } from 'next/cache';
import localTeam from '@/data/team.json';

export function sortTeamMembers<T extends { roleTitle?: string | null; name: string; orderIndex?: number | null }>(members: T[]): T[] {
  return [...members].sort((a, b) => {
    const orderA = a.orderIndex !== undefined && a.orderIndex !== null ? a.orderIndex : 999;
    const orderB = b.orderIndex !== undefined && b.orderIndex !== null ? b.orderIndex : 999;
    if (orderA !== orderB) return orderA - orderB;
    const isPartnerA = /partner/i.test((a as any).roleTitle || (a as any).role || '');
    const isPartnerB = /partner/i.test((b as any).roleTitle || (b as any).role || '');
    if (isPartnerA && !isPartnerB) return -1;
    if (!isPartnerA && isPartnerB) return 1;
    return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
  });
}

export async function getTeamMembers() {
  return unstable_cache(
    async () => {
      try {
        const records = await db.query.teamMembers.findMany({
          where: eq(teamMembers.status, 'PUBLISHED'),
          orderBy: [asc(teamMembers.orderIndex)],
          with: { avatar: true },
        });
        if (records && records.length > 0) {
          return sortTeamMembers(records);
        }
      } catch {
        // Fallback to local canonical data
      }
      return sortTeamMembers(localTeam as any);
    },
    ['team-list-v3'],
    { tags: ['team:list'] }
  )();
}

export async function getTeamMember(slug: string) {
  return unstable_cache(
    async () => {
      try {
        const record = await db.query.teamMembers.findFirst({
          where: and(eq(teamMembers.slug, slug), eq(teamMembers.status, 'PUBLISHED')),
          with: { avatar: true, articles: true },
        });
        if (record) return record;
      } catch {
        // Fallback to local canonical data
      }
      const found = localTeam.find((item: any) => item.slug === slug);
      return found ?? null;
    },
    [`team-${slug}`],
    { tags: [`team:${slug}`] }
  )();
}
