import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { getImpact, getImpactAdjacentSlugs, getImpacts } from '@/lib/data/impacts';
import { getPage, pageHasRenderableContent } from '@/lib/data/pages';
import { JsonLd, articleSchema, breadcrumbSchema } from '@/components/seo/JsonLd';
import { DynamicPageRenderer } from '@/components/content/DynamicPageRenderer';

interface ImpactPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const impacts = await getImpacts();
  return impacts.map((item: any) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: ImpactPageProps): Promise<Metadata> {
  const { slug } = await params;
  const cmsPage = await getPage(`/impact/${slug}`);

  if (cmsPage) {
    const title = cmsPage.seoTitle || `${cmsPage.title} - Envint Impact Case Study`;
    const desc = cmsPage.seoDescription || '';
    return {
      title,
      description: desc,
      alternates: {
        canonical: `https://envintglobal.com/impact/${slug}/`,
      },
      openGraph: {
        title,
        description: desc,
        url: `https://envintglobal.com/impact/${slug}/`,
        type: 'article',
      },
    };
  }

  const impact = await getImpact(slug);

  if (!impact) {
    return {
      title: 'Case Study Not Found - Envint',
    };
  }

  const desc = (impact as any).summary || (impact as any).seoDescription || '';

  return {
    title: `${impact.title} - Envint Impact Case Study`,
    description: desc,
    alternates: {
      canonical: `https://envintglobal.com/impact/${slug}/`,
    },
    openGraph: {
      title: impact.title,
      description: desc,
      url: `https://envintglobal.com/impact/${slug}/`,
      type: 'article',
    },
  };
}

