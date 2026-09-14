import React from 'react';
import sanitizeHtml from 'sanitize-html';
import { BuilderNode } from '@envint/shared';
import { elementStylesToCss } from '../style-utils';

const SAFE_TAGS = [
  'p', 'b', 'strong', 'i', 'em', 'u', 'a', 'ul', 'ol', 'li', 'br', 'span',
  'h2', 'h3', 'h4', 'blockquote', 'figure', 'figcaption', 'img', 'hr',
];

export function ParagraphElement({ node }: { node: BuilderNode }) {
  const content = node.content || {};
  const rawHtml = content.html || (content.text ? `<p>${content.text}</p>` : '<p></p>');
  const inlineStyles = elementStylesToCss(node.styles);

  const cleanHtml = sanitizeHtml(rawHtml, {
    allowedTags: SAFE_TAGS,
    allowedAttributes: {
      a: ['href', 'target', 'rel', 'class'],
      span: ['class', 'style'],
      img: ['src', 'alt', 'width', 'height', 'loading'],
      figure: ['class'],
      figcaption: ['class'],
    },
    disallowedTagsMode: 'discard',
  });

  return (
    <div
      data-builder-id={node.id}
      className={node.type === 'rich-text' ? 'builder-rich-text' : 'builder-paragraph'}
      style={inlineStyles}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
}
