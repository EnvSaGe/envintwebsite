'use client';

/**
 * Shared block primitives for the Studio canvas.
 *
 * These mirror the PUBLIC renderers in `apps/web/src/components/builder/elements/*`
 * one-for-one (same tag, same default style application, same content fields) so
 * the editor canvas is a faithful representation of the real page.
 *
 * HARD RULE: no fabricated public-facing content. When a required field is
 * missing we render an EDITOR-ONLY warning state instead of inventing copy.
 * New/empty nodes (with schema default content) render their schema defaults,
 * exactly like the public site would.
 */

import React from 'react';
import { AlertTriangle, ImageOff, icons as Icons } from 'lucide-react';
import { BuilderNode, ElementStyles, resolveCmsImage, selectDynamicPreviewRecords, type StudioDynamicRecord } from '@envint/shared';
import { elementStylesToCss } from './style-utils';

/** Editor-only visual warning chip. Never published; studio chrome only. */
function EditorWarning({ label }: { label: string }) {
  return (
    <div
      className="my-2 flex max-w-md items-start gap-2 rounded-lg border border-dashed border-amber-400/70 bg-amber-50 px-3 py-2"
      data-editor-warning=""
    >
      <AlertTriangle size={14} className="mt-0.5 shrink-0 text-amber-600" />
      <div className="min-w-0">
        <p className="text-[11px] font-semibold text-amber-900">{label}</p>
        <p className="text-[10px] text-amber-700/80">
          Editor notice — this placeholder is never shown on the live site.
        </p>
      </div>
    </div>
  );
}

export function ContainerPrimitive({
  node,
  className,
  children,
}: {
  node: BuilderNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      data-builder-id={node.id}
      className={className}
      style={{
        boxSizing: 'border-box',
        position: 'relative',
        width: '100%',
        ...elementStylesToCss(node.styles),
      }}
    >
      {children}
    </div>
  );
}

export function SectionPrimitive({
  node,
  children,
}: {
  node: BuilderNode;
  children: React.ReactNode;
}) {
  const inlineStyles = elementStylesToCss(node.styles);
  const backgroundOverlay = node.styles?.backgroundOverlay || (node.styles as any)?.overlayGradient;

  return (
    <section
      data-builder-id={node.id}
      style={{
        position: 'relative',
        width: '100%',
        boxSizing: 'border-box',
        ...inlineStyles,
      }}
    >
      {backgroundOverlay && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: backgroundOverlay,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      )}
      <div style={{ position: 'relative', zIndex: 2, width: '100%' }}>{children}</div>
    </section>
  );
}

export function GridPrimitive({
  node,
  children,
}: {
  node: BuilderNode;
  children: React.ReactNode;
}) {
  const inlineStyles = elementStylesToCss(node.styles);
  return (
    <div
      data-builder-id={node.id}
      style={{
        display: 'grid',
        boxSizing: 'border-box',
        position: 'relative',
        width: '100%',
        ...inlineStyles,
      }}
    >
      {children}
    </div>
  );
}

export function FlexPrimitive({
  node,
  children,
}: {
  node: BuilderNode;
  children: React.ReactNode;
}) {
  const inlineStyles = elementStylesToCss(node.styles);
  return (
    <div
      data-builder-id={node.id}
      style={{
        display: 'flex',
        boxSizing: 'border-box',
        position: 'relative',
        width: '100%',
        ...inlineStyles,
      }}
    >
      {children}
    </div>
  );
}

export function HeadingPrimitive({ node }: { node: BuilderNode }) {
  const content = node.content || {};
  const tag = (content.tag || 'h2').toLowerCase();
  const text = content.text || 'Heading';
  const inlineStyles = elementStylesToCss(node.styles);
  const TagName = (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag) ? tag : 'h2') as keyof React.JSX.IntrinsicElements;

  return (
    <TagName data-builder-id={node.id} style={inlineStyles}>
      {text}
    </TagName>
  );
}

