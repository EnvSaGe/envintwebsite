import React from 'react';
import { BuilderNode } from '@envint/shared';
import { elementStylesToCss } from '../style-utils';

export function SectionElement({
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
      <div style={{ position: 'relative', zIndex: 2, width: '100%' }}>
        {children}
      </div>
    </section>
  );
}
