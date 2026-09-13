import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { getInsights } from '@/lib/data/insights';
import { resolvePublicRoute } from '@/lib/routes/resolve-public-route';
import { DynamicPageRenderer } from '@/components/content/DynamicPageRenderer';

export async function generateMetadata(): Promise<Metadata> {
  const route = await resolvePublicRoute('/');
  const page = route?.kind === 'page' ? route.page : null;
  return {
    title: page?.seoTitle || 'Sustainability & ESG Solutions Firm | Envint',
    description: page?.seoDescription || 'Envint is a sustainability and ESG solutions firm. We help clients integrate sustainability, channelize responsible investment and enable climate action.',
    alternates: {
      canonical: 'https://envintglobal.com/',
    },
  };
}

export default async function HomePage() {
  const [route, insights] = await Promise.all([
    resolvePublicRoute('/'),
    getInsights(),
  ]);

  if (route?.kind === 'page') {
    return <DynamicPageRenderer page={route.page} />;
  }

  return (
    <div className="home-root" style={{ backgroundColor: '#ffffff' }}>
      {/* 1. HERO SECTION (Full Screen on desktop, responsive 58-60vh on mobile/tablet) */}
      <section className="page-hero">
        <Image
          src="/images/hero-wetland.webp"
          alt="Business for Better - Envint Sustainability and ESG Solutions"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center', zIndex: 0 }}
        />

        <div className="container hero-stretch" style={{ position: 'relative', zIndex: 2 }}>
          <div>
            <p className="home-hero-title" style={{
              fontFamily: '"Neue Montreal", sans-serif',
              fontSize: 'clamp(32px, 5.5vw, 96px)',
              fontWeight: 400,
              lineHeight: 1.08,
              color: '#ffffff',
              margin: 0,
              textShadow: '0 2px 14px rgba(0, 0, 0, 0.4)',
            }}>
              Business for Better.<br />Making it happen
            </p>
            <h1 className="home-hero-sub" style={{
              fontFamily: '"Neue Montreal", sans-serif',
              fontSize: 'clamp(16px, 2.2vw, 32px)',
              lineHeight: 1.25,
              color: '#ffffff',
              fontWeight: 400,
              margin: '20px 0 0 0',
              textShadow: '0 1px 8px rgba(0, 0, 0, 0.4)',
            }}>
              We help clients integrate sustainability, channelize <br className="desktop-br" />
              responsible investment and enable climate action.
            </h1>
          </div>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          .home-root { --home-h2: 48px; --home-body: 24px; }
          .home-hero-title { font-size: 96px; }
          .home-hero-sub { font-size: 32px; }
          .home-vantage-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 86px;
            align-items: center;
          }
          .home-services-heading {
            font-size: 60px;
          }
          .home-pillars-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 341px));
            justify-content: space-between;
            gap: 24px;
          }
          .home-philosophy-text {
            font-size: 24px;
            line-height: 35px;
          }
          .home-philosophy-text p {
            margin: 0 0 35px 0;
          }
          @media (max-width: 1024px) {
            .home-hero-title { font-size: 64px; }
            .home-hero-sub { font-size: 24px; }
            .home-vantage-grid { gap: 40px; }
            .home-services-heading { font-size: 44px; }
          }
          @media (max-width: 900px) {
            .home-pillars-grid {
              grid-template-columns: 1fr;
              gap: 40px;
              justify-content: center;
            }
          }
          @media (max-width: 767px) {
            .home-root { --home-h2: 28px; --home-body: 18px; }
            .home-hero-title { font-size: 32px !important; line-height: 1.1 !important; }
            .home-hero-sub { font-size: 16px !important; line-height: 1.35 !important; margin-top: 14px !important; }
            .home-hero-sub .desktop-br { display: none; }
            .home-philosophy-text {
              font-size: 17px !important;
              line-height: 25px !important;
              padding-right: 0 !important;
            }
            .home-philosophy-text p {
              margin: 0 0 20px 0 !important;
            }
            .home-philosophy-text a {
              font-size: 18px !important;
            }
            .home-services-heading { font-size: 32px; }
            .servicebox-card { padding: 32px 24px 28px !important; }
            .servicebox-card h3 { font-size: 24px !important; }
            .servicebox-card p { font-size: 18px !important; line-height: 24px !important; }
          }
        ` }} />
      </section>

      {/* 2. PHILOSOPHY STATEMENT */}
      <section style={{
        paddingTop: 'clamp(36px, 5vw, 80px)',
        paddingBottom: 'clamp(36px, 5vw, 60px)',
        backgroundColor: '#ffffff',
      }}>
        <div className="container hero-stretch">
          <div className="home-philosophy-text" style={{
            fontFamily: '"Neue Montreal", sans-serif',
            fontWeight: 400,
            color: '#393939',
            paddingRight: '5%',
          }}>
            <p>
              From the air we breathe and the water we drink to the future we want, the desire for better touches us all.
            </p>
            <p>
              Better is inspiring and limitless, constrained only by the laws of nature.
            </p>
            <p>
              Being sustainable is no longer optional &ndash; the future belongs to businesses that go for better.
            </p>
            <div style={{ paddingTop: '10px' }}>
              <Link
                href="/services/"
                style={{
                  display: 'inline-block',
                  fontFamily: '"Neue Montreal", sans-serif',
                  fontSize: '24px',
                  fontWeight: 400,
                  color: '#BCBCBC',
                  textDecoration: 'none',
                  borderBottom: '1.152px solid #8C8C8C',
                  paddingBottom: '10px',
                  transition: 'color 0.2s ease, transform 0.2s ease',
                }}
              >
                Explore more
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PUBLICATION SPOTLIGHT (VANTAGE 2026 - Exact Live Match: #F7F7F7, 48px title, 24px body) */}
      <section style={{ padding: '70px 0', backgroundColor: '#F7F7F7' }}>
        <div className="container hero-stretch">
          <div className="home-vantage-grid">
            {/* Left Cover Image */}
            <div style={{
              width: '100%',
              maxWidth: '635px',
              borderRadius: '20px',
              overflow: 'hidden',
            }}>
              <Image
                src="/images/vantage-2026.webp"
                alt="Vantage 2026: Navigating the ESG Reset - Envint Publication"
                width={635}
                height={389}
                sizes="(max-width: 1280px) 100vw, 635px"
                style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '20px' }}
              />
            </div>

            {/* Right Content */}
            <div>
              <h2 style={{
                fontFamily: '"Neue Montreal", sans-serif',
                fontSize: 'var(--home-h2)',
                fontWeight: 400,
                color: '#004E35',
                lineHeight: 'normal',
                margin: '0 0 20px 0',
              }}>
                Vantage 2026: Navigating the ESG Reset
              </h2>
              <p style={{
                fontFamily: '"Neue Montreal", sans-serif',
                fontSize: 'var(--home-body)',
                fontWeight: 400,
                lineHeight: '35px',
                color: '#393939',
                margin: '0 0 35px 0',
              }}>
                Trade tensions, geopolitical conflicts, and supply chain disruptions continue to reshape business priorities, while sustainability in India continues to gain traction. Our publication explores the evolving ESG agenda, macroeconomic challenges for businesses and how organizations in India can respond in this context. Drawing on policy and regulatory developments, market insights, and client experience, Vantage helps businesses navigate a changing ESG landscape and focus on what matters most.
              </p>
              
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '24px',
              }}>
                <Link
                  href="/envision/"
                  style={{
                    display: 'inline-block',
                    fontFamily: '"Neue Montreal", sans-serif',
                    fontSize: 'var(--home-body)',
                    fontWeight: 400,
                    color: 'var(--color-brand-blue)',
                    textDecoration: 'none',
                    borderBottom: '1.152px solid #8C8C8C',
                    paddingBottom: '10px',
                  }}
                >
                  Read now
                </Link>

                <Link
                  href="/media/uploads/Envint-Vantage-ESG-Reset.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    fontFamily: '"Neue Montreal", sans-serif',
                    fontSize: 'var(--home-body)',
                    fontWeight: 400,
                    color: 'var(--color-brand-blue)',
                    textDecoration: 'none',
                    borderBottom: '1.152px solid #8C8C8C',
                    paddingBottom: '10px',
                  }}
                >
                  Click here to read Vantage 2025
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SERVICES SECTION ("WE HELP YOU WITH ...") */}
      <section style={{
        position: 'relative',
        padding: '120px 0',
        color: '#ffffff',
        overflow: 'hidden',
      }}>
        {/* Authentic Himalayan mountain & river background from live site (Polo-bg.jpg) */}
        <Image
          src="/images/polo-mountain-bg.webp"
          alt="Himalayan mountain pass and river - Envint Services"
          fill
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center', zIndex: 0 }}
        />
        {/* Subtle gradient to keep white text pristine */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.15) 50%, rgba(0, 0, 0, 0.25) 100%)',
          zIndex: 1,
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="services-grid-2x2">
            {/* Top-Left: Heading */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              minHeight: '210px',
              padding: '10px',
            }}>
              <div>
                <h2 className="home-services-heading" style={{
                  fontFamily: '"Neue Montreal", sans-serif',
                  color: '#ffffff',
                  lineHeight: 1.12,
                  fontWeight: 400,
                  textShadow: '0 2px 14px rgba(0, 0, 0, 0.45)',
                  margin: 0,
                }}>
                  We help you with ...
                </h2>
              </div>
            </div>

            {/* Top-Right: Sustainability Integration Card */}
            <Link href="/sustainability-integration/" className="servicebox-card">
              <div style={{ position: 'relative', zIndex: 2 }}>
                <h3 style={{
                  fontFamily: '"Neue Montreal", sans-serif',
                  fontSize: '28px',
                  color: '#C65102',
                  fontWeight: 500,
                  marginBottom: '12px',
                  lineHeight: 1.2,
                }}>
                  Sustainability Integration
                </h3>
                <p style={{
                  fontFamily: '"Neue Montreal", sans-serif',
                  color: '#484848',
                  fontSize: '24px',
                  lineHeight: '30px',
                  fontWeight: 400,
                  margin: 0,
                  maxWidth: '440px',
                }}>
                  Integrate sustainability in your core strategy &amp; operations
                </p>
              </div>
              <div style={{
                position: 'absolute',
                right: '18px',
                bottom: '-14px',
                width: '140px',
                height: '140px',
                opacity: 0.35,
                pointerEvents: 'none',
              }}>
                <Image src="/images/gray-logo.webp" alt="" fill sizes="140px" style={{ objectFit: 'contain' }} />
              </div>
            </Link>

            {/* Bottom-Left: Responsible Investment Card */}
            <Link href="/responsible-investment/" className="servicebox-card">
              <div style={{ position: 'relative', zIndex: 2 }}>
                <h3 style={{
                  fontFamily: '"Neue Montreal", sans-serif',
                  fontSize: '28px',
                  color: '#C65102',
                  fontWeight: 500,
                  marginBottom: '12px',
                  lineHeight: 1.2,
                }}>
                  Responsible Investment
                </h3>
                <p style={{
                  fontFamily: '"Neue Montreal", sans-serif',
                  color: '#484848',
                  fontSize: '24px',
                  lineHeight: '30px',
                  fontWeight: 400,
                  margin: 0,
                  maxWidth: '440px',
                }}>
                  Build ESG principles to channelize funds into responsible businesses
                </p>
              </div>
              <div style={{
                position: 'absolute',
                right: '18px',
                bottom: '-14px',
                width: '140px',
                height: '140px',
                opacity: 0.35,
                pointerEvents: 'none',
              }}>
                <Image src="/images/gray-logo.webp" alt="" fill sizes="140px" style={{ objectFit: 'contain' }} />
              </div>
            </Link>

            {/* Bottom-Right: Climate Action Card */}
            <Link href="/climate-action/" className="servicebox-card">
              <div style={{ position: 'relative', zIndex: 2 }}>
                <h3 style={{
                  fontFamily: '"Neue Montreal", sans-serif',
                  fontSize: '28px',
                  color: '#C65102',
                  fontWeight: 500,
                  marginBottom: '12px',
                  lineHeight: 1.2,
                }}>
                  Climate Action
                </h3>
                <p style={{
                  fontFamily: '"Neue Montreal", sans-serif',
                  color: '#484848',
                  fontSize: '24px',
                  lineHeight: '30px',
                  fontWeight: 400,
                  margin: 0,
                  maxWidth: '440px',
                }}>
                  Futureproof your organization with low-carbon transition plans
                </p>
              </div>
              <div style={{
                position: 'absolute',
                right: '18px',
                bottom: '-14px',
                width: '140px',
                height: '140px',
                opacity: 0.35,
                pointerEvents: 'none',
              }}>
                <Image src="/images/gray-logo.webp" alt="" fill sizes="140px" style={{ objectFit: 'contain' }} />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. #THEENVINTWAY SECTION (Exact Live Match: 48px title, 24px mission, 32px pillar titles, 18px body) */}
      <section style={{ paddingTop: '70px', paddingBottom: '70px', backgroundColor: '#ffffff' }}>
        <div className="container hero-stretch">
          <div style={{ textAlign: 'left', maxWidth: '100%', marginBottom: '50px' }}>
            <h2 style={{
              fontFamily: '"Neue Montreal", sans-serif',
              fontSize: 'var(--home-h2)',
              color: '#004E35',
              fontWeight: 400,
              lineHeight: 'normal',
              margin: '0 0 16px 0',
            }}>
              #TheEnvintWay
            </h2>
            <h2 style={{
              fontFamily: '"Neue Montreal", sans-serif',
              fontSize: 'var(--home-body)',
              color: '#393939',
              lineHeight: '35px',
              fontWeight: 400,
              margin: 0,
            }}>
              Our mission is to drive sustainability into mainstream thought and action, with the belief that <em>&lsquo;green makes sense beyond conscience&rsquo;</em>.
            </h2>
          </div>

          {/* 3 Pillars Grid with Authentic Live Site Photos */}
          <div className="home-pillars-grid">
            {/* Pillar 1: Focused */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}>
              <div style={{
                width: '100%',
                maxWidth: '310px',
                aspectRatio: '1/1',
                position: 'relative',
                marginBottom: '20px',
                borderRadius: '20px',
                overflow: 'hidden',
              }}>
                <Image
                  src="/images/envintway-focused.webp"
                  alt="Focused - Magnifying glass on forest trees"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: 'cover', borderRadius: '20px' }}
                />
              </div>
              <h3 style={{
                fontFamily: '"Neue Montreal", sans-serif',
                fontSize: '24px',
                color: '#5A5A5A',
                fontWeight: 400,
                lineHeight: 'normal',
                margin: 0,
              }}>
                Focused
              </h3>
              <div style={{
                width: '100%',
                maxWidth: '310px',
                height: '1px',
                backgroundColor: '#D5D5D5',
                margin: '14px auto 20px auto',
              }} />
              <p style={{
                fontFamily: '"Neue Montreal", sans-serif',
                color: '#5A5A5A',
                fontSize: '18px',
                lineHeight: '26px',
                fontWeight: 400,
                margin: 0,
                maxWidth: '341px',
              }}>
                We are sharply focused on sustainability &amp; ESG giving us the edge to understand the complexities associated with this domain.
              </p>
            </div>

            {/* Pillar 2: Balanced */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}>
              <div style={{
                width: '100%',
                maxWidth: '310px',
                aspectRatio: '1/1',
                position: 'relative',
                marginBottom: '20px',
                borderRadius: '20px',
                overflow: 'hidden',
              }}>
                <Image
                  src="/images/envintway-balanced.webp"
                  alt="Balanced - Stacked balancing pebbles in nature"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: 'cover', borderRadius: '20px' }}
                />
              </div>
              <h3 style={{
                fontFamily: '"Neue Montreal", sans-serif',
                fontSize: '24px',
                color: '#5A5A5A',
                fontWeight: 400,
                lineHeight: 'normal',
                margin: 0,
              }}>
                Balanced
              </h3>
              <div style={{
                width: '100%',
                maxWidth: '310px',
                height: '1px',
                backgroundColor: '#D5D5D5',
                margin: '14px auto 20px auto',
              }} />
              <p style={{
                fontFamily: '"Neue Montreal", sans-serif',
                color: '#5A5A5A',
                fontSize: '18px',
                lineHeight: '26px',
                fontWeight: 400,
                margin: 0,
                maxWidth: '341px',
              }}>
                Our approach is calibrated to be balanced and pragmatic, built on understanding of policy, regulation, markets and ground realities.
              </p>
            </div>

            {/* Pillar 3: Committed */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}>
              <div style={{
                width: '100%',
                maxWidth: '310px',
                aspectRatio: '1/1',
                position: 'relative',
                marginBottom: '20px',
                borderRadius: '20px',
                overflow: 'hidden',
              }}>
                <Image
                  src="/images/envintway-committed.webp"
                  alt="Committed - Handshake in partnership"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: 'cover', borderRadius: '20px' }}
                />
              </div>
              <h3 style={{
                fontFamily: '"Neue Montreal", sans-serif',
                fontSize: '24px',
                color: '#5A5A5A',
                fontWeight: 400,
                lineHeight: 'normal',
                margin: 0,
              }}>
                Committed
              </h3>
              <div style={{
                width: '100%',
                maxWidth: '310px',
                height: '1px',
                backgroundColor: '#D5D5D5',
                margin: '14px auto 20px auto',
              }} />
              <p style={{
                fontFamily: '"Neue Montreal", sans-serif',
                color: '#5A5A5A',
                fontSize: '18px',
                lineHeight: '26px',
                fontWeight: 400,
                margin: 0,
                maxWidth: '341px',
              }}>
                As a young firm, we go one step further, and believe in co-owning the execution of strategy with our clients. Ownership is not a buzzword for us - our skin is in the game.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. OUR IMPACT SECTION & STATS BAR (Exact Live Match: 48px title, 24px desc, 64px stat numbers) */}
      <section style={{ paddingTop: '70px', paddingBottom: '70px', backgroundColor: '#ffffff', borderTop: '1px solid #f1f5f9' }}>
        <div className="container hero-stretch">
          <div style={{ maxWidth: '100%', marginBottom: '50px' }}>
            <h2 style={{
              fontFamily: '"Neue Montreal", sans-serif',
              fontSize: 'var(--home-h2)',
              color: '#004E35',
              fontWeight: 400,
              lineHeight: 'normal',
              margin: '0 0 16px 0',
            }}>
              Our Impact
            </h2>
            <p style={{
              fontFamily: '"Neue Montreal", sans-serif',
              fontSize: 'var(--home-body)',
              color: '#393939',
              lineHeight: '35px',
              fontWeight: 400,
              margin: 0,
            }}>
              From India&rsquo;s leading companies to global MNCs, from DFIs to PE and VC funds, we work with a diverse clientele across multiple geographies.
            </p>
          </div>

          {/* 4 Stats Columns with Authentic Left Borders & Icons */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px',
            marginBottom: '70px',
          }}>
            <div style={{
              borderLeft: '1px solid #D9D9D9',
              paddingLeft: '18px',
            }}>
              <div style={{ width: '40px', height: '40px', position: 'relative', marginBottom: '10px' }}>
                <Image src="/images/stat-engagements.webp" alt="" fill sizes="40px" style={{ objectFit: 'contain' }} />
              </div>
              <h3 style={{
                fontFamily: '"Neue Montreal", sans-serif',
                fontSize: 'clamp(40px, 4.5vw, 64px)',
                fontWeight: 400,
                color: '#06573D',
                lineHeight: 1,
                margin: 0,
              }}>
                525+
              </h3>
              <div style={{
                fontFamily: '"Neue Montreal", sans-serif',
                fontSize: 'var(--home-body)',
                color: '#484848',
                marginTop: '8px',
                fontWeight: 400,
              }}>
                Engagements
              </div>
            </div>

            <div style={{
              borderLeft: '1px solid #D9D9D9',
              paddingLeft: '18px',
            }}>
              <div style={{ width: '40px', height: '40px', position: 'relative', marginBottom: '10px' }}>
                <Image src="/images/stat-clients-clean.webp" alt="" fill sizes="40px" style={{ objectFit: 'contain' }} />
              </div>
              <h3 style={{
                fontFamily: '"Neue Montreal", sans-serif',
                fontSize: 'clamp(40px, 4.5vw, 64px)',
                fontWeight: 400,
                color: '#06573D',
                lineHeight: 1,
                margin: 0,
              }}>
                150+
              </h3>
              <div style={{
                fontFamily: '"Neue Montreal", sans-serif',
                fontSize: 'var(--home-body)',
                color: '#484848',
                marginTop: '8px',
                fontWeight: 400,
              }}>
                Clients
              </div>
            </div>

            <div style={{
              borderLeft: '1px solid #D9D9D9',
              paddingLeft: '18px',
            }}>
              <div style={{ width: '40px', height: '40px', position: 'relative', marginBottom: '10px' }}>
                <Image src="/images/stat-countries-clean.webp" alt="" fill sizes="40px" style={{ objectFit: 'contain' }} />
              </div>
              <h3 style={{
                fontFamily: '"Neue Montreal", sans-serif',
                fontSize: 'clamp(40px, 4.5vw, 64px)',
                fontWeight: 400,
                color: '#06573D',
                lineHeight: 1,
                margin: 0,
              }}>
                10+
              </h3>
              <div style={{
                fontFamily: '"Neue Montreal", sans-serif',
                fontSize: 'var(--home-body)',
                color: '#484848',
                marginTop: '8px',
                fontWeight: 400,
              }}>
                Countries
              </div>
            </div>

            <div style={{
              borderLeft: '1px solid #D9D9D9',
              paddingLeft: '18px',
            }}>
              <div style={{ width: '40px', height: '40px', position: 'relative', marginBottom: '10px' }}>
                <Image src="/images/stat-offices.webp" alt="" fill sizes="40px" style={{ objectFit: 'contain' }} />
              </div>
              <h3 style={{
                fontFamily: '"Neue Montreal", sans-serif',
                fontSize: 'clamp(40px, 4.5vw, 64px)',
                fontWeight: 400,
                color: '#06573D',
                lineHeight: 1,
                margin: 0,
              }}>
                6
              </h3>
              <div style={{
                fontFamily: '"Neue Montreal", sans-serif',
                fontSize: 'var(--home-body)',
                color: '#484848',
                marginTop: '8px',
                fontWeight: 400,
              }}>
                Offices
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 7. READ NEWS AND INSIGHTS (Exact Live Match: 48px title, 24px View all, 24px card titles) */}
      <section style={{ paddingTop: '70px', paddingBottom: '70px', backgroundColor: '#f8fafc', borderTop: '1px solid #eef2f6' }}>
        <div className="container hero-stretch">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{
                fontFamily: '"Neue Montreal", sans-serif',
                fontSize: 'var(--home-h2)',
                color: '#004E35',
                fontWeight: 400,
                lineHeight: 'normal',
                margin: 0,
              }}>
                Read news and insights
              </h2>
            </div>
            <Link
              href="/envision/"
              style={{
                fontFamily: '"Neue Montreal", sans-serif',
                fontSize: '24px',
                fontWeight: 400,
                color: '#1E1E1E',
                textDecoration: 'none',
                borderBottom: '1.152px solid #8C8C8C',
                paddingBottom: '5px',
              }}
            >
              View all
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '30px',
          }}>
            {/* Card 1: India's New Labour Codes */}
            <Link
              href="/indias-new-labour-codes/"
              className="card-floating"
              style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                borderRadius: '20px',
                border: '1px solid #eef2f6',
                backgroundColor: '#ffffff',
                textDecoration: 'none',
              }}
            >
              <div style={{ aspectRatio: '417/298', position: 'relative', backgroundColor: '#e2e8f0' }}>
                <Image
                  src="/images/news-labour-codes.webp"
                  alt="India's New Labour Codes"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{
                    fontFamily: '"Neue Montreal", sans-serif',
                    fontSize: '24px',
                    fontWeight: 400,
                    marginBottom: '10px',
                    color: '#1E1E1E',
                    lineHeight: 1.35,
                  }}>
                    India&rsquo;s New Labour Codes
                  </h3>
                  <p style={{
                    fontFamily: '"Neue Montreal", sans-serif',
                    fontSize: '16px',
                    fontWeight: 400,
                    color: '#555555',
                    lineHeight: 1.55,
                    margin: 0,
                  }}>
                    India has implemented four Labour Codes from 21 November 2025. India&rsquo;s Labour Codes include crucial reforms on wages, social security, and working conditions.
                  </p>
                </div>
                <span style={{
                  marginTop: '20px',
                  fontFamily: '"Neue Montreal", sans-serif',
                  fontSize: '16px',
                  color: 'var(--color-brand-blue)',
                  fontWeight: 500,
                }}>
                  Read More &rarr;
                </span>
              </div>
            </Link>

            {/* Card 2: Climate Risk Assessment */}
            <Link
              href="/climate-risk-assessment-a-strategic-guide-for-businesses/"
              className="card-floating"
              style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                borderRadius: '20px',
                border: '1px solid #eef2f6',
                backgroundColor: '#ffffff',
                textDecoration: 'none',
              }}
            >
              <div style={{ aspectRatio: '417/298', position: 'relative', backgroundColor: '#e2e8f0' }}>
                <Image
                  src="/images/news-climate-risk.webp"
                  alt="Climate Risk Assessment: A Strategic Guide for Businesses"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{
                    fontFamily: '"Neue Montreal", sans-serif',
                    fontSize: '24px',
                    fontWeight: 400,
                    marginBottom: '10px',
                    color: '#1E1E1E',
                    lineHeight: 1.35,
                  }}>
                    Climate Risk Assessment: A Strategic Guide for Businesses
                  </h3>
                  <p style={{
                    fontFamily: '"Neue Montreal", sans-serif',
                    fontSize: '16px',
                    fontWeight: 400,
                    color: '#555555',
                    lineHeight: 1.55,
                    margin: 0,
                  }}>
                    India&rsquo;s Third National Communication, submitted to the United Nations Framework Convention on Climate Change, details physical and transition risks.
                  </p>
                </div>
                <span style={{
                  marginTop: '20px',
                  fontFamily: '"Neue Montreal", sans-serif',
                  fontSize: '16px',
                  color: 'var(--color-brand-blue)',
                  fontWeight: 500,
                }}>
                  Read More &rarr;
                </span>
              </div>
            </Link>

            {/* Card 3: EcoVadis: Advancing ESG Across the Supply Chain */}
            <Link
              href="/ecovadis-advancing-esg-across-the-supply-chain/"
              className="card-floating"
              style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                borderRadius: '20px',
                border: '1px solid #eef2f6',
                backgroundColor: '#ffffff',
                textDecoration: 'none',
              }}
            >
              <div style={{ aspectRatio: '417/298', position: 'relative', backgroundColor: '#e2e8f0' }}>
                <Image
                  src="/images/news-ecovadis.webp"
                  alt="EcoVadis: Advancing ESG Across the Supply Chain"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{
                    fontFamily: '"Neue Montreal", sans-serif',
                    fontSize: '24px',
                    fontWeight: 400,
                    marginBottom: '10px',
                    color: '#1E1E1E',
                    lineHeight: 1.35,
                  }}>
                    EcoVadis: Advancing ESG Across the Supply Chain
                  </h3>
                  <p style={{
                    fontFamily: '"Neue Montreal", sans-serif',
                    fontSize: '16px',
                    fontWeight: 400,
                    color: '#555555',
                    lineHeight: 1.55,
                    margin: 0,
                  }}>
                    EcoVadis is a globally trusted provider of business sustainability ratings. The framework assesses suppliers across environment, labor, and ethics.
                  </p>
                </div>
                <span style={{
                  marginTop: '20px',
                  fontFamily: '"Neue Montreal", sans-serif',
                  fontSize: '16px',
                  color: 'var(--color-brand-blue)',
                  fontWeight: 500,
                }}>
                  Read More &rarr;
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 8. PRE-FOOTER CALL TO ACTION (Exact Live Match: 48px title, pill button) */}
      <section style={{ paddingTop: '50px', paddingBottom: '70px', backgroundColor: '#ffffff' }}>
        <div className="container hero-stretch">
          <div style={{
            position: 'relative',
            borderRadius: '20px',
            overflow: 'hidden',
            minHeight: '360px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '60px 30px',
          }}>
            {/* Authentic Mountain Banner Background */}
            <Image
              src="/images/footer-cta.webp"
              alt="Lush green mountain ridges"
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              style={{ objectFit: 'cover', zIndex: 0 }}
            />
            {/* Subtle overlay for legibility */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.25)',
              zIndex: 1,
            }} />

            <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px' }}>
              <h2 style={{
                fontFamily: '"Neue Montreal", sans-serif',
                fontSize: 'var(--home-h2)',
                color: '#ffffff',
                fontWeight: 400,
                lineHeight: 1.25,
                marginBottom: '32px',
                textShadow: '0 2px 12px rgba(0,0,0,0.4)',
              }}>
                Let us move towards a greener future
              </h2>
              <Link
                href="/connect/"
                style={{
                  display: 'inline-block',
                  fontFamily: '"Neue Montreal", sans-serif',
                  backgroundColor: '#ffffff',
                  color: '#004E35',
                  padding: '12px 36px',
                  borderRadius: '9999px',
                  fontWeight: 500,
                  fontSize: '20px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                  transition: 'all 0.2s ease',
                }}
              >
                Connect
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
