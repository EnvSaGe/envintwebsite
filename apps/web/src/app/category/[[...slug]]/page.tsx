import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getArchiveRoutes } from '@/lib/archives';
import { metadataForPublicPath, renderPublicPath } from '@/lib/routes/public-page-adapter';

interface CategoryPageProps { params: Promise<{ slug?: string[] }> }

export function generateStaticParams() {
  return getArchiveRoutes('category').map((route) => ({ slug: route.slug.split('/') }));
}

function categoryPath(slug?: string[]): string {
  return `/category/${(slug ?? []).join('/')}`;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  return metadataForPublicPath(categoryPath((await params).slug));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const slug = (await params).slug;
  if (!slug?.length) redirect('/category/all-categories/');
  return renderPublicPath(categoryPath(slug));
}
