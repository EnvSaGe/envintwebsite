import React from 'react';
import { Metadata } from 'next';
import { getPage } from '@/lib/data/pages';
import { DynamicPageRenderer } from '@/components/content/DynamicPageRenderer';
import FallbackPage from './responsible_investment_cms_page';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('/responsible-investment');
  return {
    title: page?.seoTitle || 'Responsible Investment & ESG Due Diligence - Envint',
    description: page?.seoDescription || 'Pre-investment ESG due diligence.',
    alternates: { canonical: 'https://envintglobal.com/responsible-investment/' },
    openGraph: {
      title: page?.seoTitle || 'Responsible Investment & ESG Due Diligence - Envint',
      description: page?.seoDescription || 'Pre-investment ESG due diligence.',
      url: 'https://envintglobal.com/responsible-investment/',
      type: 'website',
    },
  };
}

export default async function Page() {
  const page = await getPage('/responsible-investment');
  if (page && page.contentBlocks && (page.contentBlocks as any[]).length > 0) {
    return <DynamicPageRenderer page={page} />;
  }
  return <FallbackPage />;
}