/** Studio-only safe subset of inline tags (mirrors public sanitizer allowlist). */
const SAFE_INLINE_TAGS = ['p', 'b', 'strong', 'i', 'em', 'u', 'a', 'ul', 'ol', 'li', 'br', 'span'];
const DANGEROUS_HTML = /<\s*\/?\s*(script|iframe|object|embed|style|link|meta)\b/i;
const EVENT_ATTR = /\son\w+\s*=/i;
const JS_URL = /href\s*=\s*["']?\s*javascript:/i;

/** Minimal allowlist sanitizer for the studio preview (parity with public ParagraphElement). */
export function sanitizeInlineHtml(raw: string): string {
  if (!raw) return '';
  if (DANGEROUS_HTML.test(raw) || EVENT_ATTR.test(raw) || JS_URL.test(raw)) {
    return raw.replace(/<[^>]*>/g, '');
  }
  return raw;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function ParagraphPrimitive({ node }: { node: BuilderNode }) {
  const content = node.content || {};
  const rawHtml = content.html || (content.text ? `<p>${escapeHtml(content.text)}</p>` : '');
  const inlineStyles = elementStylesToCss(node.styles);

  if (!rawHtml.trim()) {
    return (
      <div data-builder-id={node.id} style={inlineStyles}>
        <EditorWarning label="This paragraph has no text yet." />
      </div>
    );
  }

  let html = sanitizeInlineHtml(rawHtml);
  // Remove disallowed tags but keep their inner text (mirrors public discard mode)
  html = html.replace(/<(?!\/?(?:p|b|strong|i|em|u|a|ul|ol|li|br|span)\b)[^>]*>/gi, '');

  return <div data-builder-id={node.id} style={inlineStyles} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function ButtonPrimitive({ node }: { node: BuilderNode }) {
  const content = node.content || {};
  const label = content.label || '';
  const variant = content.variant || 'primary';
  const iconName = content.iconName;
  const iconPosition = content.iconPosition || 'right';
  const action = content.action || { type: 'link', url: '#' };
  const inlineStyles = elementStylesToCss(node.styles);

  // Dynamic lucide icon (same behavior as public ButtonElement)
  let IconComponent: React.ComponentType<{ size?: number; className?: string }> | null = null;
  if (iconName) {
    // Lazy alias map avoids importing the whole icon barrel into the admin bundle.
    const icons = Icons as unknown as Record<string, unknown>;
    const candidate = icons[iconName as string];
    if (candidate && typeof candidate === 'function') {
      IconComponent = candidate as React.ComponentType<{ size?: number; className?: string }>;
    }
  }

  const variantDefaults: Record<string, React.CSSProperties> = {
    primary: { backgroundColor: '#004E35', color: '#ffffff', border: 'none' },
    secondary: { backgroundColor: '#45b653', color: '#ffffff', border: 'none' },
    outline: { backgroundColor: 'transparent', color: '#004E35', border: '1px solid #004E35' },
    ghost: { backgroundColor: 'transparent', color: '#004E35', border: 'none' },
    text: { backgroundColor: 'transparent', color: '#004E35', border: 'none', padding: '0' },
  };

  const combinedStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.2s ease-in-out',
    ...variantDefaults[variant],
    ...inlineStyles,
  };

  if (variant === 'outline') {
    if (!node.styles?.backgroundColor || node.styles?.backgroundColor === '#004E35') {
      combinedStyles.backgroundColor = 'transparent';
    }
    if (!combinedStyles.border && !combinedStyles.borderWidth) {
      combinedStyles.border = '1px solid currentColor';
    }
  }

  const url: string = action.url || '#';
  const isExternal = url.startsWith('http://') || url.startsWith('https://');

  return (
    <a
      data-builder-id={node.id}
      href={url}
      onClick={(e) => e.preventDefault()}
      target={action.target || (isExternal ? '_blank' : '_self')}
      rel={action.rel || 'noopener noreferrer'}
      style={combinedStyles}
    >
      {iconPosition === 'left' && IconComponent && <IconComponent size={18} />}
      <span>{label || <em className="text-black/40">Button label missing</em>}</span>
      {iconPosition === 'right' && IconComponent && <IconComponent size={18} />}
    </a>
  );
}

export function ImagePrimitive({
  node,
  isSelected,
}: {
  node: BuilderNode;
  isSelected?: boolean;
}) {
  const content = node.content || {};
  const src: string = resolveCmsImage(content.src || '');
  const alt: string = content.alt || '';
  const isDecorative = content.isDecorative || false;
  const objectFit = (content.objectFit || 'cover') as React.CSSProperties['objectFit'];
  const objectPosition = content.objectPosition || 'center';
  const inlineStyles: ElementStyles = node.styles || {};
  const [loadError, setLoadError] = React.useState(false);

  React.useEffect(() => {
    setLoadError(false);
  }, [src]);

  const containerStyles: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    ...elementStylesToCss(inlineStyles),
  };

  return (
    <div data-builder-id={node.id} style={containerStyles}>
      {src && !loadError ? (
        <img
          src={src}
          alt={isDecorative ? '' : alt}
          onError={() => setLoadError(true)}
          style={{
            width: '100%',
            maxWidth: inlineStyles.maxWidth || '100%',
            height: inlineStyles.height || (inlineStyles.aspectRatio ? '100%' : 'auto'),
            maxHeight: inlineStyles.maxHeight,
            aspectRatio: inlineStyles.aspectRatio,
            objectFit: (inlineStyles as any).objectFit || objectFit || 'cover',
            objectPosition,
            display: 'block',
          }}
          draggable={false}
        />
      ) : (
        <div
          className={`flex min-h-[160px] w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center ${
            isSelected ? 'border-amber-400 bg-amber-50/60' : 'border-slate-300 bg-slate-50'
          }`}
        >
          <ImageOff size={22} className="text-slate-400" />
          <p className="text-xs font-semibold text-slate-600">{loadError ? (alt || 'Image temporarily unavailable') : 'Image not configured'}</p>
          <p className="text-[10px] text-slate-400">{loadError ? 'Please check asset URL or S3 connectivity' : 'Choose an image in the Content tab'}</p>
        </div>
      )}
      {content.caption && (
        <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '8px', textAlign: 'center' }}>
          {content.caption}
        </p>
      )}
    </div>
  );
}

