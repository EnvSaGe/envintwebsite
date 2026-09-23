import React from 'react';
import sanitizeHtml from 'sanitize-html';
import { BuilderNode } from '@envint/shared';
import { elementStylesToCss } from '../style-utils';

const SAFE_TAGS = [
  'p', 'b', 'strong', 'i', 'em', 'u', 'a', 'ul', 'ol', 'li', 'br', 'span',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'figure', 'figcaption', 'img', 'hr',
  'div', 'section', 'article', 'button', 'svg', 'path',
];

const CSS_PROPERTIES = [
  'display', 'background', 'background-image', 'background-size', 'background-position',
  'background-color', 'background-repeat', 'border-radius', 'height', 'min-height', 'max-height',
  'width', 'min-width', 'max-width', 'padding', 'padding-top', 'padding-bottom',
  'padding-left', 'padding-right', 'margin', 'margin-top', 'margin-bottom',
  'margin-left', 'margin-right', 'color', 'font-size', 'font-weight',
  'font-family', 'line-height', 'box-shadow', 'text-shadow', 'transition',
  'text-decoration', 'align-items', 'justify-content', 'flex-direction',
  'flex-wrap', 'gap', 'grid-template-columns', 'grid-template-rows', 'box-sizing',
  'position', 'top', 'bottom', 'left', 'right', 'opacity', 'white-space',
  'border', 'border-color', 'border-width', 'border-style', 'overflow', 'z-index',
  'cursor', 'text-align', 'letter-spacing', 'transform'
];

const ALLOWED_STYLES_MAP: Record<string, RegExp[]> = {};
for (const prop of CSS_PROPERTIES) {
  ALLOWED_STYLES_MAP[prop] = [/.*/];
}

export function ParagraphElement({ node }: { node: BuilderNode }) {
  const content = node.content || {};
  const rawHtml = content.html || (content.text ? `<p>${content.text}</p>` : '<p></p>');
  const inlineStyles = elementStylesToCss(node.styles);

  const cleanHtml = sanitizeHtml(rawHtml, {
    allowedTags: SAFE_TAGS,
    allowedAttributes: {
      '*': ['class', 'style', 'id', 'aria-*', 'role', 'title'],
      a: ['href', 'target', 'rel', 'class', 'style', 'id', 'title'],
      img: ['src', 'alt', 'width', 'height', 'loading', 'class', 'style'],
      svg: ['width', 'height', 'viewBox', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'class', 'style'],
      path: ['d', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin'],
    },
    allowedStyles: {
      '*': ALLOWED_STYLES_MAP,
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
