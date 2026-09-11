export const CACHE_TAGS = {
  // Collections
  insightsList: 'insights:list',
  impactsList: 'impacts:list',
  teamList: 'team:list',
  servicesList: 'services:list',
  homePage: 'page:home',
  
  // Specific Entities
  insightDetail: (slug: string) => `insight:${slug}`,
  impactDetail: (slug: string) => `impact:${slug}`,
  teamMemberDetail: (slug: string) => `team:${slug}`,
  serviceDetail: (slug: string) => `service:${slug}`,
  pageDetail: (slug: string) => `page:${slug}`,
  taxonomyArchive: (type: string, slug: string) => `tax:${type}:${slug}`,
} as const;

export const SERVICE_PILLARS = [
  {
    slug: 'sustainability-integration',
    title: 'Sustainability Integration',
    route: '/sustainability-integration/',
  },
  {
    slug: 'responsible-investment',
    title: 'Responsible Investment',
    route: '/responsible-investment/',
  },
  {
    slug: 'climate-action',
    title: 'Climate Action',
    route: '/climate-action/',
  },
] as const;

export const BRAND_TOKENS = {
  colorPrimary: '#2f7abe',
  colorPrimaryHover: '#045cb4',
  colorPrimarySubtle: '#f0f5fa',
  colorTextPrimary: '#111111',
  colorTextBody: '#334155',
  colorBgDark: '#001c35',
  containerMaxWidth: '1140px',
} as const;