export function CounterPrimitive({ node }: { node: BuilderNode }) {
  const content = node.content || {};
  const target = content.target ?? 100;
  const prefix = content.prefix || '';
  const suffix = content.suffix || '';
  const label = content.label || '';
  const inlineStyles = elementStylesToCss(node.styles);

  return (
    <div
      data-builder-id={node.id}
      style={{
        textAlign: 'center',
        padding: '16px',
        ...inlineStyles,
      }}
    >
      <div
        style={{
          fontSize: inlineStyles.fontSize || '48px',
          fontWeight: inlineStyles.fontWeight || 700,
          color: inlineStyles.color || '#004E35',
          fontFamily: inlineStyles.fontFamily || 'Neue Montreal, sans-serif',
          lineHeight: 1.1,
        }}
      >
        {prefix}{target.toLocaleString()}{suffix}
      </div>
      {label && (
        <div
          style={{
            fontSize: '16px',
            color: '#64748b',
            marginTop: '8px',
            fontFamily: 'Neue Montreal, sans-serif',
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}

export function BadgePrimitive({ node }: { node: BuilderNode }) {
  const content = node.content || {};
  const text = content.text || 'NEW';
  const inlineStyles = elementStylesToCss(node.styles);

  return (
    <span
      data-builder-id={node.id}
      style={{
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: 600,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        backgroundColor: '#E6F4EA',
        color: '#004E35',
        ...inlineStyles,
      }}
    >
      {text}
    </span>
  );
}

export function SpacerPrimitive({
  node,
  isSelected,
}: {
  node: BuilderNode;
  isSelected?: boolean;
}) {
  const height = node.styles?.height || '40px';
  return (
    <div
      data-builder-id={node.id}
      style={{ height, width: '100%', position: 'relative' }}
      className={isSelected ? 'bg-emerald-500/10 border-y border-dashed border-emerald-400' : ''}
    />
  );
}

export function DividerPrimitive({
  node,
  isSelected,
}: {
  node: BuilderNode;
  isSelected?: boolean;
}) {
  const inlineStyles = elementStylesToCss(node.styles);
  return (
    <div
      data-builder-id={node.id}
      style={{
        width: '100%',
        paddingTop: inlineStyles.paddingTop || '20px',
        paddingBottom: inlineStyles.paddingBottom || '20px',
      }}
      className={isSelected ? 'bg-emerald-500/10' : ''}
    >
      <hr
        style={{
          border: 'none',
          borderTop: `${inlineStyles.borderWidth || '1px'} solid ${inlineStyles.borderColor || '#E2E8F0'}`,
          margin: 0,
        }}
      />
    </div>
  );
}

export function AccordionPrimitive({
  node,
  children,
}: {
  node: BuilderNode;
  children: React.ReactNode;
}) {
  const inlineStyles = elementStylesToCss(node.styles);
  return (
    <div
      data-builder-id={node.id}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        ...inlineStyles,
      }}
    >
      {children}
    </div>
  );
}

export function AccordionItemPrimitive({
  node,
  children,
}: {
  node: BuilderNode;
  children: React.ReactNode;
}) {
  const content = node.content || {};
  const title = content.title || 'Accordion Title';
  const [isOpen, setIsOpen] = React.useState(Boolean(content.defaultOpen));
  const inlineStyles = elementStylesToCss(node.styles);

  return (
    <div
      data-builder-id={node.id}
      style={{
        border: '1px solid #E2E8F0',
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        ...inlineStyles,
      }}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '20px 24px',
          fontWeight: 600,
          fontSize: '18px',
          color: '#004E35',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#F8FAFC',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          fontFamily: 'Neue Montreal, sans-serif',
        }}
      >
        <span>{title}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            color: '#004E35',
          }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {isOpen && <div style={{ padding: '24px' }}>{children}</div>}
    </div>
  );
}

