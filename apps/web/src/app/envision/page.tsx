import React from 'react';
import { Metadata } from 'next';
import { getPage } from '@/lib/data/pages';
import { DynamicPageRenderer } from '@/components/content/DynamicPageRenderer';
import FallbackPage from './envision_cms_page';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('/envision');
  return {
    title: page?.seoTitle || 'Envision ESG Insights Hub | Envint',
    description: page?.seoDescription || 'Research and thought leadership on ESG.',
    alternates: { canonical: 'https://envintglobal.com/envision/' },
    openGraph: {
      title: page?.seoTitle || 'Envision ESG Insights Hub | Envint',
      description: page?.seoDescription || 'Research and thought leadership on ESG.',
      url: 'https://envintglobal.com/envision/',
      type: 'website',
    },
  };
}

export default async function Page() {
  const page = await getPage('/envision');
  if (page && page.contentBlocks && (page.contentBlocks as any[]).length > 0) {
    return <DynamicPageRenderer page={page} />;
  }
  return <FallbackPage />;
}

