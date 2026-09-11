'use client';
/**
 * ServicesPageFallback.tsx
 *
 * Hard-coded fallback for /services rendered when no DB content blocks exist.
 * Once the seed script populates the DB and publishes /services blocks,
 * this component is bypassed by the CMS-first page.tsx.
 */
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const sectorsList = [
  { name: 'Infrastructure & Real Estate', slug: 'infra-real-estate', img: '/images/sector-infra.webp' },
  { name: 'Manufacturing', slug: null, img: '/images/sector-manufacturing.webp' },
  { name: 'Energy', slug: 'energy', img: '/images/sector-energy.webp' },
  { name: 'Agriculture', slug: 'agriculture', img: '/images/sector-agriculture.webp' },
  { name: 'BFSI', slug: 'bfsi', img: '/images/sector-bfsi.webp' },
  { name: 'Mining', slug: 'metals-mining', img: '/images/sector-mining.webp' },
  { name: 'Healthcare', slug: 'healthcare', img: '/images/sector-healthcare.webp' },
  { name: 'Technology', slug: 'technology', img: '/images/sector-tech.webp' },
];

const themesList = [
  { name: 'Supply Chain', slug: 'sustainable-supply-chain', img: '/images/theme-supply-chain.webp' },
  { name: 'DEI', slug: null, img: '/images/theme-dei.webp' },
  { name: 'BHR', slug: 'bhr', img: '/images/theme-bhr.webp' },
  { name: 'Biodiversity', slug: null, img: '/images/theme-biodiversity.webp' },
  { name: 'Circular Economy', slug: 'circular-economy', img: '/images/theme-circular.webp' },
  { name: 'Built Environment', slug: null, img: '/images/theme-built-environment.webp' },
  { name: 'Sustainable Finance', slug: null, img: '/images/theme-finance.webp' },
  { name: 'Carbon Markets', slug: null, img: '/images/theme-carbon-markets.webp' },
];

const toolsList = [
  { name: 'EnvSaGe', tag: 'ESG Data', desc: 'Integrated ESG performance tracking and materiality intelligence platform', href: null, img: '/images/tool-envsage-v2.webp' },
  { name: 'EmCal', tag: 'GHG Assessment', desc: 'Automated GHG emissions calculator and carbon footprinting tool', href: null, img: '/images/tool-emcal-v2.webp' },
  { name: 'ADD', tag: 'Automated DD', desc: 'Automated due diligence screening across E&S risk areas', href: null, img: '/images/tool-add-v2.webp' },
  { name: 'MapSense', tag: 'Ecosystem Scan', desc: 'Spatial environmental & social risk screening tool', href: '/mapsense/', img: '/images/tool-mapsense-v2.webp' },
];

const pillars = [
  { title: 'Sustainability Integration', slug: '/sustainability-integration', desc: 'Embedding ESG into corporate strategy, governance, reporting and supply chains.', img: '/images/service-si.webp' },
  { title: 'Climate Action & Decarbonization', slug: '/climate-action', desc: 'Net-zero pathways, GHG accounting, science-based targets, and climate risk.', img: '/images/service-ca.webp' },
  { title: 'Responsible Investment', slug: '/responsible-investment', desc: 'Pre-investment ESG due diligence, ESAP, and portfolio monitoring for institutional investors.', img: '/images/service-ri.webp' },
];

