import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { getInsights } from '@/lib/data/insights';

export const metadata: Metadata = {
  title: 'Envision - Sustainability & ESG News, Reports & Insights',
  description: 'Read the latest thought leadership, regulatory analysis, and market perspectives from Envint on BRSR, Carbon Accounting, and Sustainable Finance.',
  alternates: {
    canonical: 'https://envintglobal.com/envision/',
  },
};

export default async function EnvisionPage() {
  const articles = await getInsights();

  // Live shows every Envision-category post in order (41 cards).
  const filtered = articles.filter((a: any) =>
    (a.categories || []).some((c: string) => c.toLowerCase().includes('envision'))
  );
  const displayArticles = filtered.length > 0 ? filtered : articles;

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '80vh' }}>
      {/* 1. HERO SECTION (Full-screen on desktop, responsive 58-60vh on mobile/tablet) */}
      <section className="page-hero">
        <Image
          src="/images/envision-hero.webp"
          alt="Boardwalk pier extending into calm sunset lake - Envint Envision"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center', zIndex: 0 }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0, 25, 20, 0.75) 0%, rgba(0, 25, 20, 0.2) 55%, transparent 100%)',
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
            textShadow: '0 2px 12px rgba(0,0,0,0.3)',
          }}>
            News &amp; Insights
          </h1>
        </div>
      </section>

      {/* 2. ARTICLES GRID */}
      <section style={{ paddingTop: '80px', paddingBottom: '70px', backgroundColor: '#ffffff' }}>
        <div className="container hero-stretch">
          <div className="envision-articles-grid">
            {displayArticles.map((article: any) => (
              <Link
                key={article.slug}
                href={`/${article.slug}/`}
                className="envision-article-link"
              >
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  borderRadius: '12px',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  backgroundColor: '#ffffff',
                }}>
                  <div style={{ height: '260px', position: 'relative', backgroundColor: '#e2e8f0' }}>
                    <Image
                      src={article.coverImage?.url || article.heroImage || article.coverImageUrl || '/images/services-climate.webp'}
                      alt={article.title}
                      fill
                      loading="eager"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{
                      fontFamily: '"Neue Montreal", sans-serif',
                      fontSize: '24px',
                      fontWeight: 500,
                      color: '#1E293B',
                      lineHeight: 'normal',
                      margin: '24px 0 0 0',
                    }}>
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p style={{
                        fontFamily: '"Neue Montreal", sans-serif',
                        fontSize: '14px',
                        fontWeight: 400,
                        color: '#7a7a7a',
                        lineHeight: 1.6,
                        margin: '12px 0 0 0',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        {article.excerpt}
                      </p>
                    )}
                    <span style={{
                      fontFamily: '"Neue Montreal", sans-serif',
                      fontSize: '18px',
                      fontWeight: 400,
                      color: '#2F7ABE',
                      display: 'block',
                      textAlign: 'left',
                      padding: '24px 0',
                      marginTop: '10px',
                    }}>
                      Read More
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>



      <style dangerouslySetInnerHTML={{ __html: `
        .envision-articles-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 30px;
        }
        .envision-article-link {
          display: flex;
          flex-direction: column;
          padding: 0 12px 40px;
          text-decoration: none;
        }
        @media (max-width: 1024px) {
          .envision-articles-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 24px;
          }
          .envision-article-link {
            padding: 0 6px 30px;
          }
        }
        @media (max-width: 640px) {
          .envision-articles-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .envision-article-link {
            padding: 0 0 24px;
          }
        }
      ` }} />
    </div>
  );
}
