'use client';

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
  {
    title: 'Sustainability Integration',
    subtitle: 'A new way of doing business',
    slug: '/sustainability-integration',
    desc: 'Embedding ESG into corporate strategy, governance, reporting and supply chains.',
    img: '/images/services-sustainability.webp',
  },
  {
    title: 'Responsible Investment',
    subtitle: 'Green makes sense beyond conscience',
    slug: '/responsible-investment',
    desc: 'Pre-investment ESG due diligence, ESAP, and portfolio monitoring for institutional investors.',
    img: '/images/services-responsible.webp',
  },
  {
    title: 'Climate Action',
    subtitle: 'Futureproofing with low-carbon transitions',
    slug: '/climate-action',
    desc: 'Net-zero pathways, GHG accounting, science-based targets, and climate risk.',
    img: '/images/services-climate.webp',
  },
];

export default function ServicesPageFallback() {
  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: '"Neue Montreal", sans-serif' }}>
      {/* 1. Hero Section */}
      <section
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          paddingBottom: '80px',
          paddingLeft: '24px',
          paddingRight: '24px',
          overflow: 'hidden',
        }}
      >
        <Image
          src="/images/main-services.webp"
          alt="Helping businesses progress on sustainability goals"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center', zIndex: 0 }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0, 46, 32, 0.85) 0%, rgba(0, 46, 32, 0.25) 60%, transparent 100%)',
            zIndex: 1,
          }}
        />
        <div style={{ maxWidth: '1280px', width: '100%', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <h1
            style={{
              fontFamily: '"Neue Montreal", sans-serif',
              fontSize: 'clamp(38px, 5.5vw, 76px)',
              fontWeight: 400,
              lineHeight: 1.15,
              color: '#ffffff',
              maxWidth: '1000px',
              textShadow: '0 2px 14px rgba(0, 0, 0, 0.4)',
              margin: 0,
            }}
          >
            Helping businesses progress on sustainability goals
          </h1>
        </div>
      </section>

      {/* 2. Value Proposition Section */}
      <section style={{ paddingTop: '60px', paddingBottom: '60px', paddingLeft: '24px', paddingRight: '24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <p style={{ fontSize: 'clamp(18px, 1.8vw, 24px)', lineHeight: '35px', color: '#393939', margin: '0 0 24px 0' }}>
            We partner with businesses in their sustainability journeys and help them in getting things done. Proudly homegrown, we bring a unique mix of value and pragmatism to solving client problems.
          </p>
          <h2 style={{ fontSize: 'clamp(18px, 1.8vw, 24px)', lineHeight: '35px', color: '#393939', fontWeight: 400, margin: 0 }}>
            Our success stems from expertise in global sustainability &amp; ESG frameworks, understanding of region-specific ESG regulations, knowledge of industry-specific issues and pragmatism backed by on-field experience.
          </h2>
        </div>
      </section>

      {/* 3. Capability Model & Services */}
      <section style={{ paddingTop: '20px', paddingBottom: '100px', paddingLeft: '24px', paddingRight: '24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(32px, 3.8vw, 48px)', fontWeight: 400, color: '#004E35', margin: '0 0 16px 0' }}>
            Our Capability Model
          </h2>
          <p style={{ fontSize: 'clamp(18px, 1.8vw, 24px)', lineHeight: '35px', color: '#393939', marginBottom: '48px' }}>
            The challenges and opportunities in sustainability are unique, emerging and complex. They not only require interdisciplinary skills but a highly collaborative approach to finding solutions and implementing them. Our tiered capability model brings together service lines, sector and thematic expertise, and proprietary tools for effective delivery.
          </p>

          {/* Subheading: Services */}
          <h3 style={{ fontSize: 'clamp(32px, 3.8vw, 48px)', fontWeight: 400, color: '#004E35', margin: '0 0 28px 0' }}>
            Services
          </h3>

          {/* 3 Large Service Feature Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '80px' }}>
            {pillars.map((p) => (
              <Link
                key={p.slug}
                href={p.slug}
                style={{
                  textDecoration: 'none',
                  position: 'relative',
                  minHeight: '428px',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '40px',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                }}
              >
                <Image
                  src={p.img}
                  alt={p.title}
                  fill
                  sizes="100vw"
                  style={{ objectFit: 'cover', objectPosition: 'center', zIndex: 0 }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0, 0, 0, 0.82) 0%, rgba(0, 0, 0, 0.2) 60%, transparent 100%)',
                    zIndex: 1,
                  }}
                />
                <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <h4 style={{ fontSize: 'clamp(24px, 2.5vw, 32px)', fontWeight: 500, color: '#ffffff', margin: '0 0 8px 0' }}>
                      {p.title}
                    </h4>
                    <p style={{ fontSize: 'clamp(18px, 1.8vw, 24px)', fontWeight: 400, color: '#ffffff', margin: 0 }}>
                      {p.subtitle}
                    </p>
                  </div>
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(8px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: '#ffffff',
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Subheading: Sectors */}
          <h3 style={{ fontSize: 'clamp(32px, 3.8vw, 48px)', fontWeight: 400, color: '#004E35', margin: '0 0 28px 0' }}>
            Sectors
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px',
              marginBottom: '80px',
            }}
          >
            {sectorsList.map((s) => {
              const cardContent = (
                <div
                  style={{
                    position: 'relative',
                    height: '240px',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '20px',
                    transition: 'transform 0.25s ease',
                  }}
                >
                  <Image
                    src={s.img}
                    alt={s.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    style={{ objectFit: 'cover', zIndex: 0 }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.2) 60%, transparent 100%)',
                      zIndex: 1,
                    }}
                  />
                  <p
                    style={{
                      position: 'relative',
                      zIndex: 2,
                      fontSize: '18px',
                      fontWeight: 500,
                      color: '#ffffff',
                      margin: 0,
                    }}
                  >
                    {s.name}
                  </p>
                </div>
              );

              return s.slug ? (
                <Link key={s.name} href={`/sector/${s.slug}`} style={{ textDecoration: 'none' }}>
                  {cardContent}
                </Link>
              ) : (
                <div key={s.name}>{cardContent}</div>
              );
            })}
          </div>

          {/* Subheading: Themes */}
          <h3 style={{ fontSize: 'clamp(32px, 3.8vw, 48px)', fontWeight: 400, color: '#004E35', margin: '0 0 28px 0' }}>
            Themes
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px',
              marginBottom: '80px',
            }}
          >
            {themesList.map((t) => {
              const cardContent = (
                <div
                  style={{
                    position: 'relative',
                    height: '240px',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '20px',
                    transition: 'transform 0.25s ease',
                  }}
                >
                  <Image
                    src={t.img}
                    alt={t.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    style={{ objectFit: 'cover', zIndex: 0 }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.2) 60%, transparent 100%)',
                      zIndex: 1,
                    }}
                  />
                  <p
                    style={{
                      position: 'relative',
                      zIndex: 2,
                      fontSize: '18px',
                      fontWeight: 500,
                      color: '#ffffff',
                      margin: 0,
                    }}
                  >
                    {t.name}
                  </p>
                </div>
              );

              return t.slug ? (
                <Link key={t.name} href={`/theme/${t.slug}`} style={{ textDecoration: 'none' }}>
                  {cardContent}
                </Link>
              ) : (
                <div key={t.name}>{cardContent}</div>
              );
            })}
          </div>

          {/* Subheading: Prop Tools */}
          <h3 style={{ fontSize: 'clamp(32px, 3.8vw, 48px)', fontWeight: 400, color: '#004E35', margin: '0 0 28px 0' }}>
            Prop Tools
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px',
              marginBottom: '80px',
            }}
          >
            {toolsList.map((tool) => {
              const cardContent = (
                <div
                  style={{
                    borderRadius: '20px',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                    backgroundColor: '#ffffff',
                    transition: 'box-shadow 0.25s ease',
                  }}
                >
                  <div style={{ position: 'relative', height: '180px' }}>
                    <Image
                      src={tool.img}
                      alt={tool.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  </div>
                  <div style={{ padding: '24px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        letterSpacing: '1.5px',
                        color: '#10b981',
                        textTransform: 'uppercase',
                      }}
                    >
                      {tool.tag}
                    </span>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1e293b', margin: '8px 0' }}>
                      {tool.name}
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: '1.5', margin: 0 }}>
                      {tool.desc}
                    </p>
                  </div>
                </div>
              );

              return tool.href ? (
                <Link key={tool.name} href={tool.href} style={{ textDecoration: 'none' }}>
                  {cardContent}
                </Link>
              ) : (
                <div key={tool.name}>{cardContent}</div>
              );
            })}
          </div>

          {/* 4. Engage with us */}
          <div style={{ marginTop: '40px', marginBottom: '80px' }}>
            <h3 style={{ fontSize: 'clamp(32px, 3.8vw, 48px)', fontWeight: 400, color: '#004E35', margin: '0 0 20px 0' }}>
              Engage with us
            </h3>
            <p style={{ fontSize: 'clamp(18px, 1.8vw, 24px)', lineHeight: '35px', color: '#393939', margin: 0 }}>
              Our flexible modes of engagement provide clients with multiple options to meet their requirements. These include short to medium term project-based work, master service agreements / retainers for recurring requirements, offshoring, and &apos;Enabl&apos; - sustainability/ ESG teams dedicated for long-term client support.
            </p>
          </div>

          {/* 5. Call to Action Banner */}
          <div
            style={{
              position: 'relative',
              borderRadius: '20px',
              overflow: 'hidden',
              padding: '80px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image
              src="/images/footer-cta.webp"
              alt="Let us move towards a greener future"
              fill
              sizes="100vw"
              style={{ objectFit: 'cover', objectPosition: 'center', zIndex: 0 }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(0, 46, 32, 0.75)',
                zIndex: 1,
              }}
            />
            <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px' }}>
              <h2
                style={{
                  fontFamily: '"Neue Montreal", sans-serif',
                  fontSize: 'clamp(32px, 4vw, 48px)',
                  fontWeight: 400,
                  color: '#ffffff',
                  margin: '0 0 32px 0',
                }}
              >
                Let us move towards a greener future
              </h2>
              <Link
                href="/connect/"
                style={{
                  display: 'inline-block',
                  backgroundColor: '#ffffff',
                  color: '#282828',
                  padding: '17px 36px',
                  borderRadius: '10px',
                  fontFamily: '"Neue Montreal", sans-serif',
                  fontSize: '18px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
                  transition: 'transform 0.2s ease',
                }}
              >
                Connect With Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
