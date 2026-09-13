import React from 'react';
import { Metadata } from 'next';
import { getPage, pageHasRenderableContent } from '@/lib/data/pages';
import { DynamicPageRenderer } from '@/components/content/DynamicPageRenderer';
import FallbackPage from './careers_at_envint_cms_page';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('/careers-at-envint');
  return {
    title: page?.seoTitle || 'Careers at Envint | Join Our Sustainability Mission',
    description: page?.seoDescription || 'Explore career opportunities at Envint.',
    alternates: { canonical: 'https://envintglobal.com/careers-at-envint/' },
    openGraph: {
      title: page?.seoTitle || 'Careers at Envint | Join Our Sustainability Mission',
      description: page?.seoDescription || 'Explore career opportunities at Envint.',
      url: 'https://envintglobal.com/careers-at-envint/',
      type: 'website',
    },
  };
}

export default async function Page() {
  const page = await getPage('/careers-at-envint');
  if (pageHasRenderableContent(page)) {
    return <DynamicPageRenderer page={page} />;
  }
  return <FallbackPage />;
}

