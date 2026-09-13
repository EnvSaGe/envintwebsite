import React from 'react';
import { Metadata } from 'next';
import { getPage, pageHasRenderableContent } from '@/lib/data/pages';
import { DynamicPageRenderer } from '@/components/content/DynamicPageRenderer';
import FallbackPage from './disclaimer_cms_page';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('/disclaimer');
  return {
    title: page?.seoTitle || 'Legal Disclaimer - Envint',
    description: page?.seoDescription || 'Legal terms and disclaimers.',
    alternates: { canonical: 'https://envintglobal.com/disclaimer/' },
    openGraph: {
      title: page?.seoTitle || 'Legal Disclaimer - Envint',
      description: page?.seoDescription || 'Legal terms and disclaimers.',
      url: 'https://envintglobal.com/disclaimer/',
      type: 'website',
    },
  };
}

export default async function Page() {
  const page = await getPage('/disclaimer');
  if (pageHasRenderableContent(page)) {
    return <DynamicPageRenderer page={page} />;
  }
  return <FallbackPage />;
}

