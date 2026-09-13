import { PageBlockTree } from '../builder-schema';
import { createHomePageTree } from './home';
import { createAboutPageTree } from './about';
import { createServicesPageTree } from './services';
import { createCareersPageTree } from './careers';
import { createMapSensePageTree } from './mapsense';
import { createConnectPageTree } from './connect';
import { createPracticePageTree } from './practices';
import { createHubPageTree } from './hubs';

export * from './utils';
export * from './home';
export * from './about';
export * from './services';
export * from './careers';
export * from './mapsense';
export * from './connect';
export * from './practices';
export * from './hubs';

export const ALL_CANONICAL_PAGE_SLUGS = [
  '/',
  '/about',
  '/services',
  '/careers-at-envint',
  '/mapsense',
  '/impact',
  '/connect',
  '/sustainability-integration',
  '/climate-action',
  '/responsible-investment',
  '/envision',
  '/behind-the-buzz',
  '/how-to-articles',
  '/enviki',
  '/glossary-zone',
  '/esq',
  '/connect-gbc2024',
  '/disclaimer',
] as const;

export function getCanonicalPageTree(slug: string): PageBlockTree | null {
  const normalizedSlug = slug === '' ? '/' : slug.startsWith('/') ? slug : `/${slug}`;

  switch (normalizedSlug) {
    case '/':
      return createHomePageTree();
    case '/about':
      return createAboutPageTree();
    case '/services':
      return createServicesPageTree();
    case '/careers-at-envint':
      return createCareersPageTree();
    case '/mapsense':
      return createMapSensePageTree();
    case '/connect':
      return createConnectPageTree();
    case '/sustainability-integration':
    case '/climate-action':
    case '/responsible-investment':
      return createPracticePageTree(normalizedSlug);
    case '/impact':
    case '/envision':
    case '/behind-the-buzz':
    case '/how-to-articles':
    case '/enviki':
    case '/glossary-zone':
    case '/esq':
    case '/connect-gbc2024':
    case '/disclaimer':
      return createHubPageTree(normalizedSlug);
    default:
      return null;
  }
}
