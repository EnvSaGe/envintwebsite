import { db, categories, tags, eq } from '@envint/db';
import { unstable_cache } from 'next/cache';
import localImpacts from '@/data/impacts.json';
import localInsights from '@/data/insights.json';

function formatSlugToTitle(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/* Canonical live term names for the sector & theme taxonomies (envintglobal.com).
   These match the WordPress term display names exactly (e.g. 'Infra & Real Estate'). */
const SECTOR_TERM_NAMES: Record<string, string> = {
  agriculture: 'Agriculture',
  automotive: 'Automotive',
  bfsi: 'BFSI',
  consumer: 'Consumer',
  energy: 'Energy',
  healthcare: 'Healthcare',
  'infra-real-estate': 'Infra & Real Estate',
  'metals-mining': 'Metals & Mining',
  multiple: 'Multiple',
  technology: 'Technology',
};

const THEME_TERM_NAMES: Record<string, string> = {
  bhr: 'BHR',
  'circular-economy': 'Circular Economy',
  decarbonization: 'Decarbonization',
  'electric-mobility': 'Electric Mobility',
  'esg-data': 'ESG Data',
  'sustainable-supply-chain': 'Sustainable Supply Chain',
  water: 'Water',
};

const SUB_SERVICE_TERM_NAMES: Record<string, string> = {
  'bhr-assessment': 'BHR Assessment',
  'capacity-building': 'Capacity Building',
  esap: 'ESAP',
  'esg-dd': 'ESG-DD',
  footprinting: 'Footprinting',
  'market-assessment': 'Market Assessment',
  materiality: 'Materiality',
  'reporting-disclosure': 'Reporting & Disclosure',
};

/* Lowercase, strip &amp;/&, hyphens and collapse whitespace so category strings like
   'Reporting &amp; Disclosure' and 'ESG-DD' can be compared against canonical term names. */
function normalizeTerm(value: string): string {
  return value
    .toLowerCase()
    .replace(/&amp;/g, '&')
    .replace(/&/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function mapImpactItem(imp: any, termName: string) {
  return {
    id: imp.id,
    title: imp.title,
    slug: `impact/${imp.slug}`,
    date: imp.publishedAt ? new Date(imp.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '',
    coverImage: imp.heroImage || imp.coverImage?.url || imp.coverImageUrl || '/images/services-sustainability.webp',
    category: termName,
  };
}

export async function getTaxonomyArchive(type: string, slug: string) {
  const terminalSlug = slug.split('/').filter(Boolean).pop() || slug;
  return unstable_cache(
    async () => {
      let termName = formatSlugToTitle(terminalSlug);
      let termDescription = '';
      let items: any[] = [];

      // Sector, theme & sub-service archives on the live site list only the impact case
      // studies assigned to that exact term, newest first. Match on the
      // canonical term name (not fuzzy substring) to avoid false positives
      // from titles/summaries or other taxonomies (e.g. 'BHR Assessment').
      if (type === 'sector' || type === 'theme' || type === 'sub-service') {
        const table =
          type === 'sector'
            ? SECTOR_TERM_NAMES
            : type === 'theme'
            ? THEME_TERM_NAMES
            : SUB_SERVICE_TERM_NAMES;
        if (table[terminalSlug]) {
          termName = table[terminalSlug];
        }
        const want = normalizeTerm(termName);
        items = localImpacts
          .filter((imp: any) =>
            (imp.categories || []).some((c: string) => normalizeTerm(String(c)) === want)
          )
          .sort((a: any, b: any) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime())
          .map((imp: any) => mapImpactItem(imp, termName));

        return {
          type,
          slug,
          name: termName,
          description: '',
          items,
        };
      }

      try {
        if (type === 'category') {
          const term = await db.query.categories.findFirst({ where: eq(categories.slug, terminalSlug) });
          if (term) {
            termName = term.name;
            termDescription = term.description || '';
          }
        } else if (type === 'tag') {
          const term = await db.query.tags.findFirst({ where: eq(tags.slug, terminalSlug) });
          if (term) {
            termName = term.name;
          }
        }
      } catch {
        // Fallback gracefully
      }

      // Handle nested taxonomy paths (e.g. category/enviki/glossary-zone):
      // the visible term is the last segment, but items may also be matched via
      // parent segments such as 'enviki'.
      const segments = slug.toLowerCase().split('/').filter(Boolean);
      const terminal = segments[segments.length - 1] || slug.toLowerCase();
      const matchers = Array.from(new Set([...segments, terminal].map((s) => s.replace(/[-_]/g, ' '))));

      const matches = (haystack: string[]) =>
        haystack.some((c) => {
          const val = c.toLowerCase();
          return matchers.some((m) => val.includes(m) || m.includes(val));
        });

      const matchedImpacts = localImpacts.filter((imp: any) => {
        const cats = imp.categories || [];
        return matches(cats) || matches([imp.title]) || matches([imp.summary]);
      }).map((imp: any) => ({
        id: imp.id,
        title: imp.title,
        slug: `impact/${imp.slug}`,
        date: imp.publishedAt ? new Date(imp.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '',
        coverImage: imp.heroImage || imp.coverImage?.url || imp.coverImageUrl || '/images/services-sustainability.webp',
        category: termName,
      }));

      const matchedInsights = localInsights.filter((ins: any) => {
        const cats = ins.categories || [];
        const tags = ins.tags || [];
        return matches(cats) || matches(tags) || matches([ins.title]);
      }).map((ins: any) => ({
        id: ins.id,
        title: ins.title,
        slug: ins.slug,
        date: ins.publishedAt ? new Date(ins.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '',
        coverImage: ins.coverImage?.url || ins.heroImage || ins.coverImageUrl || '/images/services-climate.webp',
        category: termName,
      }));

      items = [...matchedImpacts, ...matchedInsights];

      // If no exact term matches, surface the most relevant recent items
      if (items.length === 0) {
        items = localImpacts.slice(0, 4).map((imp: any) => ({
          id: imp.id,
          title: imp.title,
          slug: `impact/${imp.slug}`,
          date: imp.publishedAt ? new Date(imp.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '',
          coverImage: imp.heroImage || imp.coverImage?.url || imp.coverImageUrl || '/images/services-sustainability.webp',
          category: termName,
        }));
      }

      return {
        type,
        slug,
        name: termName,
        description: termDescription,
        items,
      };
    },
    [`taxonomy-${type}-${terminalSlug}`],
    { tags: [`tax:${type}:${terminalSlug}`] }
  )();
}
