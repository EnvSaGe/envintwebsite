import type { Metadata } from 'next';
import { metadataForPublicPath, renderPublicPath } from '@/lib/routes/public-page-adapter';
interface Props { params: Promise<{ slug: string }> }
export async function generateMetadata({ params }: Props): Promise<Metadata> { return metadataForPublicPath(`/author/${(await params).slug}`); }
export default async function Page({ params }: Props) { return renderPublicPath(`/author/${(await params).slug}`); }
