import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Article {
  slug: string;
  title: string;
  excerpt?: string;
  coverImage?: { url: string };
  heroImage?: string;
}

export default function ArticleCardGrid({ articles }: { articles: Article[] }) {
  if (!articles || articles.length === 0) return null;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '30px',
      }}
    >
      {articles.map((article) => {
        const coverUrl =
          article.coverImage?.url ||
          article.heroImage ||
          (article as any).coverImageUrl ||
          '/images/services-sustainability.webp';
        return (
          <Link
            key={article.slug}
            href={`/${article.slug}/`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '0 28px 40px',
              textDecoration: 'none',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                borderRadius: '12px',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                backgroundColor: '#ffffff',
              }}
            >
              <div style={{ height: '260px', position: 'relative', backgroundColor: '#e2e8f0' }}>
                <Image
                  src={coverUrl}
                  alt={article.title}
                  fill
                  loading="eager"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '15px', display: 'flex', flexDirection: 'column' }}>
                <h3
                  style={{
                    fontFamily: '"Neue Montreal", sans-serif',
                    fontSize: '24px',
                    fontWeight: 500,
                    color: '#1E293B',
                    lineHeight: 'normal',
                    margin: '24px 0 0 0',
                  }}
                >
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p
                    style={{
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
                    }}
                  >
                    {article.excerpt}
                  </p>
                )}
                <span
                  style={{
                    fontFamily: '"Neue Montreal", sans-serif',
                    fontSize: '18px',
                    fontWeight: 400,
                    color: '#2F7ABE',
                    display: 'block',
                    textAlign: 'left',
                    padding: '24px 0',
                    marginTop: '10px',
                  }}
                >
                  Read More
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}