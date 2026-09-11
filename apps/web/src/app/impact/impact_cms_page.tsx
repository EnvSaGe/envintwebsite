import React from 'react';
import Image from 'next/image';
import { Metadata } from 'next';
import { getImpacts } from '@/lib/data/impacts';
import ImpactFilterGrid from '@/components/impact/ImpactFilterGrid';

export const metadata: Metadata = {
  title: 'Sustainability and ESG Case Studies - Our Impact',
  description: 'Explore Envint’s 26 public case studies across corporate decarbonization, renewable energy, responsible investment diligence, BRSR, and circular economy.',
  alternates: {
    canonical: 'https://envintglobal.com/impact/',
  },
};

export default async function ImpactPage() {
  const impacts = await getImpacts();

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '80vh' }}>
      {/* 1. HERO TOP BANNER (Full-screen on desktop, responsive 58-60vh on mobile/tablet) */}
      <section className="page-hero" style={{
        paddingLeft: '20px',
        paddingRight: '20px',
      }}>
        <Image
          src="/images/impact-hero-1.webp"
          alt="Water ripple drop - Sustainability & ESG Case Studies"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center center', zIndex: 0 }}
        />

        <div className="container hero-stretch" style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '1280px',
          margin: '0 auto',
          width: '100%',
          paddingBottom: 'clamp(32px, 5vh, 64px)',
        }}>
          <h2 style={{
            fontFamily: '"Neue Montreal", sans-serif',
            fontSize: 'clamp(38px, 4.8vw, 76px)',
            fontWeight: 400,
            lineHeight: 1.15,
            color: '#FFFFFF',
            margin: 0,
          }}>
            Sustainability and ESG Case Studies
          </h2>
        </div>
      </section>

      {/* 2. INTRO PARAGRAPH & FILTERABLE CASE STUDIES */}
      <section style={{
        backgroundColor: '#ffffff',
        paddingTop: '60px',
        paddingBottom: '0px',
      }}>
        <div className="container" style={{
          maxWidth: '1280px',
          margin: '0 auto',
          paddingLeft: '10px',
          paddingRight: '10px',
        }}>
          {/* Exact 24px, 35px line-height, #393939 font from live post-2210.css */}
          <h1 style={{
            fontFamily: '"Neue Montreal", sans-serif',
            fontSize: '24px',
            fontWeight: 400,
            color: '#393939',
            lineHeight: '35px',
            margin: '0 0 50px 0',
            paddingRight: '10%',
          }}>
            Envint works with Indian and international corporates, investors, and institutions to integrate sustainability into core business strategy and operations, channel funds into responsible business through ESG principles, and develop low carbon transition plans. Browse featured case studies across sectors and advisory areas below.
          </h1>

          <ImpactFilterGrid impacts={impacts as any} />
        </div>
      </section>
    </div>
  );
}
