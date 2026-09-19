import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ResolvedRouteRenderer } from '@/components/content/ResolvedRouteRenderer';
import { resolvePublicRoute } from './resolve-public-route';
import { resolveCmsImage } from '@envint/shared';

function canonicalPath(pathname: string): string {
  return pathname === '/' ? '/' : `${pathname.replace(/\/+$/g, '')}/`;
}

export async function metadataForPublicPath(pathname: string): Promise<Metadata> {
  const route = await resolvePublicRoute(pathname);
  if (!route) return { title: 'Page Not Found | Envint' };
  const entity = (route.kind === 'page' ? route.page : route.kind === 'record' ? route.record : route.archive) as Record<string, any>;
  const title = entity.seoTitle || entity.title || 'Envint';
  const description = entity.seoDescription || entity.description || entity.excerpt || entity.summary || '';
  const canonical = `https://envintglobal.com${canonicalPath(route.pathname)}`;
  const rawImage = entity.coverImageUrl || entity.heroImage || entity.avatarUrl || entity.coverImage?.url;
  const image = rawImage ? resolveCmsImage(rawImage) : undefined;
  const keywords = entity.seoKeywords || entity.keywords || [
    'Envint',
    'Sustainability',
    'ESG Consulting',
    'Climate Action',
    'Responsible Investment',
    title,
  ];

  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Envint',
      locale: 'en_US',
      type: route.kind === 'record' && route.recordType === 'insight' ? 'article' : 'website',
      images: image ? [{ url: image, alt: title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export async function renderPublicPath(pathname: string) {
  const route = await resolvePublicRoute(pathname);
  if (!route) notFound();
  return <ResolvedRouteRenderer route={route} />;
}
