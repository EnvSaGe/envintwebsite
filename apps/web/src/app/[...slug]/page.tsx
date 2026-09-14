import type { Metadata } from 'next';
import { getInsights } from '@/lib/data/insights';
import { metadataForPublicPath, renderPublicPath } from '@/lib/routes/public-page-adapter';

interface CatchAllPageProps { params: Promise<{ slug: string[] }> }

export async function generateStaticParams() {
  return (await getInsights()).map((article: any) => ({ slug: [article.slug] }));
}

function pathFrom(slug: string[]): string {
  return `/${slug.join('/')}`;
}

export async function generateMetadata({ params }: CatchAllPageProps): Promise<Metadata> {
  return metadataForPublicPath(pathFrom((await params).slug));
}

export default async function CatchAllPage({ params }: CatchAllPageProps) {
  return renderPublicPath(pathFrom((await params).slug));
}
