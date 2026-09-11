import React from 'react';
import { Metadata } from 'next';
import { getPage } from '@/lib/data/pages';
import { DynamicPageRenderer } from '@/components/content/DynamicPageRenderer';
import FallbackPage from './mapsense_cms_page';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('/mapsense');
  return {
    title: page?.seoTitle || 'MapSense - Spatial ESG Risk Screening | Envint',
    description: page?.seoDescription || 'Spatial environmental and social risk screening.',
    alternates: { canonical: 'https://envintglobal.com/mapsense/' },
    openGraph: {
      title: page?.seoTitle || 'MapSense - Spatial ESG Risk Screening | Envint',
      description: page?.seoDescription || 'Spatial environmental and social risk screening.',
      url: 'https://envintglobal.com/mapsense/',
      type: 'website',
    },
  };
}

export default async function Page() {
  const page = await getPage('/mapsense');
  if (page && page.contentBlocks && (page.contentBlocks as any[]).length > 0) {
    return <DynamicPageRenderer page={page} />;
  }
  return <FallbackPage />;
}

