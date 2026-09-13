import { db, siteSettings } from '@envint/db';
import { unstable_cache } from 'next/cache';
import { globalTag } from '../routes/cache-tags';

export type PublicSiteSettings = Record<string, unknown>;

const loadPublicSiteSettings = unstable_cache(
  async (): Promise<PublicSiteSettings> => {
    try {
      const records = await db.select().from(siteSettings);
      return Object.fromEntries(
        records.map((record) => [record.key, record.valueJson ?? record.value ?? '']),
      );
    } catch (error) {
      console.error('[site-settings] DB error, returning defaults:', error);
      return {};
    }
  },
  ['public-site-settings'],
  {
    tags: [globalTag('settings'), globalTag('header'), globalTag('footer')],
    revalidate: 3600,
  },
);

export function getPublicSiteSettings(): Promise<PublicSiteSettings> {
  return loadPublicSiteSettings();
}

export function textSetting(
  settings: PublicSiteSettings,
  key: string,
  fallback: string,
): string {
  const value = settings[key];
  return typeof value === 'string' && value.trim() ? value : fallback;
}
