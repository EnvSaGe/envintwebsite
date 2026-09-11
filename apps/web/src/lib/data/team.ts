import { db, teamMembers, eq, and, asc } from '@envint/db';
import { unstable_cache } from 'next/cache';
import localTeam from '@/data/team.json';

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
          return records;
        }
      } catch {
        // Fallback to local canonical data
      }
      return localTeam;
    },
    ['team-list'],
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
