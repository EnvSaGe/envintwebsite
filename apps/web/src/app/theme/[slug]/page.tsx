import type { Metadata } from 'next';
import { getArchiveRoutes } from '@/lib/archives';
import { metadataForPublicPath, renderPublicPath } from '@/lib/routes/public-page-adapter';
interface Props { params: Promise<{ slug: string }> }
export function generateStaticParams() { return getArchiveRoutes('theme').map((route) => ({ slug: route.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> { return metadataForPublicPath(`/theme/${(await params).slug}`); }
export default async function Page({ params }: Props) { return renderPublicPath(`/theme/${(await params).slug}`); }
