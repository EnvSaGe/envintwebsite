import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MapSense - Ecosystem Screening made Quick | Scalable | Bespoke',
  description: 'An environmental and social screening tool that screens project sites for sensitive receptors with 48-hour turnaround and uniform pan-India spatial coverage.',
  alternates: {
    canonical: 'https://envintglobal.com/mapsense/',
  },
};

const features = [
  {
    icon: '🖥️',
    title: 'Screening of Sensitive Receptors',
    desc: 'Desk-based tool covering 10+ E&S receptor categories',
  },
  {
    icon: '⏱',
    title: '48 Hours Turnaround Time',
    desc: 'For any project size or area, no exceptions',
  },
  {
    icon: '🇮🇳',
    title: 'Pan India Coverage',
    desc: 'Uniform spatial data across all States',
  },
  {
    icon: '🔄',
    title: 'Continuously Updated',
    desc: 'Receptor datasets updated regularly for accuracy',
  },
  {
    icon: '🎯',
    title: 'Customizable Buffer Pricing',
    desc: 'Pay only for the distance buffer you need',
  },
];

const steps = [
  { num: '1', title: 'Submit project location coordinates and required buffer', bg: '#3a7d5a', color: '#ffffff', numBg: 'rgba(255, 255, 255, 0.25)', numColor: '#ffffff' },
  { num: '2', title: 'Receive Confirmation within 24 hours', bg: '#b6dfc4', color: '#2d6045', numBg: '#3a7d5a', numColor: '#ffffff' },
  { num: '3', title: 'Make Payment', bg: '#3a6f8f', color: '#ffffff', numBg: 'rgba(255, 255, 255, 0.25)', numColor: '#ffffff' },
  { num: '4', title: 'Receive E&S screening report in 48 hours upon request', bg: '#c2dff0', color: '#1e4f6e', numBg: '#3a6f8f', numColor: '#ffffff' },
];

const reportImages = [
  { src: '/images/mapsense-report-download.jpg', alt: 'MapSense download report sample' },
  { src: '/images/mapsense-report-line.jpg', alt: 'MapSense line data report sample' },
  { src: '/images/mapsense-report-point.jpg', alt: 'MapSense point data report sample' },
];

const receptorCategories = [
  {
    title: '💧 Waterbodies & Watersheds',
    items: ['Major Rivers and Waterbodies', 'Ground Water Development'],
  },
  {
    title: '🏛️ Cultural & Archaeological Places',
    items: ['World Heritage Sites', 'Excavations', 'State Protected Monuments', 'Museums'],
  },
  {
    title: '🌿 Sensitive Natural Habitats',
    items: [
      'National Park / Wildlife Sanctuary',
      'Notified Eco-Sensitive Zone',
      'Important Bird Areas, Ramsar Sites',
      'Reserve / Protected Forest',
      'Open Forest / Social Forests',
      'Schedule Areas',
      'Major Wildlife Corridors',
    ],
  },
  {
    title: '⚡ Natural Hazards',
    items: ['Earthquakes', 'Floods, Cyclones'],
  },
  {
    title: '🔗 Connectivity & Others',
    items: ['Nearest Highways (NH & SH)', 'Airports', 'Railway Stations', 'Defense & Army Installations'],
  },
];

const sectors = [
  { icon: '⛏️', name: 'Extractives & Natural Resources' },
  { icon: '🏭', name: 'Industrial / Processing Zones' },
  { icon: '🏢', name: 'Real Estate' },
  { icon: '🏗️', name: 'Infrastructure' },
  { icon: '🏨', name: 'Hospitality (Hotels & Resorts)' },
  { icon: '📦', name: 'Logistic Parks & Warehousing' },
  { icon: '♻️', name: 'Renewable Energy' },
  { icon: '🌍', name: 'Projects in sensitive ecosystems' },
];

