import { Metadata } from 'next';
import { getTaxonomyArchive } from '@/lib/data/taxonomies';
import { TaxonomyArchiveView } from '@/components/templates/TaxonomyArchiveView';
import { getArchiveRoutes, humanizeTerm, typeLabel } from '@/lib/archives';

interface TagPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getArchiveRoutes('tag').map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const title = humanizeTerm(slug);
  return {
    title: `${title} - Envint Insights`,
    description: `Articles tagged ${title.toLowerCase()} — Envint's knowledge resources on sustainability, ESG and climate action.`,
    alternates: { canonical: `https://envintglobal.com/tag/${slug}/` },
  };
}

export default async function TagArchivePage({ params }: TagPageProps) {
  const { slug } = await params;
  const data = await getTaxonomyArchive('tag', slug);
  return <TaxonomyArchiveView type={typeLabel('tag')} slug={slug} title={data.name} description={data.description} items={data.items} />;
}
