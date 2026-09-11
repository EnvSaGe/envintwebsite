import React from 'react';

interface HtmlContentRendererProps {
  html: string;
  className?: string;
}

export function HtmlContentRenderer({ html, className }: HtmlContentRendererProps) {
  // Uses dangerouslySetInnerHTML strictly on content verified through the migration sanitization pipeline
  return (
    <div
      className={`prose ${className || ''}`}
      dangerouslySetInnerHTML={{ __html: html }}
      style={{ lineHeight: 1.75 }}
    />
  );
}
