import React from 'react';
import { Metadata } from 'next';
import { getPage, pageHasRenderableContent } from '@/lib/data/pages';
import { DynamicPageRenderer } from '@/components/content/DynamicPageRenderer';
import FallbackPage from './behind_the_buzz_cms_page';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('/behind-the-buzz');
  return {
    title: page?.seoTitle || 'Behind the Buzz - ESG Jargon Decoded | Envint',
    description: page?.seoDescription || 'Clear-eyed analysis of ESG buzzwords.',
    alternates: { canonical: 'https://envintglobal.com/behind-the-buzz/' },
    openGraph: {
      title: page?.seoTitle || 'Behind the Buzz - ESG Jargon Decoded | Envint',
      description: page?.seoDescription || 'Clear-eyed analysis of ESG buzzwords.',
      url: 'https://envintglobal.com/behind-the-buzz/',
      type: 'website',
    },
  };
}

export default async function Page() {
  const page = await getPage('/behind-the-buzz');
  if (pageHasRenderableContent(page)) {
    return <DynamicPageRenderer page={page} />;
  }
  return <FallbackPage />;
}

