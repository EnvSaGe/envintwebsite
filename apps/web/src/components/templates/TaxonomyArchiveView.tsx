import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface TaxonomyArchiveViewProps {
  type: string;
  slug: string;
  title: string;
  description?: string;
  items?: any[];
}

/*
 * Live-site-faithful taxonomy archive (sector / theme / service / category).
 * Mirrors the live WordPress Astra archive layout:
 *   - white page, centered 1200px content column
 *   - archive title: 40px / weight 300 (live .ast-archive-title)
 *   - fixed 3-column grid (live .ast-grid-3) - a single result stays a
 *     narrow first-column card instead of stretching full width
 *   - cards: plain (no box/border/radius), 16:9 image, then small muted
 *     category chip, h2 title (20px / normal weight) and date below
 */
export function TaxonomyArchiveView({ title, description, items = [] }: TaxonomyArchiveViewProps) {
  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '80vh', padding: '120px 0 100px' }}>
      <div style={{
        // 1240 outer box + 20px side padding = 1200px content, matching the live
        // Astra content column (cards start at x120 on a 1440px viewport).
        maxWidth: '1240px',
        margin: '0 auto',
        padding: '0 20px',
        boxSizing: 'border-box',
      }}>
        {/* Archive header (live .ast-archive-description: title only, hairline under) */}
        <div style={{ marginBottom: '44px', paddingBottom: '28px', borderBottom: '1px solid #e5e7eb' }}>
          <h1 style={{
            fontFamily: '"Neue Montreal", sans-serif',
            fontSize: '44px',
            fontWeight: 400,
            color: '#141414',
            lineHeight: 1.15,
            letterSpacing: '-0.01em',
            margin: 0,
          }}>
            {title}
          </h1>
          {description && (
            <p style={{
              fontFamily: '"Neue Montreal", sans-serif',
              fontSize: '20px',
              fontWeight: 300,
              lineHeight: 1.65,
              color: '#555555',
              maxWidth: '900px',
              margin: '12px 0 0',
            }}>
              {description}
            </p>
          )}
        </div>

        {/* 3-column post grid matching live .ast-grid-3 */}
        <div className="tax-archive-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          columnGap: '40px',
          rowGap: '64px',
        }}>
          {items.map((item: any) => (
            <Link
              key={item.id}
              href={`/${item.slug}/`}
              style={{
                display: 'block',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <div style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16 / 9',
                overflow: 'hidden',
                backgroundColor: '#ececec',
              }}>
                <Image
                  src={item.coverImage || '/images/services-sustainability.webp'}
                  alt={item.title}
                  fill
                  sizes="(max-width: 900px) 100vw, (max-width: 1100px) 50vw, 373px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '28px 0 0' }}>
                <span style={{
                  display: 'block',
                  fontFamily: '"Neue Montreal", sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#4a4a4a',
                  marginBottom: '12px',
                }}>
                  {item.category || title}
                </span>
                <h2 style={{
                  fontFamily: '"Neue Montreal", sans-serif',
                  fontSize: '22px',
                  fontWeight: 500,
                  color: '#141414',
                  lineHeight: 1.32,
                  margin: '0 0 12px',
                }}>
                  {item.title}
                </h2>
                {item.date && (
                  <div style={{
                    fontFamily: '"Neue Montreal", sans-serif',
                    fontSize: '15px',
                    color: '#4a4a4a',
                  }}>
                    {item.date}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          @media (max-width: 900px) {
            .tax-archive-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          }
          @media (max-width: 600px) {
            .tax-archive-grid { grid-template-columns: 1fr !important; }
          }
        ` }} />
      </div>
    </div>
  );
}
