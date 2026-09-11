import React from 'react';
import Link from 'next/link';
import * as Icons from 'lucide-react';
import { BuilderNode } from '@envint/shared';
import { elementStylesToCss } from '../style-utils';

export function ButtonElement({ node }: { node: BuilderNode }) {
  const content = node.content || {};
  const label = content.label || 'Click Here';
  const variant = content.variant || 'primary';
  const iconName = content.iconName;
  const iconPosition = content.iconPosition || 'right';
  const action = content.action || { type: 'link', url: '#' };
  const inlineStyles = elementStylesToCss(node.styles);

  // Dynamic Lucide Icon
  let IconComponent: React.ComponentType<{ size?: number; className?: string }> | null = null;
  if (iconName && (Icons as any)[iconName]) {
    IconComponent = (Icons as any)[iconName];
  }

  // Base variant defaults
  const variantDefaults: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: '#004E35',
      color: '#ffffff',
      border: 'none',
    },
    secondary: {
      backgroundColor: '#10B981',
      color: '#ffffff',
      border: 'none',
    },
    outline: {
      backgroundColor: 'transparent',
      color: '#004E35',
      border: '1px solid #004E35',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: '#004E35',
      border: 'none',
    },
    text: {
      backgroundColor: 'transparent',
      color: '#004E35',
      border: 'none',
      padding: '0',
    },
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

  const innerContent = (
    <>
      {iconPosition === 'left' && IconComponent && <IconComponent size={18} />}
      <span>{label}</span>
      {iconPosition === 'right' && IconComponent && <IconComponent size={18} />}
    </>
  );

  const url = action.url || '#';
  const isExternal = url.startsWith('http://') || url.startsWith('https://');
  const isAnchor = url.startsWith('#');
  const isMailOrTel = url.startsWith('mailto:') || url.startsWith('tel:');

  if (isExternal || isMailOrTel) {
    return (
      <a
        data-builder-id={node.id}
        href={url}
        target={action.target || (isExternal ? '_blank' : '_self')}
        rel={action.rel || 'noopener noreferrer'}
        style={combinedStyles}
      >
        {innerContent}
      </a>
    );
  }

  if (isAnchor) {
    return (
      <a data-builder-id={node.id} href={url} style={combinedStyles}>
        {innerContent}
      </a>
    );
  }

  return (
    <Link
      data-builder-id={node.id}
      href={url}
      target={action.target || '_self'}
      style={combinedStyles}
    >
      {innerContent}
    </Link>
  );
}
