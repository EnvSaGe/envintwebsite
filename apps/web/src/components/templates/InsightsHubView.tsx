import React from 'react';
import Link from 'next/link';

interface InsightsHubViewProps {
  title: string;
  subtitle: string;
  description: string;
  insights?: any[];
}

export function InsightsHubView({ title, subtitle, description, insights = [] }: InsightsHubViewProps) {
  return (
    <div className="container" style={{ padding: '60px 20px' }}>
      <span style={{ color: 'var(--color-primary)', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.85rem' }}>
        {subtitle}
      </span>
      <h1 style={{ fontSize: '2.75rem', marginTop: '8px', marginBottom: '16px' }}>{title}</h1>
      <p style={{ fontSize: '1.2rem', color: 'var(--color-text-body)', maxWidth: '800px', marginBottom: '48px' }}>
        {description}
      </p>

      {insights.length === 0 ? (
        <div style={{ padding: '32px', border: '1px solid var(--color-border-light)', borderRadius: '8px' }}>
          <p style={{ color: 'var(--color-text-muted)' }}>Curated articles and thought leadership pieces will be loaded from Neon PostgreSQL.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
          {insights.map((article: any) => (
            <div key={article.id} style={{ border: '1px solid var(--color-border-light)', borderRadius: '8px', padding: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>
                <Link href={`/${article.slug}/`}>{article.title}</Link>
              </h3>
              <p style={{ fontSize: '1rem', color: 'var(--color-text-body)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{article.excerpt}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
