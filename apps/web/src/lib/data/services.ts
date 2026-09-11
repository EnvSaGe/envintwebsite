import { db, services, eq, asc } from '@envint/db';
import { unstable_cache } from 'next/cache';

export async function getServices() {
  return unstable_cache(
    async () => {
      try {
        return await db.query.services.findMany({
          orderBy: [asc(services.orderIndex)],
          with: { subServices: true, heroImage: true },
        });
      } catch {
        return [];
      }
    },
    ['services-list'],
    { tags: ['services:list'] }
  )();
}

export async function getService(slug: string) {
  return unstable_cache(
    async () => {
      try {
        const record = await db.query.services.findFirst({
          where: eq(services.slug, slug),
          with: { subServices: true, impacts: true, heroImage: true },
        });
        return record ?? null;
      } catch {
        return null;
      }
    },
    [`service-${slug}`],
    { tags: [`service:${slug}`] }
  )();
}
