import React from 'react';
import Image from 'next/image';
import { Metadata } from 'next';
import { getInsights } from '@/lib/data/insights';
import ArticleCardGrid from '@/components/insights/ArticleCardGrid';

export const metadata: Metadata = {
  title: 'Glossary Zone | Envint',
  description: 'Understand key ESG and sustainability terms, frameworks and concepts with clear, practical explanations from Envint.',
  alternates: {
    canonical: 'https://envintglobal.com/glossary-zone/',
  },
};

const GLOSSARY_SLUGS = [
  'circular-economy-a-world-without-waste',
  'ghg-protocols-made-easy-to-follow',
  'life-cycle-assessment-demystified',
  'esg-reporting',
  'difference-between-net-zero-and-carbon-neutrality',
  'ghg-emissions-explained-a-clear-guide',
];

export default async function GlossaryZonePage() {
  const allArticles = await getInsights();
  const filtered = GLOSSARY_SLUGS
    .map((slug) => allArticles.find((a: any) => a.slug === slug))
    .filter(Boolean);

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '80vh' }}>
      {/* 1. HERO SECTION (Live match: responsive page-hero, 76px title bottom-aligned) */}
      <section className="page-hero">
        <Image
          src="/images/Glossary-zone-header.webp"
          alt="Glossary Zone - Key ESG Concepts, Terms and Definitions"
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
            Glossary Zone
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
