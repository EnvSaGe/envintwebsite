import React from 'react';
import Image from 'next/image';
import { Metadata } from 'next';
import { getInsights } from '@/lib/data/insights';
import ArticleCardGrid from '@/components/insights/ArticleCardGrid';

export const metadata: Metadata = {
  title: 'How to Articles | Envint',
  description: 'Learn how to apply ESG and sustainability practices with practical guides covering carbon accounting, climate targets, reporting and more.',
  alternates: {
    canonical: 'https://envintglobal.com/how-to-articles/',
  },
};

const HOW_TO_SLUGS = [
  'how-to-set-science-based-targets',
  'how-to-calculate-your-products-carbon-footprint',
  'carbon-accounting-a-practical-guide',
];

export default async function HowToArticlesPage() {
  const allArticles = await getInsights();
  const filtered = HOW_TO_SLUGS
    .map((slug) => allArticles.find((a: any) => a.slug === slug))
    .filter(Boolean);

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '80vh' }}>
      {/* 1. HERO SECTION (Live match: responsive page-hero, 76px title bottom-aligned) */}
      <section className="page-hero">
        <Image
          src="/images/How-to-header.webp"
          alt="How to Articles - Step-by-Step Sustainability Implementation Guides"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center', zIndex: 0 }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(41, 37, 37, 0.5)',
          zIndex: 1,
        }} />

        <div className="container hero-stretch" style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{
            fontFamily: '"Neue Montreal", sans-serif',
            fontSize: 'clamp(38px, 4.8vw, 76px)',
            fontWeight: 400,
            color: '#ffffff',
            lineHeight: 1.15,
            margin: 0,
          }}>
            How to Articles
          </h1>
        </div>
      </section>

      {/* 2. ARTICLES GRID */}
      <section className="section-padding" style={{ paddingTop: '80px' }}>
        <div className="container hero-stretch">
          <ArticleCardGrid articles={filtered as any} />
        </div>
      </section>
    </div>
  );
}
