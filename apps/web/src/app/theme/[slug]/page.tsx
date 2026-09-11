import { Metadata } from 'next';
import { getTaxonomyArchive } from '@/lib/data/taxonomies';
import { TaxonomyArchiveView } from '@/components/templates/TaxonomyArchiveView';
import { getArchiveRoutes, humanizeTerm, typeLabel } from '@/lib/archives';

interface ThemePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getArchiveRoutes('theme').map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: ThemePageProps): Promise<Metadata> {
  const { slug } = await params;
  const title = humanizeTerm(slug);
  return {
    title: `${title} - Envint Impact`,
    description: `Envint case studies and insights focused on ${title.toLowerCase()}.`,
    alternates: { canonical: `https://envintglobal.com/theme/${slug}/` },
  };
}

export default async function ThemeArchivePage({ params }: ThemePageProps) {
  const { slug } = await params;
  const data = await getTaxonomyArchive('theme', slug);
  return <TaxonomyArchiveView type={typeLabel('theme')} slug={slug} title={data.name} description={data.description} items={data.items} />;
}