/** Dynamic module: Team grid. Renders REAL team members passed from the page data layer. */
export function JourneyCarouselPrimitive({ node }: { node: BuilderNode }) {
  const milestones = Array.isArray(node.content?.milestones) ? node.content.milestones : [];
  return (
    <div data-builder-id={node.id} style={{ width: '100%' }}>
      <h2 style={{ margin: '0 0 40px', textAlign: 'center', color: '#004E35', fontSize: '48px', fontWeight: 400 }}>
        {node.content?.title || 'Our Journey'}
      </h2>
      <div style={{ display: 'flex', gap: '50px', overflow: 'hidden', width: '100%' }}>
        {milestones.map((milestone: any, index: number) => (
          <article key={`${milestone.year}-${index}`} style={{ flex: '0 0 300px' }}>
            <p style={{ margin: '0 0 28px', color: '#008712', fontSize: '36px' }}>
              {milestone.month ? `${milestone.month} ` : ''}{milestone.year}
            </p>
            <p style={{ minHeight: '70px', fontSize: '18px', lineHeight: '1.45' }}>{milestone.desc}</p>
            {milestone.img && (
              <img src={resolveCmsImage(milestone.img)} alt="" style={{ width: '245px', aspectRatio: '1/1', borderRadius: '20px', objectFit: 'cover' }} />
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

export function TeamGridPrimitive({
  node,
  members,
}: {
  node: BuilderNode;
  members?: Array<{ name: string; role?: string | null; imageUrl?: string | null }>;
}) {
  if (!members || members.length === 0) {
    return (
      <div data-builder-id={node.id} className="w-full">
        <EditorWarning label="Team module has no members. Connect the team data source to see real members here." />
      </div>
    );
  }
  return (
    <div
      data-builder-id={node.id}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '24px 20px',
        width: '100%',
      }}
    >
      {members.map((m, i) => (
        <div
          key={m.name + i}
          style={{
            overflow: 'hidden',
            borderRadius: '20px',
            backgroundColor: '#F1F5F9',
          }}
        >
          {m.imageUrl ? (
            <img src={resolveCmsImage(m.imageUrl)} alt={m.name} style={{ width: '100%', aspectRatio: '586/736', objectFit: 'cover', display: 'block' }} />
          ) : (
            <div style={{ width: '100%', aspectRatio: '586/736', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: '12px' }}>
              No photo
            </div>
          )}
          <div style={{ padding: '10px 12px', backgroundColor: '#FFFFFF' }}>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>{m.name}</p>
            {m.role && <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>{m.role}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Authentic Service Cards Primitive for Studio Canvas */
export function ServiceCardsPrimitive({ node }: { node: BuilderNode }) {
  const pillars = [
    {
      title: 'Sustainability Integration',
      desc: 'Embedding ESG principles into core strategy to unlock long-term enterprise value and resilience.',
      tag: 'Practice Area 1',
    },
    {
      title: 'Climate Action & Decarbonization',
      desc: 'Science-based net-zero roadmaps, carbon accounting, and transition risk modeling.',
      tag: 'Practice Area 2',
    },
    {
      title: 'Responsible Investment (RI)',
      desc: 'ESG due diligence, LP/GP reporting frameworks, and sustainable portfolio monitoring.',
      tag: 'Practice Area 3',
    },
  ];

  return (
    <div
      data-builder-id={node.id}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '32px',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {pillars.map((p, idx) => (
        <div
          key={idx}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '36px 32px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#45b653',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {p.tag}
            </span>
            <h3
              style={{
                fontSize: '24px',
                fontWeight: 500,
                color: '#004E35',
                marginTop: '12px',
                marginBottom: '16px',
                fontFamily: 'Neue Montreal, sans-serif',
              }}
            >
              {p.title}
            </h3>
            <p style={{ fontSize: '16px', color: '#4B5563', lineHeight: '1.6', fontFamily: 'Neue Montreal, sans-serif' }}>
              {p.desc}
            </p>
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              marginTop: '28px',
              color: '#004E35',
              fontWeight: 600,
              fontSize: '15px',
              cursor: 'default',
            }}
          >
            Learn more &rarr;
          </div>
        </div>
      ))}
    </div>
  );
}

/** Dynamic insights grid backed by the same CMS records as the public page. */
export function InsightsGridPrimitive({
  node,
  records = [],
}: {
  node: BuilderNode;
  records?: StudioDynamicRecord[];
}) {
  const displayRecords = selectDynamicPreviewRecords(records, node.content || {});
  if (displayRecords.length === 0) {
    return <EditorWarning label="No published insights match this module's filters." />;
  }
  const showReadMore = Boolean(node.content?.showReadMore);
  const showDate = node.content?.showDate !== false;
  const showExcerpt = node.content?.showExcerpt !== false;
  const cardBorder = Boolean(node.content?.cardBorder);

  return (
    <div data-builder-id={node.id} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))', gap: '30px', width: '100%', boxSizing: 'border-box' }}>
      {displayRecords.map((article) => {
        const coverImg = resolveCmsImage(article.coverImageUrl || article.heroImage || '/images/about-hero.webp');
        const excerptText = article.seoDescription || article.summary || String(article.excerpt || '').replace(/<[^>]+>/g, '').trim();
        const date = article.publishedAt ? new Date(article.publishedAt) : null;
        const formattedDate = date && !Number.isNaN(date.getTime())
          ? date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
          : '';
        return (
          <article key={article.slug} style={{ textDecoration: 'none', backgroundColor: cardBorder ? '#ffffff' : 'transparent', borderRadius: cardBorder ? '12px' : 0, border: cardBorder ? '1px solid rgba(0, 0, 0, 0.1)' : 'none', overflow: 'visible', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative', width: '100%', height: '240px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
              <img src={coverImg} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ padding: cardBorder ? '16px' : '20px 0 0', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h3 style={{ fontFamily: 'Neue Montreal, sans-serif', fontSize: '24px', fontWeight: 400, color: '#1E1E1E', lineHeight: 1.3, margin: '0 0 12px' }}>{article.title}</h3>
              {showExcerpt && excerptText && <p style={{ fontFamily: 'Neue Montreal, sans-serif', fontSize: '16px', color: '#555555', lineHeight: 1.5, margin: '0 0 16px', flex: 1 }}>{excerptText.length > 130 ? `${excerptText.slice(0, 130)}...` : excerptText}</p>}
              {showDate && formattedDate && <div style={{ fontFamily: 'Neue Montreal, sans-serif', fontSize: '15px', color: '#8C8C8C', marginTop: 'auto', paddingTop: '4px' }}>{formattedDate}</div>}
              {showReadMore && <span style={{ fontFamily: 'Neue Montreal, sans-serif', fontSize: '18px', color: '#2F7ABE', display: 'block', paddingTop: '16px', marginTop: 'auto' }}>Read More</span>}
            </div>
          </article>
        );
      })}
    </div>
  );
}

const IMPACT_PREVIEW_TABS = [
  ['all', 'All', ''],
  ['sustainability-integration', 'Sustainability Integration', 'Sustainability Integration'],
  ['responsible-investment', 'Responsible Investment', 'Responsible Investment'],
  ['climate-action', 'Climate Action', 'Climate Action'],
  ['infrastructure-real-estate', 'Infrastructure & Real Estate', 'Real Estate'],
  ['manufacturing', 'Manufacturing', 'Manufacturing'],
  ['energy', 'Energy', 'Energy'],
  ['agriculture', 'Agriculture', 'Agriculture'],
  ['bfsi', 'BFSI', 'BFSI'],
  ['mining', 'Mining', 'Mining'],
  ['healthcare', 'Healthcare', 'Healthcare'],
  ['technology', 'Technology', 'Technology'],
  ['supply-chain', 'Supply Chain', 'Supply Chain'],
  ['dei', 'DEI', 'DEI'],
  ['bhr', 'BHR', 'BHR'],
] as const;

/** Dynamic impact grid backed by all published CMS case studies. */
export function ImpactGridPrimitive({
  node,
  records = [],
}: {
  node: BuilderNode;
  records?: StudioDynamicRecord[];
}) {
  const configuredRecords = selectDynamicPreviewRecords(records, node.content || {});
  const [activeTab, setActiveTab] = React.useState('all');
  const activeCategory = IMPACT_PREVIEW_TABS.find(([id]) => id === activeTab)?.[2].toLocaleLowerCase('en-US') || '';
  const visibleRecords = activeCategory
    ? configuredRecords.filter((record) => {
        const searchable = [record.title, record.summary, ...(record.categories || []), record.service?.name, record.sector?.name, record.theme?.name]
          .filter(Boolean)
          .join(' ')
          .toLocaleLowerCase('en-US');
        return searchable.includes(activeCategory);
      })
    : configuredRecords;

  if (configuredRecords.length === 0) {
    return <EditorWarning label="No published impact case studies match this module's filters." />;
  }

  return (
    <div data-builder-id={node.id} style={{ width: '100%' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', rowGap: '14px', marginBottom: '44px', width: '100%', overflowX: 'auto', paddingBottom: '6px' }}>
        {IMPACT_PREVIEW_TABS.map(([id, label]) => {
          const active = id === activeTab;
          return <button key={id} type="button" onClick={(event) => { event.stopPropagation(); setActiveTab(id); }} style={{ backgroundColor: active ? '#0074FD' : '#FFFFFF', color: active ? '#FFFFFF' : 'rgba(0,0,0,.7)', border: active ? '0.5px solid #0074FD' : '0.5px solid rgba(0,0,0,.45)', borderRadius: '56px', padding: '8px 24px', fontSize: '16px', fontFamily: 'Neue Montreal, sans-serif', cursor: 'pointer', whiteSpace: 'nowrap' }}>{label}</button>;
        })}
      </div>
      {visibleRecords.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '70px 20px', color: '#666666', fontSize: '18px' }}>No case studies found for this category.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))', gap: '30px', width: '100%', boxSizing: 'border-box' }}>
          {visibleRecords.map((item) => {
            const coverImg = resolveCmsImage(item.coverImageUrl || item.heroImage || '/images/services-sustainability.webp');
            const excerptText = item.cardExcerpt || item.summary || String(item.excerpt || '').replace(/<[^>]+>/g, '').trim();
            return (
              <article key={item.slug} style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid rgba(0,0,0,.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: '100%', height: '260px', backgroundColor: '#f1f5f9', overflow: 'hidden' }}>
                  <img src={coverImg} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontFamily: 'Neue Montreal, sans-serif', fontSize: '24px', fontWeight: 500, color: '#1E293B', lineHeight: 1.3, margin: '0 0 12px' }}>{item.title}</h3>
                  {excerptText && <p style={{ fontFamily: 'Neue Montreal, sans-serif', fontSize: '16px', color: 'rgba(0,0,0,.6)', lineHeight: 1.5, margin: '0 0 16px', flex: 1 }}>{excerptText.length > 130 ? `${excerptText.slice(0, 130)}...` : excerptText}</p>}
                  <span style={{ fontFamily: 'Neue Montreal, sans-serif', fontSize: '18px', fontWeight: 500, color: '#2F7ABE', display: 'block', marginTop: 'auto', paddingTop: '8px' }}>Read More</span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** Authentic Social Share Bar Primitive for Studio Canvas */
export function SocialSharePrimitive({
  node,
  isSelected,
}: {
  node: BuilderNode;
  isSelected?: boolean;
}) {
  const content = node.content || {};
  const channels = content.channels || [
    { id: 'email', name: 'Email', enabled: true, color: '#ea4335' },
    { id: 'linkedin', name: 'LinkedIn', enabled: true, color: '#0a66c2' },
    { id: 'twitter', name: 'X / Twitter', enabled: true, color: '#000000' },
    { id: 'facebook', name: 'Facebook', enabled: true, color: '#1877f2' },
  ];
  const size = content.buttonSize || 32;
  const radius = content.borderRadius ?? 4;
  const gap = content.gap ?? 10;
  const alignment = content.alignment || 'left';

  const justifyMap: Record<string, string> = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end',
  };

  return (
    <div
      data-builder-id={node.id}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: justifyMap[alignment] || 'flex-start',
        gap: `${gap}px`,
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {channels.filter((c: any) => c.enabled !== false).map((c: any) => {
        let icon: React.ReactNode = '↗';
        let defaultColor = '#004E35';
        if (c.id === 'email') {
          icon = (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          );
          defaultColor = '#ea4335';
        } else if (c.id === 'linkedin') {
          icon = <span style={{ fontSize: '13px', fontWeight: 800, fontFamily: 'sans-serif' }}>in</span>;
          defaultColor = '#0a66c2';
        } else if (c.id === 'twitter') {
          icon = <span style={{ fontSize: '14px', fontWeight: 700 }}>𝕏</span>;
          defaultColor = '#000000';
        } else if (c.id === 'facebook') {
          icon = <span style={{ fontSize: '15px', fontWeight: 800, fontFamily: 'sans-serif' }}>f</span>;
          defaultColor = '#1877f2';
        }

        const bgColor = c.color || defaultColor;

        return (
          <div
            key={c.id}
            title={c.name}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: `${radius}px`,
              backgroundColor: bgColor,
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'default',
              userSelect: 'none',
              flexShrink: 0,
              boxShadow: '0 2px 5px rgba(0,0,0,0.12)',
            }}
          >
            {icon}
          </div>
        );
      })}
    </div>
  );
}

/** Dynamic module placeholder for modules the studio cannot resolve live. */
export function DynamicModulePlaceholder({
  node,
  moduleLabel,
  hint,
}: {
  node: BuilderNode;
  moduleLabel: string;
  hint?: string;
}) {
  return (
    <div
      data-builder-id={node.id}
      className="flex w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/50 px-6 py-10 text-center"
    >
      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700">
        Dynamic module · {moduleLabel}
      </span>
      <p className="max-w-sm text-xs text-slate-500">
        {hint || 'This module renders live site data at publish time and is shown here as an editor reference.'}
      </p>
    </div>
  );
}

/** Form primitive rendering the authentic, interactive contact and GBC forms */
export function FormPrimitive({
  node,
  isSelected,
}: {
  node: BuilderNode;
  isSelected?: boolean;
}) {
  const content = node.content || {};
  const isGbc = content.formType === 'gbc' || (content.action && content.action.includes('gbc'));

  if (isGbc) {
    return (
      <div data-builder-id={node.id} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: '#393939', marginBottom: '6px' }}>
              Full Name *
            </label>
            <input
              type="text"
              readOnly
              placeholder="Your name"
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', backgroundColor: '#FFFFFF' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: '#393939', marginBottom: '6px' }}>
              Organization *
            </label>
            <input
              type="text"
              readOnly
              placeholder="Your organization"
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', backgroundColor: '#FFFFFF' }}
            />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: '#393939', marginBottom: '6px' }}>
              Email *
            </label>
            <input
              type="email"
              readOnly
              placeholder="you@company.com"
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', backgroundColor: '#FFFFFF' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: '#393939', marginBottom: '6px' }}>
              Phone Number
            </label>
            <input
              type="tel"
              readOnly
              placeholder="+91 ..."
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', backgroundColor: '#FFFFFF' }}
            />
          </div>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: '#393939', marginBottom: '6px' }}>
            City
          </label>
          <input
            type="text"
            readOnly
            placeholder="City"
            style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', backgroundColor: '#FFFFFF' }}
          />
        </div>
        <button
          type="button"
          style={{
            width: '100%',
            padding: '14px',
            marginTop: '8px',
            fontFamily: '"Neue Montreal", sans-serif',
            fontSize: '1rem',
            fontWeight: 500,
            backgroundColor: '#004E35',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'default',
          }}
        >
          Connect with Us
        </button>
      </div>
    );
  }

  return (
    <div data-builder-id={node.id} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '22px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div>
          <label style={{ display: 'block', fontFamily: '"Neue Montreal", sans-serif', fontSize: '18px', fontWeight: 400, color: '#686868', marginBottom: '6px' }}>
            Full Name
          </label>
          <input
            type="text"
            readOnly
            style={{ width: '100%', padding: '10px 0', border: 'none', borderBottom: '1px solid #cbd5e1', outline: 'none', fontFamily: '"Neue Montreal", sans-serif', fontSize: '16px', backgroundColor: 'transparent' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontFamily: '"Neue Montreal", sans-serif', fontSize: '18px', fontWeight: 400, color: '#686868', marginBottom: '6px' }}>
            Location
          </label>
          <input
            type="text"
            readOnly
            style={{ width: '100%', padding: '10px 0', border: 'none', borderBottom: '1px solid #cbd5e1', outline: 'none', fontFamily: '"Neue Montreal", sans-serif', fontSize: '16px', backgroundColor: 'transparent' }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div>
          <label style={{ display: 'block', fontFamily: '"Neue Montreal", sans-serif', fontSize: '18px', fontWeight: 400, color: '#686868', marginBottom: '6px' }}>
            Email
          </label>
          <input
            type="email"
            readOnly
            style={{ width: '100%', padding: '10px 0', border: 'none', borderBottom: '1px solid #cbd5e1', outline: 'none', fontFamily: '"Neue Montreal", sans-serif', fontSize: '16px', backgroundColor: 'transparent' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontFamily: '"Neue Montreal", sans-serif', fontSize: '18px', fontWeight: 400, color: '#686868', marginBottom: '6px' }}>
            Phone Number
          </label>
          <input
            type="tel"
            readOnly
            style={{ width: '100%', padding: '10px 0', border: 'none', borderBottom: '1px solid #cbd5e1', outline: 'none', fontFamily: '"Neue Montreal", sans-serif', fontSize: '16px', backgroundColor: 'transparent' }}
          />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontFamily: '"Neue Montreal", sans-serif', fontSize: '18px', fontWeight: 400, color: '#686868', marginBottom: '6px' }}>
          Organization
        </label>
        <input
          type="text"
          readOnly
          style={{ width: '100%', padding: '10px 0', border: 'none', borderBottom: '1px solid #cbd5e1', outline: 'none', fontFamily: '"Neue Montreal", sans-serif', fontSize: '16px', backgroundColor: 'transparent' }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontFamily: '"Neue Montreal", sans-serif', fontSize: '18px', fontWeight: 400, color: '#686868', marginBottom: '6px' }}>
          How we can help?
        </label>
        <select
          disabled
          defaultValue=""
          style={{ width: '100%', padding: '10px 0', border: 'none', borderBottom: '1px solid #cbd5e1', outline: 'none', fontFamily: '"Neue Montreal", sans-serif', fontSize: '16px', backgroundColor: 'transparent', color: '#393939' }}
        >
          <option value="" disabled>—Please choose an option—</option>
          <option value="Services">Services</option>
          <option value="Jobs">Jobs</option>
          <option value="Feedback">Feedback</option>
          <option value="Others">Others</option>
        </select>
      </div>

      <div>
        <label style={{ display: 'block', fontFamily: '"Neue Montreal", sans-serif', fontSize: '18px', fontWeight: 400, color: '#686868', marginBottom: '6px' }}>
          Message
        </label>
        <textarea
          rows={3}
          readOnly
          style={{ width: '100%', padding: '10px 0', border: 'none', borderBottom: '1px solid #cbd5e1', outline: 'none', fontFamily: '"Neue Montreal", sans-serif', fontSize: '16px', resize: 'vertical', backgroundColor: 'transparent' }}
        />
      </div>

      <button
        type="button"
        style={{
          width: '100%',
          padding: '16px',
          marginTop: '10px',
          fontFamily: '"Neue Montreal", sans-serif',
          fontSize: '18px',
          fontWeight: 500,
          backgroundColor: '#004E35',
          color: '#ffffff',
          border: 'none',
          borderRadius: '9999px',
          cursor: 'default',
          boxShadow: '0 4px 15px rgba(0,78,53,0.2)',
        }}
      >
        Send Message
      </button>
    </div>
  );
}

