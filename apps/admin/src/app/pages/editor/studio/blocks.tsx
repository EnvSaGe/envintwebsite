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

  const containerStyles: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    width: elementStylesToCss(inlineStyles).width || '100%',
    maxWidth: inlineStyles.maxWidth,
    height: inlineStyles.height || 'auto',
    minHeight: inlineStyles.minHeight,
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
      {src ? (
        <img
          src={src}
          alt={isDecorative ? '' : alt}
          style={{
            width: '100%',
            height: inlineStyles.height || 'auto',
            objectFit,
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
          <p className="text-xs font-semibold text-slate-600">Image not configured</p>
          <p className="text-[10px] text-slate-400">Choose an image in the Content tab</p>
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
  // Schema defaults match the public CounterElement exactly.
  const value = content.value || '500+';
  const label = content.label || 'Engagements Delivered';
  const inlineStyles = elementStylesToCss(node.styles);

  return (
    <div data-builder-id={node.id} style={{ textAlign: 'center', ...inlineStyles }}>
      <div style={{ fontSize: '48px', fontWeight: 600, color: '#004E35', lineHeight: 1.1 }}>
        {content.prefix ? `${content.prefix} ` : ''}
        {value}
        {content.suffix ? ` ${content.suffix}` : ''}
      </div>
      <div style={{ fontSize: '15px', color: '#6B7280', marginTop: '8px', fontWeight: 500 }}>{label}</div>
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

export function SpacerPrimitive({ node, isSelected }: { node: BuilderNode; isSelected?: boolean }) {
  const height = node.styles?.height || '48px';
  return (
    <div
      data-builder-id={node.id}
      style={{
        height,
        width: '100%',
        position: 'relative',
      }}
    >
      {isSelected && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded border border-dashed border-blue-400/70 bg-blue-50/40">
          <span className="rounded bg-blue-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
            Spacer · {height}
          </span>
        </div>
      )}
    </div>
  );
}

export function DividerPrimitive({ node, isSelected }: { node: BuilderNode; isSelected?: boolean }) {
  const inlineStyles = elementStylesToCss(node.styles);
  return (
    <div
      data-builder-id={node.id}
      style={{
        borderTop: '1px solid #E5E7EB',
        margin: '32px 0',
        width: '100%',
        position: 'relative',
        ...inlineStyles,
      }}
    >
      {isSelected && (
        <span className="absolute right-0 -top-3 rounded bg-blue-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
          Divider
        </span>
      )}
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
    <div data-builder-id={node.id} style={{ width: '100%', position: 'relative', ...inlineStyles }}>
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
  const title = content.title || 'Accordion Item';
  const [isOpen, setIsOpen] = React.useState(Boolean(content.defaultOpen));
  const inlineStyles = elementStylesToCss(node.styles);

  return (
    <div
      data-builder-id={node.id}
      style={{ borderBottom: '1px solid #E5E7EB', padding: '16px 0', position: 'relative', ...inlineStyles }}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          background: 'none',
          border: 'none',
          textAlign: 'left',
          cursor: 'pointer',
          padding: '8px 0',
          fontSize: '18px',
          fontWeight: 600,
          color: '#111827',
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
      {isOpen && <div style={{ paddingTop: '12px' }}>{children}</div>}
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
