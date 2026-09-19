import type { ResolvedPublicRoute } from '@/lib/routes/types';
import { DynamicPageRenderer } from './DynamicPageRenderer';
import { TemplateRenderer } from '../builder/TemplateRenderer';
import {
  JsonLd,
  articleSchema,
  breadcrumbSchema,
  personProfileSchema,
  serviceSchema,
  aboutPageSchema,
  contactPageSchema,
  collectionPageSchema,
} from '@/components/seo/JsonLd';
import { resolveCmsImage } from '@envint/shared';

function buildBreadcrumbs(pathname: string, currentTitle?: string): { name: string; path: string }[] {
  const cleanPath = pathname.replace(/^\/+|\/+$/g, '');
  if (!cleanPath) return [];

  const parts = cleanPath.split('/');
  const items: { name: string; path: string }[] = [{ name: 'Home', path: '/' }];

  let accumulated = '';
  parts.forEach((part, index) => {
    accumulated += `/${part}`;
    const isLast = index === parts.length - 1;

    let name = part
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());

    if (isLast && currentTitle) {
      name = currentTitle;
    } else if (part === 'member') {
      name = 'Team';
    }

    items.push({
      name,
      path: `${accumulated}/`,
    });
  });

  return items;
}

function getRouteJsonLd(route: ResolvedPublicRoute): Record<string, unknown>[] {
  const schemas: Record<string, unknown>[] = [];
  const pathname = route.pathname.replace(/\/+$/g, '') || '/';

  // 1. Breadcrumbs for any page below root
  if (pathname !== '/') {
    const title =
      route.kind === 'record'
        ? (route.record as any).title || (route.record as any).name
        : route.kind === 'page'
        ? route.page.seoTitle || route.page.title
        : route.archive.title;
    const breadcrumbs = buildBreadcrumbs(pathname, title);
    if (breadcrumbs.length > 1) {
      schemas.push(breadcrumbSchema(breadcrumbs));
    }
  }

  // 2. Specific Entity Schemas
  if (route.kind === 'record') {
    const record = route.record as Record<string, any>;
    const rawImage = record.coverImageUrl || record.heroImage || record.avatarUrl || record.coverImage?.url;
    const image = rawImage ? resolveCmsImage(rawImage) : undefined;

    if (route.recordType === 'insight') {
      schemas.push(
        articleSchema({
          headline: record.title || 'Envint Insight',
          description: record.seoDescription || record.excerpt || record.summary || '',
          url: `${pathname}/`,
          image,
          datePublished: record.publishedAt || record.datePublished || record.date,
          dateModified: record.updatedAt || record.dateModified || record.publishedAt,
          authorName: record.author || record.authorName || 'Envint',
        })
      );
    } else if (route.recordType === 'impact') {
      schemas.push(
        articleSchema({
          headline: record.title || 'Envint Case Study',
          description: record.seoDescription || record.summary || record.excerpt || '',
          url: `${pathname}/`,
          image,
          datePublished: record.publishedAt || record.datePublished,
          authorName: 'Envint',
        })
      );
    } else if (route.recordType === 'team-member') {
      schemas.push(
        personProfileSchema({
          name: record.name,
          url: `${pathname}/`,
          jobTitle: record.roleTitle || record.role || 'Team Member',
          description: record.bioText || record.bio || '',
          image,
          sameAs: record.linkedinUrl,
        })
      );
    }
  } else if (route.kind === 'page') {
    if (pathname === '/about') {
      schemas.push(aboutPageSchema());
    } else if (pathname === '/connect') {
      schemas.push(contactPageSchema());
    } else if (pathname === '/sustainability-integration') {
      schemas.push(
        serviceSchema({
          name: 'Sustainability Integration',
          description:
            'Envint helps organizations integrate sustainability into core strategy and operations — strategy and roadmaps, baselining and assessments, rollout and implementation, disclosure and communication, and supply chain integration.',
          url: '/sustainability-integration/',
        })
      );
    } else if (pathname === '/climate-action') {
      schemas.push(
        serviceSchema({
          name: 'Climate Action',
          description:
            'We work with corporates, investors and governments on assessments, scenario development, decarbonization and carbon markets.',
          url: '/climate-action/',
        })
      );
    } else if (pathname === '/responsible-investment') {
      schemas.push(
        serviceSchema({
          name: 'Responsible Investment',
          description:
            'Envint integrates ESG principles across the investment lifecycle for DFIs, private equity, venture capital, and angel investors.',
          url: '/responsible-investment/',
        })
      );
    }
  } else if (route.kind === 'archive') {
    schemas.push(
      collectionPageSchema({
        name: route.archive.title || 'Archive',
        description: route.archive.description || '',
        url: `${pathname}/`,
      })
    );
  }

  return schemas;
}

export function ResolvedRouteRenderer({ route }: { route: ResolvedPublicRoute }) {
  const schemas = getRouteJsonLd(route);

  let content: React.ReactNode;
  if (route.kind === 'page') {
    content = <DynamicPageRenderer page={route.page} />;
  } else if (route.kind === 'record') {
    content = (
      <TemplateRenderer
        tree={route.template.publishedBlocks}
        context={{
          record: route.record as Record<string, unknown>,
          route: { pathname: route.pathname, absoluteUrl: `https://envintglobal.com${route.pathname}/` },
        }}
      />
    );
  } else {
    content = (
      <TemplateRenderer
        tree={route.template.publishedBlocks}
        context={{
          route: { ...route.archive, pathname: route.pathname },
        }}
      />
    );
  }

  return (
    <>
      {schemas.length > 0 && <JsonLd data={schemas} />}
      {content}
    </>
  );
}

