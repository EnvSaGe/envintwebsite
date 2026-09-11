import React from 'react';
import { Metadata } from 'next';
import { getPage } from '@/lib/data/pages';
import { DynamicPageRenderer } from '@/components/content/DynamicPageRenderer';
import FallbackPage from './climate_action_cms_page';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('/climate-action');
  return {
    title: page?.seoTitle || 'Climate Action & Decarbonization Advisory - Envint',
    description: page?.seoDescription || 'Net-zero pathways and GHG accounting.',
    alternates: { canonical: 'https://envintglobal.com/climate-action/' },
    openGraph: {
      title: page?.seoTitle || 'Climate Action & Decarbonization Advisory - Envint',
      description: page?.seoDescription || 'Net-zero pathways and GHG accounting.',
      url: 'https://envintglobal.com/climate-action/',
      type: 'website',
    },
  };
}

export default async function Page() {
  const page = await getPage('/climate-action');
  if (page && page.contentBlocks && (page.contentBlocks as any[]).length > 0) {
    return <DynamicPageRenderer page={page} />;
  }
  return <FallbackPage />;
}

