import type { Metadata } from 'next';
import { getArchiveRoutes } from '@/lib/archives';
import { metadataForPublicPath, renderPublicPath } from '@/lib/routes/public-page-adapter';
interface Props { params: Promise<{ slug: string }> }
export function generateStaticParams() { return getArchiveRoutes('service').map((route) => ({ slug: route.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> { return metadataForPublicPath(`/service/${(await params).slug}`); }
export default async function Page({ params }: Props) { return renderPublicPath(`/service/${(await params).slug}`); }
