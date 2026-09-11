import { Metadata } from 'next';
import { getTaxonomyArchive } from '@/lib/data/taxonomies';
import { TaxonomyArchiveView } from '@/components/templates/TaxonomyArchiveView';
import { getArchiveRoutes, humanizeTerm, typeLabel } from '@/lib/archives';

interface SectorPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getArchiveRoutes('sector').map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: SectorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const title = humanizeTerm(slug);
  return {
    title: `${title} - Envint Impact`,
    description: `Envint impact case studies and advisory work in the ${title.toLowerCase()} sector.`,
    alternates: { canonical: `https://envintglobal.com/sector/${slug}/` },
  };
}

export default async function SectorArchivePage({ params }: SectorPageProps) {
  const { slug } = await params;
  const data = await getTaxonomyArchive('sector', slug);
  return <TaxonomyArchiveView type={typeLabel('sector')} slug={slug} title={data.name} description={data.description} items={data.items} />;
}
