import React from 'react';
import Image from 'next/image';
import { BuilderNode, resolveCmsImage } from '@envint/shared';
import { elementStylesToCss } from '../style-utils';

export function imageContainerStyles(styles: BuilderNode['styles']): React.CSSProperties {
  const inlineStyles = elementStylesToCss(styles);
  return {
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    ...inlineStyles,
  };
}

export function imageDeliveryProps(content: BuilderNode['content']): { sizes: string; quality: number } {
  const requestedQuality = Number(content?.quality);
  return {
    sizes: String(content?.sizes || '100vw'),
    quality: Number.isFinite(requestedQuality)
      ? Math.max(50, Math.min(100, Math.round(requestedQuality)))
      : 75,
  };
}

export function ImageElement({ node }: { node: BuilderNode }) {
  const content = node.content || {};
  const rawSrc = content.src || 'https://envintcms.s3.ap-south-1.amazonaws.com/images/placeholder.webp';
  const src = resolveCmsImage(rawSrc);
  const alt = content.alt || '';
  const isDecorative = content.isDecorative || false;
  const objectFit = (content.objectFit || 'cover') as React.CSSProperties['objectFit'];
  const objectPosition = content.objectPosition || 'center';
  const inlineStyles = elementStylesToCss(node.styles);
  const delivery = imageDeliveryProps(content);

  const containerStyles = imageContainerStyles(node.styles);

  const isSvg = src.endsWith('.svg') || src.startsWith('data:image/svg');

  return (
    <div data-builder-id={node.id} style={containerStyles}>
      {isSvg ? (
        <img
          src={src}
          alt={isDecorative ? '' : alt}
          loading="lazy"
          decoding="async"
          style={{
            width: '100%',
            height: inlineStyles.height || 'auto',
            objectFit,
            objectPosition,
            display: 'block',
          }}
        />
      ) : (
        <Image
          src={src}
          alt={isDecorative ? '' : alt}
          width={1200}
          height={800}
          loading="lazy"
          style={{
            width: '100%',
            height: inlineStyles.height || 'auto',
            objectFit,
            objectPosition,
            display: 'block',
          }}
          sizes={delivery.sizes}
          quality={delivery.quality}
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
