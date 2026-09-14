import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ResolvedRouteRenderer } from '@/components/content/ResolvedRouteRenderer';
import { resolvePublicRoute } from './resolve-public-route';

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
  const image = entity.coverImageUrl || entity.heroImage || entity.avatarUrl || entity.coverImage?.url;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: route.kind === 'record' && route.recordType === 'insight' ? 'article' : 'website',
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export async function renderPublicPath(pathname: string) {
  const route = await resolvePublicRoute(pathname);
  if (!route) notFound();
  return <ResolvedRouteRenderer route={route} />;
}
