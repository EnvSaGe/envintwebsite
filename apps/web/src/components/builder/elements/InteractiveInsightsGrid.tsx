'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { resolveCmsImage } from '@envint/shared';

export interface InteractiveInsightsGridProps {
  articles: any[];
  builderId?: string;
  cardBorder?: boolean;
  showExcerpt?: boolean;
  showDate?: boolean;
  showReadMore?: boolean;
}

export function InteractiveInsightsGrid({
  articles,
  builderId,
  cardBorder = false,
  showExcerpt = true,
  showDate = true,
  showReadMore = false,
}: InteractiveInsightsGridProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const handleSearch = (e: Event) => {
      const custom = e as CustomEvent<{ query: string }>;
      setSearchQuery(custom.detail?.query || '');
    };
    window.addEventListener('envint:search', handleSearch);
    return () => window.removeEventListener('envint:search', handleSearch);
  }, []);

  const clearSearch = () => {
    setSearchQuery('');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('envint:search', { detail: { query: '' } }));
    }
  };

  const filteredArticles = useMemo(() => {
    const cleanQ = searchQuery.trim().toLowerCase();
    if (!cleanQ) return articles;

    return articles.filter((article: any) => {
      const title = String(article.title || '').toLowerCase();
      const excerpt = String(
        article.seoDescription ||
        article.summary ||
        (article.excerpt ? String(article.excerpt).replace(/<[^>]+>/g, '') : '')
      ).toLowerCase();
      const content = String(article.contentHtml || article.content || '').toLowerCase();
      const cats = Array.isArray(article.categories)
        ? article.categories.join(' ').toLowerCase()
        : String(article.categories || '').toLowerCase();
      const tags = Array.isArray(article.tags)
        ? article.tags.join(' ').toLowerCase()
        : String(article.tags || '').toLowerCase();

      return (
        title.includes(cleanQ) ||
        excerpt.includes(cleanQ) ||
        cats.includes(cleanQ) ||
        tags.includes(cleanQ) ||
        content.includes(cleanQ)
      );
    });
  }, [articles, searchQuery]);

  return (
    <div
      data-builder-id={builderId}
      data-envint-filterable="true"
      style={{ width: '100%', boxSizing: 'border-box' }}
    >
      {/* Active Search Status Bar */}
      {searchQuery.trim() && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 18px',
            backgroundColor: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: '12px',
            marginBottom: '24px',
            fontSize: '14px',
            color: '#166534',
            fontFamily: '"Neue Montreal", sans-serif',
          }}
        >
          <span>
            Found <strong>{filteredArticles.length}</strong>{' '}
            {filteredArticles.length === 1 ? 'article' : 'articles'} matching &ldquo;
            <strong>{searchQuery}</strong>&rdquo;
          </span>
          <button
            type="button"
            onClick={clearSearch}
            style={{
              background: 'none',
              border: 'none',
              color: '#004E35',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '13px',
              fontFamily: '"Neue Montreal", sans-serif',
              padding: '2px 6px',
            }}
          >
            Clear filter
          </button>
        </div>
      )}

      {/* Grid or Empty State */}
      {filteredArticles.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '64px 20px',
            backgroundColor: '#F8FAFC',
            borderRadius: '16px',
            border: '1px dashed #CBD5E1',
            margin: '20px 0',
          }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ margin: '0 auto 16px auto', display: 'block' }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <h4
            style={{
              fontSize: '20px',
              fontWeight: 500,
              color: '#1E293B',
              marginBottom: '8px',
              fontFamily: '"Neue Montreal", sans-serif',
            }}
          >
            No articles found
          </h4>
          <p
            style={{
              fontSize: '15px',
              color: '#64748B',
              marginBottom: '20px',
              fontFamily: '"Neue Montreal", sans-serif',
            }}
          >
            We couldn&apos;t find any articles matching &ldquo;{searchQuery}&rdquo;. Try another term.
          </p>
          <button
            type="button"
            onClick={clearSearch}
            style={{
              backgroundColor: '#004E35',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '9999px',
              padding: '10px 24px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: '"Neue Montreal", sans-serif',
              transition: 'background-color 0.15s ease',
            }}
          >
            Clear Search Filter
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
            gap: '30px',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {filteredArticles.map((article: any) => {
            const coverImg = resolveCmsImage(
              article.coverImage?.url ||
              article.coverImageUrl ||
              (article as any).heroImage ||
              'https://envintcms.s3.ap-south-1.amazonaws.com/images/about-hero.webp'
            );
            const excerptText =
              article.seoDescription ||
              article.summary ||
              (article.excerpt ? String(article.excerpt).replace(/<[^>]+>/g, '').trim() : '');

            const rawDate = article.publishedAt || article.published_at || article.date;
            let formattedDate = '';
            if (rawDate) {
              try {
                const d = new Date(rawDate);
                if (!isNaN(d.getTime())) {
                  formattedDate = d.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    timeZone: 'UTC',
                  });
                }
              } catch {}
            }

            return (
              <Link
                key={article.slug}
                href={`/${article.slug}/`}
                style={{
                  textDecoration: 'none',
                  backgroundColor: cardBorder ? '#ffffff' : 'transparent',
                  borderRadius: cardBorder ? '12px' : '0',
                  border: cardBorder ? '1px solid rgba(0, 0, 0, 0.1)' : 'none',
                  overflow: 'visible',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '240px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    backgroundColor: '#f1f5f9',
                  }}
                >
                  <Image
                    src={coverImg}
                    alt={article.title || ''}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                    quality={75}
                    style={{
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                    }}
                  />
                </div>
                <div
                  style={{
                    padding: cardBorder ? '16px' : '20px 0 0 0',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                  }}
                >
                  <h3
                    style={{
                      fontFamily: '"Neue Montreal", sans-serif',
                      fontSize: '24px',
                      fontWeight: 400,
                      color: '#1E1E1E',
                      lineHeight: 1.3,
                      margin: '0 0 12px 0',
                    }}
                  >
                    {article.title}
                  </h3>
                  {showExcerpt && excerptText && (
                    <p
                      style={{
                        fontFamily: '"Neue Montreal", sans-serif',
                        fontSize: '16px',
                        fontWeight: 400,
                        color: '#555555',
                        lineHeight: '1.5',
                        margin: '0 0 16px 0',
                        flex: 1,
                      }}
                    >
                      {excerptText.length > 130 ? `${excerptText.slice(0, 130)}...` : excerptText}
                    </p>
                  )}
                  {showDate && formattedDate && (
                    <div
                      style={{
                        fontFamily: '"Neue Montreal", sans-serif',
                        fontSize: '15px',
                        fontWeight: 400,
                        color: '#8C8C8C',
                        marginTop: 'auto',
                        paddingTop: '4px',
                      }}
                    >
                      {formattedDate}
                    </div>
                  )}
                  {showReadMore && (
                    <span
                      style={{
                        fontFamily: '"Neue Montreal", sans-serif',
                        fontSize: '18px',
                        fontWeight: 400,
                        color: '#2F7ABE',
                        display: 'block',
                        textAlign: 'left',
                        padding: '16px 0 0 0',
                        marginTop: 'auto',
                      }}
                    >
                      Read More
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