export default async function ImpactDetailPage({ params }: ImpactPageProps) {
  const { slug } = await params;
  const cmsPage = await getPage(`/impact/${slug}`);

  if (pageHasRenderableContent(cmsPage)) {
    return (
      <main style={{ minHeight: '80vh' }}>
        <JsonLd
          data={breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Impact', path: '/impact/' },
            { name: cmsPage.title, path: `/impact/${slug}/` },
          ])}
        />
        <DynamicPageRenderer page={cmsPage} />
      </main>
    );
  }

  const impact = await getImpact(slug);

  if (!impact) {
    notFound();
  }

  const { previous, next } = await getImpactAdjacentSlugs(slug);
  const coverUrl = (impact as any).heroImage || (impact as any).coverImage?.url || '/images/services-sustainability.webp';
  const pubDateStr = (impact as any).publishedAt
    ? new Date((impact as any).publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'June 4, 2024';
  const contentHtml = (impact as any).contentHtml;
  const absoluteCover = coverUrl.startsWith('http') ? coverUrl : `https://envintglobal.com${coverUrl}`;
  const summaryText = String((impact as any).summary || (impact as any).seoDescription || '').slice(0, 200);

  return (
    <article style={{ backgroundColor: '#ffffff', minHeight: '80vh', padding: '140px 0 90px' }}>
      <JsonLd
        data={[
          articleSchema({
            headline: impact.title,
            description: summaryText,
            url: `/impact/${slug}/`,
            image: absoluteCover,
            datePublished: (impact as any).publishedAt
              ? new Date((impact as any).publishedAt).toISOString()
              : undefined,
          }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Impact', path: '/impact/' },
            { name: impact.title, path: `/impact/${slug}/` },
          ]),
        ]}
      />
      <div className="container" style={{ maxWidth: '880px', paddingLeft: '20px', paddingRight: '20px' }}>
        {/* 1. CENTERED TITLE & DATE */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h1 style={{
            fontFamily: '"Neue Montreal", sans-serif',
            fontSize: 'clamp(2.2rem, 4vw, 48px)',
            color: '#121127',
            lineHeight: 1.2,
            marginBottom: '18px',
            fontWeight: 400,
          }}>
            {impact.title}
          </h1>

          {pubDateStr && (
            <div style={{
              fontFamily: '"Neue Montreal", sans-serif',
              fontSize: '16px',
              color: '#64748b',
              fontWeight: 400,
            }}>
              {pubDateStr}
            </div>
          )}
        </div>

        {/* 2. CENTERED FEATURED IMAGE */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: 'clamp(240px, 45vw, 480px)',
          borderRadius: '20px',
          overflow: 'hidden',
          marginBottom: '50px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
        }}>
          <Image
            src={coverUrl}
            alt={impact.title}
            fill
            priority
            sizes="(max-width: 920px) 100vw, 880px"
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* 3. CASE STUDY BODY CONTENT */}
        {contentHtml ? (
          <div
            className="article-content impact-detail-content"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        ) : (
          <div style={{
            fontFamily: '"Neue Montreal", sans-serif',
            fontSize: '18px',
            fontWeight: 400,
            lineHeight: 1.7,
            color: '#393939',
          }}>
            {impact.summary && (
              <p style={{
                fontSize: '20px',
                color: '#393939',
                lineHeight: 1.6,
                marginBottom: '32px',
              }}>
                {impact.summary}
              </p>
            )}

            {(impact as any).problem && (
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{
                  fontFamily: '"Neue Montreal", sans-serif',
                  fontSize: '32px',
                  fontWeight: 400,
                  color: '#121127',
                  marginTop: '36px',
                  marginBottom: '16px',
                }}>
                  Problem
                </h2>
                <p style={{ margin: 0 }}>{(impact as any).problem}</p>
              </div>
            )}

            {(impact as any).solution && (
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{
                  fontFamily: '"Neue Montreal", sans-serif',
                  fontSize: '32px',
                  fontWeight: 400,
                  color: '#121127',
                  marginTop: '36px',
                  marginBottom: '16px',
                }}>
                  Solution
                </h2>
                <p style={{ margin: 0 }}>{(impact as any).solution}</p>
              </div>
            )}

            {(impact as any).outcome && (
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{
                  fontFamily: '"Neue Montreal", sans-serif',
                  fontSize: '32px',
                  fontWeight: 400,
                  color: '#121127',
                  marginTop: '36px',
                  marginBottom: '16px',
                }}>
                  Impact
                </h2>
                <p style={{ margin: 0 }}>{(impact as any).outcome}</p>
              </div>
            )}
          </div>
        )}

        {/* 4. PREVIOUS / NEXT NAVIGATION BAR (Exact Live Match) */}
        <div className="impact-nav-bar" style={{
          marginTop: '60px',
          paddingTop: '32px',
          borderTop: '1px solid #eef2f6',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '24px',
        }}>
          {previous ? (
            <Link
              href={`/impact/${previous.slug}/`}
              className="impact-nav-link"
              style={{
                textDecoration: 'none',
              }}
            >
              <div style={{
                fontFamily: '"Neue Montreal", sans-serif',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.05em',
                color: '#121127',
                marginBottom: '6px',
              }}>
                &larr; PREVIOUS
              </div>
              <div style={{
                fontFamily: '"Neue Montreal", sans-serif',
                fontSize: '16px',
                fontWeight: 400,
                color: '#393939',
                lineHeight: 1.4,
              }}>
                {previous.title}
              </div>
            </Link>
          ) : <div />}

          {next ? (
            <Link
              href={`/impact/${next.slug}/`}
              className="impact-nav-link"
              style={{
                textDecoration: 'none',
                textAlign: 'right',
                marginLeft: 'auto',
              }}
            >
              <div style={{
                fontFamily: '"Neue Montreal", sans-serif',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.05em',
                color: '#121127',
                marginBottom: '6px',
              }}>
                NEXT &rarr;
              </div>
              <div style={{
                fontFamily: '"Neue Montreal", sans-serif',
                fontSize: '16px',
                fontWeight: 400,
                color: '#393939',
                lineHeight: 1.4,
              }}>
                {next.title}
              </div>
            </Link>
          ) : <div />}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .impact-detail-content {
          font-family: "Neue Montreal", sans-serif;
          font-size: 18px;
          font-weight: 400;
          line-height: 1.75;
          color: #393939;
        }
        /* Intro summary statement at top of case study */
        .impact-detail-content > p:first-of-type,
        .impact-detail-content > span:first-of-type {
          display: block;
          font-size: 19px;
          line-height: 1.65;
          color: #393939;
          margin-bottom: 38px;
        }
        /* Section Headings: Client, Problem, Solution, Impact */
        .impact-detail-content h2,
        .impact-detail-content h3 {
          font-family: "Neue Montreal", sans-serif;
          font-size: 26px;
          font-weight: 400;
          line-height: 1.25;
          color: #121127;
          margin-top: 42px;
          margin-bottom: 14px;
        }
        /* Spacing for content blocks under headings */
        .impact-detail-content p {
          font-family: "Neue Montreal", sans-serif;
          font-size: 18px;
          line-height: 1.75;
          color: #393939;
          margin-top: 0;
          margin-bottom: 36px;
        }
        .impact-detail-content > span,
        .impact-detail-content > div {
          display: block;
          font-family: "Neue Montreal", sans-serif;
          font-size: 18px;
          line-height: 1.75;
          color: #393939;
          margin-bottom: 36px;
        }
        .impact-detail-content ul {
          list-style-type: disc;
          margin: 0 0 38px 0;
          padding-left: 24px;
        }
        .impact-detail-content li {
          font-family: "Neue Montreal", sans-serif;
          font-size: 18px;
          line-height: 1.75;
          color: #393939;
          margin-bottom: 12px;
        }
        .impact-detail-content li:last-child {
          margin-bottom: 0;
        }
        .impact-detail-content span {
          font-family: inherit !important;
          font-size: inherit !important;
        }
        .impact-nav-link {
          max-width: 45%;
        }
        @media (max-width: 640px) {
          .impact-nav-bar {
            flex-direction: column;
            gap: 16px;
          }
          .impact-nav-link {
            max-width: 100% !important;
            text-align: left !important;
            margin-left: 0 !important;
          }
        }
      ` }} />
    </article>
  );
}