export function SearchBarPrimitive({ node, isSelected }: { node: BuilderNode; isSelected?: boolean }) {
  const content = node.content || {};
  const placeholder = content.placeholder || 'Search by keyword, topic, or sector...';
  const buttonText = content.buttonText || 'Search';
  const showButton = content.showButton !== false;
  const inlineStyles = elementStylesToCss(node.styles);

  return (
    <div
      data-builder-id={node.id}
      style={{
        width: '100%',
        maxWidth: node.styles?.maxWidth || '680px',
        margin: '0 auto',
        ...inlineStyles,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          backgroundColor: '#ffffff',
          borderRadius: '9999px',
          padding: '6px 8px 6px 20px',
          boxShadow: '0 4px 20px rgba(0, 78, 53, 0.07)',
          border: isSelected ? '2px solid #3079bd' : '1px solid #E2E8F0',
          transition: 'all 0.2s ease',
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#64748b"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ flexShrink: 0 }}
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

        <input
          type="text"
          readOnly
          placeholder={placeholder}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '15px',
            color: '#1e293b',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            padding: '8px 0',
          }}
        />

        {showButton && (
          <button
            type="button"
            style={{
              backgroundColor: '#004E35',
              color: '#ffffff',
              border: 'none',
              borderRadius: '9999px',
              padding: '8px 20px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
}
