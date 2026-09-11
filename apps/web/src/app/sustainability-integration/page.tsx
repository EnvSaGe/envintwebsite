import React from 'react';
import { Metadata } from 'next';
import { getPage } from '@/lib/data/pages';
import { DynamicPageRenderer } from '@/components/content/DynamicPageRenderer';
import FallbackPage from './sustainability_integration_cms_page';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('/sustainability-integration');
  return {
    title: page?.seoTitle || 'Sustainability Integration Advisory - Envint',
    description: page?.seoDescription || 'ESG strategy, governance design, and reporting.',
    alternates: { canonical: 'https://envintglobal.com/sustainability-integration/' },
    openGraph: {
      title: page?.seoTitle || 'Sustainability Integration Advisory - Envint',
      description: page?.seoDescription || 'ESG strategy, governance design, and reporting.',
      url: 'https://envintglobal.com/sustainability-integration/',
      type: 'website',
    },
  };
}

export default async function Page() {
  const page = await getPage('/sustainability-integration');
  if (page && page.contentBlocks && (page.contentBlocks as any[]).length > 0) {
    return <DynamicPageRenderer page={page} />;
  }
  return <FallbackPage />;
}

