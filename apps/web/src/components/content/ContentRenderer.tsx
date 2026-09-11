import React from 'react';
import { HtmlContentRenderer } from './HtmlContentRenderer';
import { BlockContentRenderer } from './BlockContentRenderer';

interface ContentRendererProps {
  format: 'HTML' | 'BLOCKS';
  html?: string | null;
  blocks?: any;
  className?: string;
}

export function ContentRenderer({ format, html, blocks, className }: ContentRendererProps) {
  if (format === 'HTML' && html) {
    return <HtmlContentRenderer html={html} className={className} />;
  }

  if (format === 'BLOCKS' && blocks) {
    return <BlockContentRenderer blocks={blocks} className={className} />;
  }

  return null;
}