export default function ServicesPageFallback() {
  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '80vh', fontFamily: '"Neue Montreal", sans-serif' }}>
      {/* Hero */}
      <section style={{ position: 'relative', height: '60vh', minHeight: '400px', background: 'linear-gradient(135deg, #004E35 0%, #1a7a52 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ textAlign: 'center', color: '#fff', padding: '0 24px', maxWidth: '900px' }}>
          <p style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '3px', color: 'rgba(255,255,255,0.7)', marginBottom: '16px', textTransform: 'uppercase' }}>Advisory Capabilities</p>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, lineHeight: 1.15, marginBottom: '20px' }}>Comprehensive ESG &amp; Climate Solutions</h1>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.85)', maxWidth: '620px', margin: '0 auto' }}>Combining strategic insight with rigorous technical analysis to create measurable sustainability impact.</p>
        </div>
      </section>

      {/* Practice Pillars */}
      <section style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 400, color: '#004E35', marginBottom: '12px', textAlign: 'center' }}>Our Practice Areas</h2>
        <p style={{ color: '#555', fontSize: '1.05rem', textAlign: 'center', marginBottom: '48px' }}>Three specialized practices delivering end-to-end sustainability advisory.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
          {pillars.map((p) => (
            <Link key={p.slug} href={p.slug} style={{ textDecoration: 'none', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', transition: 'box-shadow 0.2s', display: 'block' }}>
              <div style={{ position: 'relative', height: '200px', background: '#f0f4ef' }}>
                <Image src={p.img} alt={p.title} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <div style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#004E35', marginBottom: '8px' }}>{p.title}</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>{p.desc}</p>
                <span style={{ display: 'inline-block', marginTop: '16px', fontSize: '0.85rem', fontWeight: 600, color: '#10b981' }}>Learn more →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Sectors */}
      <section style={{ padding: '80px 24px', backgroundColor: '#f8faf8', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 400, color: '#004E35', marginBottom: '12px', textAlign: 'center' }}>Sectors We Serve</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginTop: '40px' }}>
          {sectorsList.map((s) => {
            const inner = (
              <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#fff', textAlign: 'center' }}>
                <div style={{ position: 'relative', height: '120px' }}>
                  <Image src={s.img} alt={s.name} fill style={{ objectFit: 'cover' }} sizes="200px" />
                </div>
                <p style={{ padding: '12px', fontSize: '0.9rem', fontWeight: 500, color: '#1e293b' }}>{s.name}</p>
              </div>
            );
            return s.slug
              ? <Link key={s.name} href={`/sector/${s.slug}`} style={{ textDecoration: 'none' }}>{inner}</Link>
              : <div key={s.name}>{inner}</div>;
          })}
        </div>
      </section>

      {/* Themes */}
      <section style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 400, color: '#004E35', marginBottom: '12px', textAlign: 'center' }}>ESG Themes</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginTop: '40px' }}>
          {themesList.map((t) => {
            const inner = (
              <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#fff', textAlign: 'center' }}>
                <div style={{ position: 'relative', height: '120px' }}>
                  <Image src={t.img} alt={t.name} fill style={{ objectFit: 'cover' }} sizes="200px" />
                </div>
                <p style={{ padding: '12px', fontSize: '0.9rem', fontWeight: 500, color: '#1e293b' }}>{t.name}</p>
              </div>
            );
            return t.slug
              ? <Link key={t.name} href={`/theme/${t.slug}`} style={{ textDecoration: 'none' }}>{inner}</Link>
              : <div key={t.name}>{inner}</div>;
          })}
        </div>
      </section>

      {/* Proprietary Tools */}
      <section style={{ padding: '80px 24px', backgroundColor: '#f8faf8' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 400, color: '#004E35', marginBottom: '12px', textAlign: 'center' }}>Proprietary Tools & Platforms</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px', marginTop: '40px' }}>
            {toolsList.map((tool) => {
              const inner = (
                <div style={{ borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', background: '#fff' }}>
                  <div style={{ position: 'relative', height: '160px' }}>
                    <Image src={tool.img} alt={tool.name} fill style={{ objectFit: 'cover' }} sizes="280px" />
                  </div>
                  <div style={{ padding: '20px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', color: '#10b981', textTransform: 'uppercase' }}>{tool.tag}</span>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b', margin: '8px 0' }}>{tool.name}</h3>
                    <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: '1.5' }}>{tool.desc}</p>
                  </div>
                </div>
              );
              return tool.href
                ? <Link key={tool.name} href={tool.href} style={{ textDecoration: 'none' }}>{inner}</Link>
                : <div key={tool.name}>{inner}</div>;
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', textAlign: 'center', background: 'linear-gradient(135deg, #004E35 0%, #1a7a52 100%)' }}>
        <h2 style={{ color: '#fff', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 400, marginBottom: '16px' }}>Partner With Our Senior Advisory Leaders</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', marginBottom: '32px', maxWidth: '560px', margin: '0 auto 32px' }}>Schedule an initial consultation to review your sustainability roadmap and disclosure goals.</p>
        <Link href="/connect" style={{ display: 'inline-block', padding: '14px 32px', backgroundColor: '#fff', color: '#004E35', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', fontSize: '1rem' }}>Initiate Scoping Discussion</Link>
      </section>
    </div>
  );
}
