import React from 'react';
import { BuilderNode } from '@envint/shared';
import { elementStylesToCss } from '../style-utils';

export function HeadingElement({ node, isFirstH1 = true }: { node: BuilderNode; isFirstH1?: boolean }) {
  const content = node.content || {};
  let tag = (content.tag || 'h2').toLowerCase();
  // SEO Safety: Demote secondary H1s to H2 to guarantee single H1 per page
  if (tag === 'h1' && !isFirstH1) {
    tag = 'h2';
  }
  const text = content.text || 'Heading';
  const inlineStyles = elementStylesToCss(node.styles);

  const TagName = (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag) ? tag : 'h2') as keyof React.JSX.IntrinsicElements;

  return (
    <TagName data-builder-id={node.id} style={inlineStyles}>
      {text}
    </TagName>
  );
}
