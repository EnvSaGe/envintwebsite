import React from 'react';
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

  return (
    <div
      data-builder-id={node.id}
      style={{
        boxSizing: 'border-box',
        ...inlineStyles,
      }}
    >
      {children}
    </div>
  );
}
