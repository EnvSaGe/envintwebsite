import { Metadata } from 'next';
import { getTaxonomyArchive } from '@/lib/data/taxonomies';
import { TaxonomyArchiveView } from '@/components/templates/TaxonomyArchiveView';
import { getArchiveRoutes, humanizeTerm, typeLabel } from '@/lib/archives';

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getArchiveRoutes('service').map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const title = humanizeTerm(slug);
  return {
    title: `${title} - Envint Services`,
    description: `Explore Envint's ${title.toLowerCase()} advisory services and related case studies.`,
    alternates: { canonical: `https://envintglobal.com/service/${slug}/` },
  };
}

export default async function ServiceArchivePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const data = await getTaxonomyArchive('service', slug);
  return <TaxonomyArchiveView type={typeLabel('service')} slug={slug} title={data.name} description={data.description} items={data.items} />;
}
