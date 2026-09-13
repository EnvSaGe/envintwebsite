import React from 'react';
import { Metadata } from 'next';
import { getPage, pageHasRenderableContent } from '@/lib/data/pages';
import { DynamicPageRenderer } from '@/components/content/DynamicPageRenderer';
import FallbackPage from './esq_cms_page';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('/esq');
  const desc = "Envint's proprietary ESG maturity index.";
  return {
    title: page?.seoTitle || 'ESQ - Environmental Sustainability Quotient | Envint',
    description: page?.seoDescription || desc,
    alternates: { canonical: 'https://envintglobal.com/esq/' },
    openGraph: {
      title: page?.seoTitle || 'ESQ - Environmental Sustainability Quotient | Envint',
      description: page?.seoDescription || desc,
      url: 'https://envintglobal.com/esq/',
      type: 'website',
    },
  };
}

export default async function Page() {
  const page = await getPage('/esq');
  if (pageHasRenderableContent(page)) {
    return <DynamicPageRenderer page={page} />;
  }
  return <FallbackPage />;
}
