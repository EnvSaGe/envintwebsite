'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { BuilderNode } from '@envint/shared';
import { elementStylesToCss } from '../style-utils';

export function CounterElement({ node }: { node: BuilderNode }) {
  const content = node.content || {};
  const value = content.value || '500+';
  const label = content.label || 'Metric Label';
  const inlineStyles = elementStylesToCss(node.styles);

  return (
    <div data-builder-id={node.id} style={{ textAlign: 'center', ...inlineStyles }}>
      <div style={{ fontSize: '48px', fontWeight: 600, color: '#004E35', lineHeight: 1.1 }}>
        {value}
      </div>
      <div style={{ fontSize: '15px', color: '#6B7280', marginTop: '8px', fontWeight: 500 }}>
        {label}
      </div>
    </div>
  );
}

export function BadgeElement({ node }: { node: BuilderNode }) {
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

export function SpacerElement({ node }: { node: BuilderNode }) {
  const height = node.styles?.height || '48px';
  return <div data-builder-id={node.id} style={{ height, width: '100%' }} />;
}

export function DividerElement({ node }: { node: BuilderNode }) {
  const inlineStyles = elementStylesToCss(node.styles);
  return (
    <hr
      data-builder-id={node.id}
      style={{
        border: 'none',
        borderTop: '1px solid #E5E7EB',
        margin: '32px 0',
        width: '100%',
        ...inlineStyles,
      }}
    />
  );
}

export function AccordionElement({
  node,
  children,
}: {
  node: BuilderNode;
  children: React.ReactNode;
}) {
  const inlineStyles = elementStylesToCss(node.styles);
  return (
    <div data-builder-id={node.id} style={{ width: '100%', ...inlineStyles }}>
      {children}
    </div>
  );
}

export function AccordionItemElement({
  node,
  children,
}: {
  node: BuilderNode;
  children: React.ReactNode;
}) {
  const content = node.content || {};
  const title = content.title || 'Accordion Item';
  const [isOpen, setIsOpen] = useState(Boolean(content.defaultOpen));
  const inlineStyles = elementStylesToCss(node.styles);

  return (
    <div
      data-builder-id={node.id}
      style={{
        borderBottom: '1px solid #E5E7EB',
        padding: '16px 0',
        ...inlineStyles,
      }}
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
        <ChevronDown
          size={20}
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            color: '#004E35',
          }}
        />
      </button>
      {isOpen && <div style={{ paddingTop: '12px' }}>{children}</div>}
    </div>
  );
}
