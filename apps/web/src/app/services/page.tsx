/**
 * /services/page.tsx
 *
 * CMS-first rendering: if DB has published content blocks for /services,
 * renders them via DynamicPageRenderer. Falls back to the original
 * pixel-perfect hard-coded JSX (ServicesPageFallback) when no DB record exists.
 */
import React from 'react';
import { Metadata } from 'next';
import { getPage } from '@/lib/data/pages';
import { DynamicPageRenderer } from '@/components/content/DynamicPageRenderer';
import ServicesPageFallback from './ServicesPageFallback';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('/services');
  return {
    title: page?.seoTitle || 'Sustainability & ESG Advisory Services - Envint',
    description: page?.seoDescription || 'Explore Envint\'s tiered capability model: Sustainability Integration, Climate Action, Responsible Investment, sector expertise, and proprietary ESG tools.',
    alternates: { canonical: 'https://envintglobal.com/services/' },
    openGraph: {
      title: page?.seoTitle || 'Sustainability & ESG Advisory Services - Envint',
      description: page?.seoDescription || '',
      url: 'https://envintglobal.com/services/',
      type: 'website',
    },
  };
}

export default async function ServicesPage() {
  const page = await getPage('/services');

  // If the DB has published content blocks, render them via CMS
  if (page && page.contentBlocks && (page.contentBlocks as any[]).length > 0) {
    return <DynamicPageRenderer page={page} />;
  }

  // Graceful fallback: render the original hand-crafted page
  return <ServicesPageFallback />;
}
