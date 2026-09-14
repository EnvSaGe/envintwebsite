import type { Metadata } from 'next';
import { getImpacts } from '@/lib/data/impacts';
import { metadataForPublicPath, renderPublicPath } from '@/lib/routes/public-page-adapter';

interface ImpactPageProps { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return (await getImpacts()).map((item: any) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: ImpactPageProps): Promise<Metadata> {
  return metadataForPublicPath(`/impact/${(await params).slug}`);
}

export default async function ImpactPage({ params }: ImpactPageProps) {
  return renderPublicPath(`/impact/${(await params).slug}`);
}
