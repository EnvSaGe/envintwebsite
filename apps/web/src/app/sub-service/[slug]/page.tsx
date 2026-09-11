import { Metadata } from 'next';
import { getTaxonomyArchive } from '@/lib/data/taxonomies';
import { TaxonomyArchiveView } from '@/components/templates/TaxonomyArchiveView';
import { getArchiveRoutes, humanizeTerm, typeLabel } from '@/lib/archives';

interface SubServicePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getArchiveRoutes('sub-service').map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: SubServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const title = humanizeTerm(slug);
  return {
    title: `${title} - Envint Services`,
    description: `Learn about Envint's ${title.toLowerCase()} service offering for businesses, investors and public-sector clients.`,
    alternates: { canonical: `https://envintglobal.com/sub-service/${slug}/` },
  };
}

export default async function SubServiceArchivePage({ params }: SubServicePageProps) {
  const { slug } = await params;
  const data = await getTaxonomyArchive('sub-service', slug);
  return <TaxonomyArchiveView type={typeLabel('sub-service')} slug={slug} title={data.name} description={data.description} items={data.items} />;
}
