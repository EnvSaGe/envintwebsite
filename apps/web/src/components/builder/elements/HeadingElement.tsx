import React from 'react';
import { BuilderNode } from '@envint/shared';
import { elementStylesToCss } from '../style-utils';

export function HeadingElement({ node }: { node: BuilderNode }) {
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
