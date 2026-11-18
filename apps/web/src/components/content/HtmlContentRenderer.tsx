import React from 'react';
import sanitizeHtml from 'sanitize-html';

interface HtmlContentRendererProps {
  html: string;
  className?: string;
}

const EDITORIAL_SAFE_TAGS = [
  'p', 'b', 'strong', 'i', 'em', 'u', 's', 'a', 'ul', 'ol', 'li', 'br', 'span',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'figure', 'figcaption', 'img', 'hr',
  'div', 'section', 'article', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
  'sup', 'sub', 'code', 'pre', 'svg', 'path',
];

export function HtmlContentRenderer({ html, className }: HtmlContentRendererProps) {
  const cleanHtml = sanitizeHtml(html || '', {
    allowedTags: EDITORIAL_SAFE_TAGS,
    allowedAttributes: {
      '*': ['class', 'style', 'id', 'aria-*', 'role', 'title', 'align', 'start'],
      a: ['href', 'target', 'rel', 'class', 'style', 'id', 'title'],
      img: ['src', 'srcset', 'sizes', 'alt', 'width', 'height', 'loading', 'decoding', 'class', 'style'],
      th: ['colspan', 'rowspan', 'scope', 'class', 'style'],
      td: ['colspan', 'rowspan', 'class', 'style'],
      svg: ['width', 'height', 'viewBox', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'class', 'style'],
      path: ['d', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    disallowedTagsMode: 'discard',
  });

  return (
    <div
      className={`prose ${className || ''}`}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
      style={{ lineHeight: 1.75 }}
    />
  );
}
