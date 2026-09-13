import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { getInsightBySlug, getInsightAdjacentSlugs, getInsights } from '@/lib/data/insights';
import { resolvePublicRoute } from '@/lib/routes/resolve-public-route';
import { JsonLd, articleSchema, breadcrumbSchema } from '@/components/seo/JsonLd';
import { DynamicPageRenderer } from '@/components/content/DynamicPageRenderer';

interface ArticlePageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateStaticParams() {
  const articles = await getInsights();
  return articles.map((a: any) => ({ slug: [a.slug] }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  // Catch-all: rejoin segments (e.g. ['solutions', 'new-page'] -> '/solutions/new-page')
  const joined = (Array.isArray(slug) ? slug.join('/') : slug) || '';
  const cleanSlug = joined.startsWith('/') ? joined : `/${joined}`;
  const route = await resolvePublicRoute(cleanSlug);
  const cmsPage = route?.kind === 'page' ? route.page : null;

  if (cmsPage) {
    const title = cmsPage.seoTitle || `${cmsPage.title} - Envint`;
    const desc = cmsPage.seoDescription || '';
    return {
      title,
      description: desc,
      alternates: {
        canonical: `https://envintglobal.com/${joined}/`,
      },
      openGraph: {
        title,
        description: desc,
        url: `https://envintglobal.com/${joined}/`,
        type: 'website',
      },
    };
  }

  const article = await getInsightBySlug(joined);

  if (!article) {
    return {
      title: 'Article Not Found - Envint',
    };
  }

  const desc = article.seoDescription || (article as any).excerpt || '';
  const pubTime = article.publishedAt ? new Date(article.publishedAt).toISOString() : undefined;

  return {
    title: `${article.title} - Envint Insights`,
    description: desc,
    alternates: {
      canonical: `https://envintglobal.com/${joined}/`,
    },
    openGraph: {
      title: article.title,
      description: desc,
      url: `https://envintglobal.com/${joined}/`,
      type: 'article',
      publishedTime: pubTime,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const joined = (Array.isArray(slug) ? slug.join('/') : slug) || '';
  const cleanSlug = joined.startsWith('/') ? joined : `/${joined}`;
  const route = await resolvePublicRoute(cleanSlug);
  const cmsPage = route?.kind === 'page' ? route.page : null;

  if (cmsPage) {
    return (
      <main style={{ minHeight: '80vh' }}>
        <JsonLd
          data={breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: cmsPage.title, path: `/${joined}/` },
          ])}
        />
        <DynamicPageRenderer page={cmsPage} />
      </main>
    );
  }

  const article = await getInsightBySlug(joined);

  if (!article) {
    notFound();
  }

  const { previous, next } = await getInsightAdjacentSlugs(joined);
  const coverUrl = (article.coverImage as any)?.url || (article as any).heroImage || (article as any).coverImageUrl || '/images/hero-wetland.webp';
  const pubDateStr = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;
  const contentHtml = (article as any).contentHtml;
  const absoluteCover = coverUrl.startsWith('http') ? coverUrl : `https://envintglobal.com${coverUrl}`;
  const seoDesc =
    (article as any).seoDescription ||
    String((article as any).excerpt || '').slice(0, 160);

  return (
    <article style={{ backgroundColor: '#ffffff', minHeight: '80vh', paddingTop: '80px' }}>
      <JsonLd
        data={[
          articleSchema({
            headline: article.title,
            description: seoDesc,
            url: `/${joined}/`,
            image: absoluteCover,
            datePublished: article.publishedAt ? new Date(article.publishedAt).toISOString() : undefined,
          }),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Insights', path: '/envision/' },
            { name: article.title, path: `/${joined}/` },
          ]),
        ]}
      />
      {/* 1. HERO TOP BANNER */}
      <div style={{ position: 'relative', height: '380px', width: '100%', overflow: 'hidden' }}>
        <Image
          src={coverUrl}
          alt={article.title}
          fill
          priority
          style={{ objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, transparent 60%)',
        }} />
      </div>

      {/* 2. ARTICLE HEADER CONTAINER */}
      <div className="container" style={{ maxWidth: '860px', marginTop: '-60px', position: 'relative', zIndex: 10 }}>
        <div className="article-hero-card" style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-card)',
          marginBottom: '40px',
        }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
            color: 'var(--color-brand-green-dark)',
            lineHeight: 1.2,
            marginBottom: '16px',
          }}>
            {article.title}
          </h1>

          {pubDateStr && (
            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
              {pubDateStr}
            </div>
          )}

          {/* Social Share Bar */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <a
              href={`mailto:?subject=${encodeURIComponent(article.title)}&body=https://envintglobal.com/${joined}/`}
              aria-label="Share via Email"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '4px',
                backgroundColor: '#ea4335',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                fontWeight: 700,
              }}
            >
              ✉
            </a>

            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=https://envintglobal.com/${joined}/`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on LinkedIn"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '4px',
                backgroundColor: '#0a66c2',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                fontWeight: 700,
              }}
            >
              in
            </a>

            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=https://envintglobal.com/${joined}/`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on X"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '4px',
                backgroundColor: '#000000',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                fontWeight: 700,
              }}
            >
              𝕏
            </a>
          </div>
        </div>
      </div>

      {/* 3. MAIN ARTICLE CONTENT BODY */}
      <div className="container" style={{ maxWidth: '860px', paddingBottom: '80px' }}>
        {contentHtml ? (
          <div
            className="article-content"
            style={{
              fontSize: '1.1rem',
              lineHeight: 1.8,
              color: 'var(--color-text-main)',
            }}
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        ) : (
          <div style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--color-text-main)' }}>
            <p style={{ marginBottom: '24px' }}>
              {(article as any).excerpt}
            </p>
            <p>
              Organizations navigating corporate sustainability baselines, Scope 1, 2, and 3 accounting require practical methodologies grounded in international greenhouse gas standards.
            </p>
          </div>
        )}

        {/* 4. PREVIOUS / NEXT NAVIGATION BAR */}
        <div className="article-nav-bar" style={{
          borderTop: '1px solid #e2e8f0',
          marginTop: '60px',
          paddingTop: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '24px',
        }}>
          {previous ? (
            <Link href={`/${previous.slug}/`} className="article-nav-link">
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                ← PREVIOUS
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-brand-green-dark)' }}>
                {previous.title}
              </div>
            </Link>
          ) : <div />}

          {next ? (
            <Link href={`/${next.slug}/`} className="article-nav-link" style={{ textAlign: 'right', marginLeft: 'auto' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                NEXT →
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-brand-green-dark)' }}>
                {next.title}
              </div>
            </Link>
          ) : <div />}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .article-hero-card {
          padding: 40px 48px;
        }
        .article-nav-link {
          max-width: 45%;
        }
        @media (max-width: 640px) {
          .article-hero-card {
            padding: 24px 20px;
          }
          .article-nav-bar {
            flex-direction: column;
            gap: 16px;
          }
          .article-nav-link {
            max-width: 100% !important;
            text-align: left !important;
            margin-left: 0 !important;
          }
        }
      ` }} />
    </article>
  );
}
