import React from 'react';
import { Metadata } from 'next';
import { getPage } from '@/lib/data/pages';
import { DynamicPageRenderer } from '@/components/content/DynamicPageRenderer';
import FallbackPage from './impact_cms_page';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('/impact');
  const desc = "Explore Envint's portfolio of 300+ sustainability engagements.";
  return {
    title: page?.seoTitle || 'Sustainability and ESG Case Studies',
    description: page?.seoDescription || desc,
    alternates: { canonical: 'https://envintglobal.com/impact/' },
    openGraph: {
      title: page?.seoTitle || 'Sustainability and ESG Case Studies',
      description: page?.seoDescription || desc,
      url: 'https://envintglobal.com/impact/',
      type: 'website',
    },
  };
}

export default async function Page() {
  const page = await getPage('/impact');
  if (page && page.contentBlocks && (page.contentBlocks as any[]).length > 0) {
    return <DynamicPageRenderer page={page} />;
  }
  return <FallbackPage />;
}
