import type { Metadata } from 'next';
import { getTeamMembers } from '@/lib/data/team';
import { metadataForPublicPath, renderPublicPath } from '@/lib/routes/public-page-adapter';

interface MemberPageProps { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return (await getTeamMembers()).map((item: any) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: MemberPageProps): Promise<Metadata> {
  return metadataForPublicPath(`/member/${(await params).slug}`);
}

export default async function MemberPage({ params }: MemberPageProps) {
  return renderPublicPath(`/member/${(await params).slug}`);
}
