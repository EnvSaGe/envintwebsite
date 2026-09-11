import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getTaxonomyArchive } from '@/lib/data/taxonomies';
import { TaxonomyArchiveView } from '@/components/templates/TaxonomyArchiveView';
import { getArchiveRoutes, humanizeTerm } from '@/lib/archives';

interface CategoryPageProps {
  params: Promise<{ slug?: string[] }>;
}

export function generateStaticParams() {
  return getArchiveRoutes('category').map((r) => ({ slug: r.slug.split('/') }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const segments = slug || [];
  if (segments.length === 0) {
    return { title: 'Categories - Envint' };
  }
  const fullSlug = segments.join('/');
  const title = humanizeTerm(fullSlug);
  return {
    title: `${title} - Envint Insights`,
    description: `Read Envint's ${title.toLowerCase()} articles, thought leadership and knowledge resources on sustainability, ESG and climate action.`,
    alternates: {
      canonical: `https://envintglobal.com/category/${fullSlug}/`,
    },
  };
}

export default async function CategoryArchivePage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const segments = slug || [];
  if (segments.length === 0) {
    redirect('/category/all-categories/');
  }
  const fullSlug = segments.join('/');
  const data = await getTaxonomyArchive('category', fullSlug);
  return <TaxonomyArchiveView type="Category" slug={fullSlug} title={data.name} description={data.description} items={data.items} />;
}