export default function MapsensePage() {
  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '80vh' }}>
      {/* 1. HERO BANNER (live: background image with spacer) */}
      <section style={{
        position: 'relative',
        minHeight: '52vh',
        width: '100%',
        overflow: 'hidden',
      }}>
        <Image
          src="/images/mapsense-hero.webp"
          alt="River through lush green forest - Envint MapSense"
          fill
          priority
          style={{ objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, transparent 60%)',
        }} />
      </section>

      {/* 2. TITLE & OVERVIEW (live: 40px title after hero) */}
      <section style={{ padding: '30px 0 40px' }}>
        <div className="container hero-stretch" style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h1 style={{
            fontFamily: '"Neue Montreal", sans-serif',
            fontSize: '40px',
            fontWeight: 500,
            color: '#004E35',
            lineHeight: 'normal',
            margin: '0 0 20px 0',
          }}>
            Ecosystem Screening made Quick | Scalable | Bespoke
          </h1>
          <p style={{
            fontFamily: '"Neue Montreal", sans-serif',
            fontSize: '18px',
            color: '#393939',
            lineHeight: 'normal',
            margin: 0,
          }}>
            An environment and social screening tool that screens project sites for sensitive receptors.
          </p>
        </div>
      </section>

      {/* 2. FEATURES */}
      <section style={{ padding: '40px 0 60px' }}>
        <div className="container hero-stretch" style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h2 className="title-section" style={{ fontSize: '30px', fontWeight: 400, color: '#004E35', textAlign: 'center', margin: '0 0 50px 0' }}>
            Features
          </h2>

          <div className="mapsense-features-grid">
            {features.map((f, i) => (
              <div
                key={i}
                style={{
                  padding: '30px 24px',
                  borderRadius: '16px',
                  border: '1px solid #10b981',
                  textAlign: 'center',
                  backgroundColor: '#ffffff',
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{f.icon}</div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-brand-green-dark)', marginBottom: '8px' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--color-text-body)', lineHeight: 1.5, margin: 0 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. EASY 4 STEP PROCESS */}
      <section style={{ padding: '40px 0 60px', backgroundColor: '#ffffff' }}>
        <div className="container hero-stretch" style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h2 className="title-section" style={{ fontSize: '30px', fontWeight: 400, color: '#004E35', textAlign: 'center', margin: '0 0 40px 0' }}>
            Easy 4 step process
          </h2>

          <div className="mapsense-steps-grid">
            {steps.map((s) => (
              <div
                key={s.num}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  borderRadius: 'var(--radius-pill)',
                  padding: '16px 28px',
                  backgroundColor: s.bg,
                  color: s.color,
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  minWidth: '36px',
                  borderRadius: '50%',
                  fontSize: '1rem',
                  fontWeight: 700,
                  backgroundColor: s.numBg,
                  color: s.numColor,
                }}>
                  {s.num}
                </div>
                <span style={{ fontSize: '0.95rem', fontWeight: 600, lineHeight: 1.3 }}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PROXIMITY ANALYSIS REPORT (with 3 live report images) */}
      <section style={{ backgroundColor: '#f8fafc', padding: '70px 0', borderTop: '1px solid #eef2f6', borderBottom: '1px solid #eef2f6' }}>
        <div className="container hero-stretch" style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: '"Neue Montreal", sans-serif', fontSize: '30px', fontWeight: 400, color: '#004E35', margin: '0 0 20px 0' }}>
            Proximity Analysis Report
          </h2>
          <p style={{
            fontFamily: '"Neue Montreal", sans-serif',
            fontSize: '18px',
            color: '#393939',
            lineHeight: 'normal',
            maxWidth: '900px',
            margin: '0 0 40px 0',
          }}>
            The report highlights nearby environmental and social receptors and indicates the buffer zone within which they fall. Each receptor is classified by proximity distance – supporting early-stage risk assessment, regulatory compliance, and lender due diligence.
          </p>
          <div className="mapsense-reports-grid">
            {reportImages.map((img, i) => (
              <div key={i} style={{ position: 'relative', aspectRatio: '400 / 151', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  loading="eager"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 10+ SENSITIVE ENVIRONMENT AND SOCIAL RECEPTORS */}
      <section style={{ backgroundColor: 'var(--color-brand-green-dark)', color: '#ffffff', padding: '60px 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontFamily: '"Neue Montreal", sans-serif', fontSize: '30px', fontWeight: 400, color: '#ffffff', margin: 0 }}>
            10+ Sensitive Environment and Social Receptors
          </h2>
        </div>
      </section>

      <section className="section-padding" style={{ paddingTop: '50px', backgroundColor: '#ffffff' }}>
        <div className="container hero-stretch" style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h3 style={{ fontFamily: '"Neue Montreal", sans-serif', fontSize: '20px', color: '#004E35', margin: '0 0 30px 0' }}>
            Receptors covered
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            marginBottom: '60px',
          }}>
            {receptorCategories.map((rc, idx) => (
              <div
                key={idx}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  backgroundColor: '#ffffff',
                }}
              >
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-brand-green-dark)', marginBottom: '12px' }}>
                  {rc.title}
                </h4>
                <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: 'var(--color-text-body)' }}>
                  {rc.items.map((it, j) => (
                    <li key={j}>{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* WHO IT'S FOR */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '50px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-brand-green)', display: 'block', marginBottom: '8px' }}>
              WHO IT&apos;S FOR
            </span>
            <h2 className="title-section" style={{ fontSize: '30px', fontWeight: 400, color: '#004E35', textAlign: 'center', margin: '0 0 36px 0' }}>
              MapSense For Multiple Sectors
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
            }}>
              {sectors.map((sec, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '24px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #10b981',
                    textAlign: 'center',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <span style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{sec.icon}</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text-main)' }}>{sec.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. SITE SENSITIVITY INSIGHTS CTA */}
      <section style={{ backgroundColor: 'var(--color-brand-green-dark)', color: '#ffffff', padding: '80px 0' }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '30px',
        }}>
          <div style={{ maxWidth: '650px' }}>
            <h2 style={{ fontFamily: '"Neue Montreal", sans-serif', fontSize: '30px', fontWeight: 400, color: '#ffffff', marginBottom: '20px' }}>
              Site Sensitivity Insights for Better Project Decisions
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.6, margin: 0 }}>
              The screening output highlights key ecological and social sensitivities. It supports early understanding of site constraints, regulatory needs and mitigation planning for lower risk project decisions.
            </p>
          </div>
          <div>
            <Link
              href="/connect/"
              style={{
                display: 'inline-block',
                backgroundColor: '#ffffff',
                color: 'var(--color-brand-green-dark)',
                padding: '14px 36px',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 700,
                fontSize: '1rem',
                textDecoration: 'none',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              Book a Demo
            </Link>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .mapsense-features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .mapsense-steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 16px;
        }
        .mapsense-reports-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        @media (max-width: 900px) {
          .mapsense-features-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
        }
        @media (max-width: 768px) {
          .mapsense-reports-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }
        @media (max-width: 600px) {
          .mapsense-features-grid {
            grid-template-columns: 1fr;
          }
        }
      ` }} />
    </div>
  );
}
