import React from 'react';
import Link from 'next/link';
import { BuilderNode } from '@envint/shared';
import { elementStylesToCss } from '../style-utils';

export function ContainerElement({
  node,
  children,
}: {
  node: BuilderNode;
  children: React.ReactNode;
}) {
  const inlineStyles = elementStylesToCss(node.styles);

  // Check if container acts as a clickable card/link
  const linkAction = node.actions?.find((a) => a.type === 'link');
  const href =
    linkAction?.url ||
    node.content?.url ||
    node.content?.href ||
    node.content?.linkUrl ||
    node.content?.action?.url ||
    (node.styles as any)?.linkUrl;

  const className = [
    node.content?.className,
    href ? 'builder-clickable-card' : '',
  ]
    .filter(Boolean)
    .join(' ');

  if (href) {
    const isExternal = href.startsWith('http://') || href.startsWith('https://');
    const target =
      linkAction?.target ||
      node.content?.target ||
      node.content?.action?.target ||
      (isExternal ? '_blank' : undefined);
    const rel =
      linkAction?.rel ||
      node.content?.action?.rel ||
      (target === '_blank' ? 'noopener noreferrer' : undefined);

    return (
      <Link
        href={href}
        data-builder-id={node.id}
        className={className || undefined}
        target={target}
        rel={rel}
        style={{
          boxSizing: 'border-box',
          textDecoration: 'none',
          color: 'inherit',
          display: 'block',
          cursor: 'pointer',
          ...inlineStyles,
        }}
      >
        {children}
      </Link>
    );
  }

  return (
    <div
      data-builder-id={node.id}
      className={className || undefined}
      style={{
        boxSizing: 'border-box',
        ...inlineStyles,
      }}
    >
      {children}
    </div>
  );
}
