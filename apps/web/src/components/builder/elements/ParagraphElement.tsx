import React from 'react';
import sanitizeHtml from 'sanitize-html';
import { BuilderNode } from '@envint/shared';
import { elementStylesToCss } from '../style-utils';

const SAFE_TAGS = ['p', 'b', 'strong', 'i', 'em', 'u', 'a', 'ul', 'ol', 'li', 'br', 'span'];

export function ParagraphElement({ node }: { node: BuilderNode }) {
  const content = node.content || {};
  const rawHtml = content.html || (content.text ? `<p>${content.text}</p>` : '<p></p>');
  const inlineStyles = elementStylesToCss(node.styles);

  const cleanHtml = sanitizeHtml(rawHtml, {
    allowedTags: SAFE_TAGS,
    allowedAttributes: {
      a: ['href', 'target', 'rel', 'class'],
      span: ['class', 'style'],
    },
    disallowedTagsMode: 'discard',
  });

  return (
    <div
      data-builder-id={node.id}
      style={inlineStyles}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
}
