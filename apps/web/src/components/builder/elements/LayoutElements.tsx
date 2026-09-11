import React from 'react';
import { BuilderNode } from '@envint/shared';
import { elementStylesToCss } from '../style-utils';

export function GridElement({
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
        ...inlineStyles,
      }}
    >
      {children}
    </div>
  );
}

export function FlexElement({
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
        ...inlineStyles,
      }}
    >
      {children}
    </div>
  );
}
