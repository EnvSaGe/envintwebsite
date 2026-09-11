import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { getInsights } from '@/lib/data/insights';
import { PopularArticlesCarousel } from '@/components/enviki/PopularArticlesCarousel';

export const metadata: Metadata = {
  title: 'Enviki | ESG & Sustainability Resources | Envint',
  description: 'Explore Enviki for insights, explainers and practical guides on ESG, sustainability, climate and responsible investment.',
  alternates: {
    canonical: 'https://envintglobal.com/enviki/',
  },
};

const popularSlugs = [
  'the-eu-taxonomy-demystified',
  'extended-producer-responsibility-epr',
  'how-to-set-science-based-targets',
  'how-to-calculate-your-products-carbon-footprint',
  'circular-economy-a-world-without-waste',
  'ghg-protocols-made-easy-to-follow',
  'life-cycle-assessment-demystified',
  'esg-reporting',
  'difference-between-net-zero-and-carbon-neutrality',
  'carbon-accounting-a-practical-guide',
  'ghg-emissions-explained-a-clear-guide',
  'eu-cbam-compliance-guide',
];

export default async function EnvikiPage() {
  const allArticles = await getInsights();
  const popularArticles = popularSlugs
    .map((slug) => allArticles.find((a: any) => a.slug === slug))
    .filter(Boolean);

  const displayArticles = popularArticles.length > 0 ? popularArticles : allArticles.slice(0, 12);
  const gridArticles = displayArticles.slice(0, 12);

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '80vh' }}>
      {/* 1. HERO SECTION (Exact Live Match: 100vh image hero, 80px white title, search pill) */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        overflow: 'hidden',
        padding: '60px 20px',
      }}>
        <Image
          src="/images/enviki-head.webp"
          alt="Rolling green fields under blue sky - Enviki Knowledge Platform"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center', zIndex: 0 }}
        />

        <div style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          maxWidth: '700px',
          width: '100%',
        }}>
          <h1 style={{
            fontFamily: '"Neue Montreal", sans-serif',
            fontSize: 'clamp(3rem, 6vw, 80px)',
            fontWeight: 400,
            color: '#ffffff',
            margin: '0 0 24px 0',
            lineHeight: 1.1,
            textShadow: '0 2px 10px rgba(0,0,0,0.2)',
          }}>
            Enviki
          </h1>

          {/* Search Pill Input matching live site */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            borderRadius: '9999px',
            padding: '6px 8px 6px 24px',
            maxWidth: '460px',
            margin: '0 auto',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          }}>
            <input
              type="text"
              placeholder="What are you seeking?"
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '16px',
                fontFamily: '"Neue Montreal", sans-serif',
                color: '#393939',
              }}
            />
            <button
              type="button"
              style={{
                backgroundColor: '#2F7ABE',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#ffffff',
                flexShrink: 0,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* 2. DECODING SUSTAINABILITY AND ESG */}
      <section style={{ paddingTop: '70px', paddingBottom: '50px', backgroundColor: '#ffffff' }}>
        <div className="container" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
          <h2 style={{
            fontFamily: '"Neue Montreal", sans-serif',
            fontSize: 'clamp(28px, 2.6vw, 40px)',
            fontWeight: 400,
            color: '#004E35',
            lineHeight: 'normal',
            margin: '0 0 20px 0',
          }}>
            Decoding Sustainability and ESG
          </h2>
          <p style={{
            fontFamily: '"Neue Montreal", sans-serif',
            fontSize: 'clamp(16px, 1.15vw, 18px)',
            fontWeight: 400,
            color: '#393939',
            lineHeight: '30px',
            margin: 0,
            maxWidth: '1200px',
          }}>
            Enviki is a sustainability and ESG knowledge platform designed for professionals, students, and anyone curious about the ESG field. From sustainable development and climate risk to ESG frameworks and responsible investing, it helps you grasp the essentials while staying current with emerging regulations, best practices and trends.
          </p>
        </div>
      </section>

      {/* 3. POPULAR ARTICLES (Live match: Swiper carousel with 12 items, 4 per view, pagination dots) */}
      <section style={{ paddingTop: '30px', paddingBottom: '60px', backgroundColor: '#ffffff' }}>
        <div className="container" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
          <h2 style={{
            fontFamily: '"Neue Montreal", sans-serif',
            fontSize: 'clamp(26px, 2.4vw, 36px)',
            fontWeight: 400,
            color: '#004E35',
            lineHeight: 'normal',
            margin: '0 0 32px 0',
          }}>
            Popular Articles
          </h2>

          <PopularArticlesCarousel
            articles={popularArticles.map((a: any) => ({
              slug: a.slug,
              title: a.title,
              image: a.coverImage?.url || a.heroImage || '/images/services-sustainability.webp',
            }))}
          />
        </div>
      </section>

      {/* 4. BLOGS SECTION (3 cards with live background images and terracotta tint) */}
      <section style={{ paddingTop: '30px', paddingBottom: '70px', backgroundColor: '#ffffff' }}>
        <div className="container" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
          <h2 style={{
            fontFamily: '"Neue Montreal", sans-serif',
            fontSize: 'clamp(26px, 3vw, 40px)',
            fontWeight: 400,
            color: '#004E35',
            lineHeight: 'normal',
            margin: '0 0 32px 0',
          }}>
            Blogs
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}>
            {/* Behind the Buzz */}
            <Link
              href="/behind-the-buzz/"
              style={{
                backgroundImage: 'linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.2) 50%, transparent 80%), url(/images/buzz-updated.avif)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: '#1e293b',
                borderRadius: '25px',
                height: '380px',
                padding: '32px',
                display: 'flex',
                alignItems: 'flex-end',
                textDecoration: 'none',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              }}
            >
              <h3 style={{
                fontFamily: '"Neue Montreal", sans-serif',
                fontSize: '32px',
                fontWeight: 400,
                color: '#ffffff',
                lineHeight: 1.15,
                margin: 0,
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.7)',
              }}>
                Behind
                <br />
                the Buzz
              </h3>
            </Link>

            {/* Glossary Zone */}
            <Link
              href="/glossary-zone/"
              style={{
                backgroundImage: 'linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.2) 50%, transparent 80%), url(/images/glossary-zone-enviki.avif)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: '#1e293b',
                borderRadius: '25px',
                height: '380px',
                padding: '32px',
                display: 'flex',
                alignItems: 'flex-end',
                textDecoration: 'none',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              }}
            >
              <h3 style={{
                fontFamily: '"Neue Montreal", sans-serif',
                fontSize: '32px',
                fontWeight: 400,
                color: '#ffffff',
                lineHeight: 1.15,
                margin: 0,
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.7)',
              }}>
                Glossary
                <br />
                Zone
              </h3>
            </Link>

            {/* How to Articles */}
            <Link
              href="/how-to-articles/"
              style={{
                backgroundImage: 'linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.2) 50%, transparent 80%), url(/images/how-to-article.avif)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: '#1e293b',
                borderRadius: '25px',
                height: '380px',
                padding: '32px',
                display: 'flex',
                alignItems: 'flex-end',
                textDecoration: 'none',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              }}
            >
              <h3 style={{
                fontFamily: '"Neue Montreal", sans-serif',
                fontSize: '32px',
                fontWeight: 400,
                color: '#ffffff',
                lineHeight: 1.15,
                margin: 0,
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.7)',
              }}>
                How to
                <br />
                Articles
              </h3>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. VANTAGE 2025 REPORT BANNER (Aerial forest background visible without heavy blue tint) */}
      <section style={{ paddingBottom: '70px', backgroundColor: '#ffffff' }}>
        <div className="container" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
          <div style={{
            borderRadius: '25px',
            backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0.45) 60%, rgba(0, 0, 0, 0.25) 100%), url(/images/vantage-bg-image.avif)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#111827',
            padding: '56px 48px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            position: 'relative',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
          }}>
            <h2 style={{
              fontFamily: '"Neue Montreal", sans-serif',
              fontSize: 'clamp(28px, 3.2vw, 42px)',
              fontWeight: 500,
              color: '#ffffff',
              lineHeight: 1.2,
              margin: 0,
              textShadow: '0 2px 12px rgba(0, 0, 0, 0.5)',
            }}>
              Vantage 2025: The ESG Reset Opportunity
            </h2>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              gap: '24px',
            }}>
              <p style={{
                fontFamily: '"Neue Montreal", sans-serif',
                fontSize: '18px',
                fontWeight: 400,
                color: '#ffffff',
                lineHeight: '30px',
                maxWidth: '720px',
                margin: 0,
                opacity: 0.95,
                textShadow: '0 1px 6px rgba(0, 0, 0, 0.4)',
              }}>
                Despite global pushback, ESG momentum in India is rising. This report shows that a strong rebound is underway, as responsible practices remain essential for long-term business growth and resilience. Our report, Vantage, offers expert insights to navigate this evolving ESG landscape.
              </p>
              <a
                href="/media/uploads/Envint-Vantage-ESG-Reset.pdf"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  backgroundColor: '#004E35',
                  color: '#ffffff',
                  fontFamily: '"Neue Montreal", sans-serif',
                  fontSize: '18px',
                  fontWeight: 500,
                  padding: '16px 36px',
                  borderRadius: '25px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                  whiteSpace: 'nowrap',
                  transition: 'background-color 0.25s ease, transform 0.25s ease',
                }}
              >
                Read the report now
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

