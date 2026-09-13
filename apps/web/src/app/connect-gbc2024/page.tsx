import React from 'react';
import { Metadata } from 'next';
import { getPage, pageHasRenderableContent } from '@/lib/data/pages';
import { DynamicPageRenderer } from '@/components/content/DynamicPageRenderer';
import FallbackPage from './connect_gbc2024_cms_page';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('/connect-gbc2024');
  return {
    title: page?.seoTitle || 'GBC 2024 - Envint',
    description: page?.seoDescription || 'Envint at the Global Business Coalition 2024.',
    alternates: { canonical: 'https://envintglobal.com/connect-gbc2024/' },
    openGraph: {
      title: page?.seoTitle || 'GBC 2024 - Envint',
      description: page?.seoDescription || 'Envint at the Global Business Coalition 2024.',
      url: 'https://envintglobal.com/connect-gbc2024/',
      type: 'website',
    },
  };
}

export default async function Page() {
  const page = await getPage('/connect-gbc2024');
  if (pageHasRenderableContent(page)) {
    return <DynamicPageRenderer page={page} />;
  }
  return <FallbackPage />;
}

