import React from 'react';
import { Metadata } from 'next';
import { getPage, pageHasRenderableContent } from '@/lib/data/pages';
import { DynamicPageRenderer } from '@/components/content/DynamicPageRenderer';
import FallbackPage from './connect_cms_page';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('/connect');
  return {
    title: page?.seoTitle || 'Connect with Envint - ESG & Climate Advisory',
    description: page?.seoDescription || 'Get in touch with Envint.',
    alternates: { canonical: 'https://envintglobal.com/connect/' },
    openGraph: {
      title: page?.seoTitle || 'Connect with Envint - ESG & Climate Advisory',
      description: page?.seoDescription || 'Get in touch with Envint.',
      url: 'https://envintglobal.com/connect/',
      type: 'website',
    },
  };
}

export default async function Page() {
  const page = await getPage('/connect');
  if (pageHasRenderableContent(page)) {
    return <DynamicPageRenderer page={page} />;
  }
  return <FallbackPage />;
}

