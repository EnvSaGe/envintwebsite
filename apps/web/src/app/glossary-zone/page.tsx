import React from 'react';
import { Metadata } from 'next';
import { getPage } from '@/lib/data/pages';
import { DynamicPageRenderer } from '@/components/content/DynamicPageRenderer';
import FallbackPage from './glossary_zone_cms_page';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('/glossary-zone');
  return {
    title: page?.seoTitle || 'ESG & Climate Glossary | Envint',
    description: page?.seoDescription || 'Clear definitions for every ESG term.',
    alternates: { canonical: 'https://envintglobal.com/glossary-zone/' },
    openGraph: {
      title: page?.seoTitle || 'ESG & Climate Glossary | Envint',
      description: page?.seoDescription || 'Clear definitions for every ESG term.',
      url: 'https://envintglobal.com/glossary-zone/',
      type: 'website',
    },
  };
}

export default async function Page() {
  const page = await getPage('/glossary-zone');
  if (page && page.contentBlocks && (page.contentBlocks as any[]).length > 0) {
    return <DynamicPageRenderer page={page} />;
  }
  return <FallbackPage />;
}

