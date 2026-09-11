import React from 'react';
import Image from 'next/image';
import { BuilderNode } from '@envint/shared';
import { elementStylesToCss } from '../style-utils';

export function ImageElement({ node }: { node: BuilderNode }) {
  const content = node.content || {};
  const src = content.src || 'https://envintcms.s3.ap-south-1.amazonaws.com/images/placeholder.webp';
  const alt = content.alt || '';
  const isDecorative = content.isDecorative || false;
  const objectFit = (content.objectFit || 'cover') as React.CSSProperties['objectFit'];
  const objectPosition = content.objectPosition || 'center';
  const inlineStyles = elementStylesToCss(node.styles);

  const containerStyles: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    width: inlineStyles.width || '100%',
    maxWidth: inlineStyles.maxWidth,
    height: inlineStyles.height || 'auto',
    minHeight: inlineStyles.minHeight,
    borderRadius: inlineStyles.borderRadius,
    boxShadow: inlineStyles.boxShadow,
    margin: inlineStyles.margin,
    marginTop: inlineStyles.marginTop,
    marginRight: inlineStyles.marginRight,
    marginBottom: inlineStyles.marginBottom,
    marginLeft: inlineStyles.marginLeft,
  };

  const isRemote = src.startsWith('http://') || src.startsWith('https://');

  return (
    <div data-builder-id={node.id} style={containerStyles}>
      {isRemote ? (
        <Image
          src={src}
          alt={isDecorative ? '' : alt}
          width={1200}
          height={800}
          style={{
            width: '100%',
            height: inlineStyles.height || 'auto',
            objectFit,
            objectPosition,
            display: 'block',
          }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      ) : (
        <img
          src={src}
          alt={isDecorative ? '' : alt}
          style={{
            width: '100%',
            height: inlineStyles.height || 'auto',
            objectFit,
            objectPosition,
            display: 'block',
          }}
        />
      )}
      {content.caption && (
        <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '8px', textAlign: 'center' }}>
          {content.caption}
        </p>
      )}
    </div>
  );
}
