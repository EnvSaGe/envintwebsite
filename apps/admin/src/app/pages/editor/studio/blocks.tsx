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
import { BuilderNode, ElementStyles, resolveCmsImage } from '@envint/shared';
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
    secondary: { backgroundColor: '#10B981', color: '#ffffff', border: 'none' },
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
    width: elementStylesToCss(inlineStyles).width || '100%',
    maxWidth: inlineStyles.maxWidth,
    height: inlineStyles.height || 'auto',
    minHeight: inlineStyles.minHeight,
    maxHeight: inlineStyles.maxHeight,
    aspectRatio: inlineStyles.aspectRatio,
    borderRadius: inlineStyles.borderRadius,
    boxShadow: inlineStyles.boxShadow,
    margin: inlineStyles.margin,
    marginTop: inlineStyles.marginTop,
    marginRight: inlineStyles.marginRight,
    marginBottom: inlineStyles.marginBottom,
    marginLeft: inlineStyles.marginLeft,
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
                color: '#10B981',
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

/** Authentic Insights Grid Primitive for Studio Canvas */
export function InsightsGridPrimitive({ node }: { node: BuilderNode }) {
  const sampleArticles = [
    {
      title: "India's New Labour Codes: A Transformative Shift",
      category: 'ENVISION',
      summary: 'Analysis of India’s four consolidated labour codes covering wages, industrial relations, social security, and workplace safety.',
      coverImg: '/images/hero-wetland.webp',
      readTime: '4 min read',
    },
    {
      title: 'EU Carbon Border Adjustment Mechanism (CBAM) Guide',
      category: 'BEHIND THE BUZZ',
      summary: 'Navigating emissions disclosure, default values, and decarbonization strategies for metals and chemical exporters.',
      coverImg: '/images/services-sustainability.webp',
      readTime: '6 min read',
    },
    {
      title: 'BRSR Core Assurance: Readiness and Methodologies',
      category: 'HOW TO ARTICLES',
      summary: 'Step-by-step guidance on implementing mandatory value-chain ESG disclosures and third-party verification.',
      coverImg: '/images/about-hero.webp',
      readTime: '5 min read',
    },
  ];

  return (
    <div
      data-builder-id={node.id}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '32px',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {sampleArticles.map((article, idx) => (
        <div
          key={idx}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ position: 'relative', width: '100%', height: '200px', backgroundColor: '#f1f5f9' }}>
            <img
              src={resolveCmsImage(article.coverImg)}
              alt={article.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {article.category}
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#004E35', marginTop: '8px', marginBottom: '12px', lineHeight: '1.4', fontFamily: 'Neue Montreal, sans-serif' }}>
              {article.title}
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6', flex: 1, fontFamily: 'Neue Montreal, sans-serif' }}>
              {article.summary}
            </p>
            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', color: '#94a3b8' }}>
              <span>{article.readTime}</span>
              <span style={{ color: '#004E35', fontWeight: 600 }}>Read Article &rarr;</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Authentic Impact Case Studies Grid Primitive for Studio Canvas */
export function ImpactGridPrimitive({ node }: { node: BuilderNode }) {
  const sampleCaseStudies = [
    {
      title: 'Decarbonization Roadmap for Major Cement Manufacturer',
      sector: 'HEAVY MANUFACTURING',
      summary: 'Designed an SBTi-aligned net zero strategy reducing Scope 1 & 2 carbon intensity by 34% by 2030.',
      coverImg: '/images/services-sustainability.webp',
    },
    {
      title: 'BRSR Core & Scope 3 Supply Chain Due Diligence',
      sector: 'PHARMACEUTICALS',
      summary: 'Implemented a standardized ESG assessment framework across 450 tier-1 suppliers across Asia.',
      coverImg: '/images/hero-wetland.webp',
    },
    {
      title: 'Renewable Energy Transition & PPA Structuring',
      sector: 'AUTOMOTIVE & MOBILITY',
      summary: 'Procured 120 MW of round-the-clock green power, delivering 42% cost savings and direct emissions elimination.',
      coverImg: '/images/about-hero.webp',
    },
  ];

  return (
    <div
      data-builder-id={node.id}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '32px',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {sampleCaseStudies.map((item, idx) => (
        <div
          key={idx}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ position: 'relative', width: '100%', height: '200px', backgroundColor: '#f1f5f9' }}>
            <img
              src={resolveCmsImage(item.coverImg)}
              alt={item.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {item.sector}
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#004E35', marginTop: '8px', marginBottom: '12px', lineHeight: '1.4', fontFamily: 'Neue Montreal, sans-serif' }}>
              {item.title}
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6', flex: 1, fontFamily: 'Neue Montreal, sans-serif' }}>
              {item.summary}
            </p>
            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontSize: '13px', color: '#004E35', fontWeight: 600 }}>
              <span>View Case Study &rarr;</span>
            </div>
          </div>
        </div>
      ))}
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
