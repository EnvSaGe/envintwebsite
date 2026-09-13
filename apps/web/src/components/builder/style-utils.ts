import React from 'react';
import { ElementStyles } from '@envint/shared';

/**
 * Convert ElementStyles to React.CSSProperties
 */
export function elementStylesToCss(styles: ElementStyles | undefined): React.CSSProperties {
  if (!styles) return {};

  const css: React.CSSProperties = {};

  // Dimensions
  if (styles.width) css.width = styles.width;
  if (styles.maxWidth) css.maxWidth = styles.maxWidth;
  if (styles.minWidth) css.minWidth = styles.minWidth;
  if (styles.height) css.height = styles.height;
  if (styles.minHeight) css.minHeight = styles.minHeight;
  if (styles.maxHeight) css.maxHeight = styles.maxHeight;

  // Spacing (Padding)
  if (styles.padding) css.padding = styles.padding;
  if (styles.paddingTop) css.paddingTop = styles.paddingTop;
  if (styles.paddingRight) css.paddingRight = styles.paddingRight;
  if (styles.paddingBottom) css.paddingBottom = styles.paddingBottom;
  if (styles.paddingLeft) css.paddingLeft = styles.paddingLeft;

  // Spacing (Margin)
  if (styles.margin) css.margin = styles.margin;
  if (styles.marginTop) css.marginTop = styles.marginTop;
  if (styles.marginRight) css.marginRight = styles.marginRight;
  if (styles.marginBottom) css.marginBottom = styles.marginBottom;
  if (styles.marginLeft) css.marginLeft = styles.marginLeft;

  // Layout (Flex / Grid)
  if (styles.display) css.display = styles.display;
  if (styles.flexDirection) css.flexDirection = styles.flexDirection;
  if (styles.flexWrap) css.flexWrap = styles.flexWrap;
  if (styles.justifyContent) css.justifyContent = styles.justifyContent;
  if (styles.alignItems) css.alignItems = styles.alignItems;
  if (styles.alignSelf) css.alignSelf = styles.alignSelf;
  if (styles.gap) css.gap = styles.gap;
  if (styles.columnGap) css.columnGap = styles.columnGap;
  if (styles.rowGap) css.rowGap = styles.rowGap;
  if (styles.gridColumns || styles.gridTemplateColumns) {
    css.gridTemplateColumns = styles.gridColumns || styles.gridTemplateColumns;
  }
  if (styles.gridRows || styles.gridTemplateRows) {
    css.gridTemplateRows = styles.gridRows || styles.gridTemplateRows;
  }
  if (styles.aspectRatio) {
    css.aspectRatio = styles.aspectRatio;
  }

  // Typography
  if (styles.fontFamily) css.fontFamily = styles.fontFamily;
  if (styles.fontSize) css.fontSize = styles.fontSize;
  if (styles.fontWeight) css.fontWeight = styles.fontWeight;
  if (styles.lineHeight) css.lineHeight = styles.lineHeight;
  if (styles.letterSpacing) css.letterSpacing = styles.letterSpacing;
  if (styles.textAlign) css.textAlign = styles.textAlign;
  if (styles.textColor) css.color = styles.textColor;
  if (styles.textTransform) css.textTransform = styles.textTransform;
  if (styles.textDecoration) css.textDecoration = styles.textDecoration;

  // Background
  if (styles.backgroundColor) css.backgroundColor = styles.backgroundColor;
  if (styles.backgroundImage) {
    let bg = styles.backgroundImage.trim();
    if (bg.startsWith('/images/')) {
      bg = `https://envintcms.s3.ap-south-1.amazonaws.com${bg}`;
    } else if (bg.startsWith('/media/uploads/')) {
      bg = `https://envintcms.s3.ap-south-1.amazonaws.com${bg}`;
    }
    css.backgroundImage = bg.startsWith('url(') || bg.startsWith('linear-gradient') ? bg : `url(${bg})`;
  }
  if (styles.backgroundSize) css.backgroundSize = styles.backgroundSize;
  if (styles.backgroundPosition) css.backgroundPosition = styles.backgroundPosition;
  if (styles.backgroundRepeat) css.backgroundRepeat = styles.backgroundRepeat;

  // Border & Radius
  if (styles.borderWidth) css.borderWidth = styles.borderWidth;
  if (styles.borderStyle) css.borderStyle = styles.borderStyle;
  if (styles.borderColor) css.borderColor = styles.borderColor;
  if (styles.borderRadius) css.borderRadius = styles.borderRadius;

  // Side-specific borders
  if (styles.borderLeftWidth) {
    css.borderLeftWidth = styles.borderLeftWidth;
    css.borderLeftStyle = (styles.borderLeftStyle as any) || 'solid';
    if (styles.borderLeftColor) css.borderLeftColor = styles.borderLeftColor;
  }
  if (styles.borderRightWidth) {
    css.borderRightWidth = styles.borderRightWidth;
    css.borderRightStyle = (styles.borderRightStyle as any) || 'solid';
    if (styles.borderRightColor) css.borderRightColor = styles.borderRightColor;
  }
  if (styles.borderTopWidth) {
    css.borderTopWidth = styles.borderTopWidth;
    css.borderTopStyle = (styles.borderTopStyle as any) || 'solid';
    if (styles.borderTopColor) css.borderTopColor = styles.borderTopColor;
  }
  if (styles.borderBottomWidth) {
    css.borderBottomWidth = styles.borderBottomWidth;
    css.borderBottomStyle = (styles.borderBottomStyle as any) || 'solid';
    if (styles.borderBottomColor) css.borderBottomColor = styles.borderBottomColor;
  }

  // Minimal positioning
  if (styles.position) css.position = styles.position as any;
  if (styles.top) css.top = styles.top;
  if (styles.right) css.right = styles.right;
  if (styles.bottom) css.bottom = styles.bottom;
  if (styles.left) css.left = styles.left;

  // Effects
  if (styles.textShadow) css.textShadow = styles.textShadow;
  if (styles.boxShadow) css.boxShadow = styles.boxShadow;
  if (typeof styles.opacity === 'number') css.opacity = styles.opacity;
  if (styles.overflow) css.overflow = styles.overflow;
  if (typeof styles.zIndex === 'number') css.zIndex = styles.zIndex;

  return css;
}

/**
 * Generate responsive style tags or media query styles for SSR
 */
export function generateNodeResponsiveCss(
  nodeId: string,
  tabletStyles?: ElementStyles,
  mobileStyles?: ElementStyles
): string {
  let cssRules = '';

  if (tabletStyles && Object.keys(tabletStyles).length > 0) {
    const tabletRules = Object.entries(elementStylesToCss(tabletStyles))
      .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v} !important;`)
      .join(' ');
    cssRules += `@media (max-width: 1024px) { [data-builder-id="${nodeId}"] { ${tabletRules} } }\n`;
  }

  if (mobileStyles && Object.keys(mobileStyles).length > 0) {
    const mobileRules = Object.entries(elementStylesToCss(mobileStyles))
      .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v} !important;`)
      .join(' ');
    cssRules += `@media (max-width: 767px) { [data-builder-id="${nodeId}"] { ${mobileRules} } }\n`;
  }

  return cssRules;
}
