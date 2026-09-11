import React from 'react';
import { Metadata } from 'next';
import { getPage } from '@/lib/data/pages';
import { DynamicPageRenderer } from '@/components/content/DynamicPageRenderer';
import FallbackPage from './enviki_cms_page';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('/enviki');
  return {
    title: page?.seoTitle || 'Enviki - Sustainability Wiki | Envint',
    description: page?.seoDescription || 'Comprehensive sustainability knowledge base.',
    alternates: { canonical: 'https://envintglobal.com/enviki/' },
    openGraph: {
      title: page?.seoTitle || 'Enviki - Sustainability Wiki | Envint',
      description: page?.seoDescription || 'Comprehensive sustainability knowledge base.',
      url: 'https://envintglobal.com/enviki/',
      type: 'website',
    },
  };
}

export default async function Page() {
  const page = await getPage('/enviki');
  if (page && page.contentBlocks && (page.contentBlocks as any[]).length > 0) {
    return <DynamicPageRenderer page={page} />;
  }
  return <FallbackPage />;
}

