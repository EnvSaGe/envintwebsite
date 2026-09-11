import React from 'react';
import Image from 'next/image';
import { Metadata } from 'next';
import { getInsights } from '@/lib/data/insights';
import ArticleCardGrid from '@/components/insights/ArticleCardGrid';

export const metadata: Metadata = {
  title: 'Behind the Buzz | Envint',
  description: 'Explore the ESG trends, sustainability developments and emerging issues shaping how businesses respond to a changing regulatory and climate landscape.',
  alternates: {
    canonical: 'https://envintglobal.com/behind-the-buzz/',
  },
};

const BUZZ_SLUGS = [
  'the-eu-taxonomy-demystified',
  'extended-producer-responsibility-epr',
  'eu-cbam-compliance-guide',
];

export default async function BehindTheBuzzPage() {
  const allArticles = await getInsights();
  const filtered = BUZZ_SLUGS
    .map((slug) => allArticles.find((a: any) => a.slug === slug))
    .filter(Boolean);

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '80vh' }}>
      {/* 1. HERO SECTION (Live match: responsive page-hero, 76px title bottom-aligned) */}
      <section className="page-hero">
        <Image
          src="/images/Behind-the-buzz-header.webp"
          alt="Behind the Buzz - Demystifying ESG Buzzwords and Frameworks"
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
            Behind the Buzz
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
