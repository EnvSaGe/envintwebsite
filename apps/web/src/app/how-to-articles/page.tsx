import React from 'react';
import { Metadata } from 'next';
import { getPage } from '@/lib/data/pages';
import { DynamicPageRenderer } from '@/components/content/DynamicPageRenderer';
import FallbackPage from './how_to_articles_cms_page';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('/how-to-articles');
  return {
    title: page?.seoTitle || 'How-To ESG Guides | Envint',
    description: page?.seoDescription || 'Step-by-step ESG implementation guides.',
    alternates: { canonical: 'https://envintglobal.com/how-to-articles/' },
    openGraph: {
      title: page?.seoTitle || 'How-To ESG Guides | Envint',
      description: page?.seoDescription || 'Step-by-step ESG implementation guides.',
      url: 'https://envintglobal.com/how-to-articles/',
      type: 'website',
    },
  };
}

export default async function Page() {
  const page = await getPage('/how-to-articles');
  if (page && page.contentBlocks && (page.contentBlocks as any[]).length > 0) {
    return <DynamicPageRenderer page={page} />;
  }
  return <FallbackPage />;
}

