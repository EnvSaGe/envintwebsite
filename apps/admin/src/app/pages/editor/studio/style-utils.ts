import React from 'react';
import { ElementStyles } from '@envint/shared';

/**
 * Convert ElementStyles to React.CSSProperties for Admin Studio Canvas
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
  if ((styles as any).borderLeftWidth) {
    css.borderLeftWidth = (styles as any).borderLeftWidth;
    css.borderLeftStyle = (styles as any).borderLeftStyle || 'solid';
    if ((styles as any).borderLeftColor) css.borderLeftColor = (styles as any).borderLeftColor;
  }
  if ((styles as any).borderRightWidth) {
    css.borderRightWidth = (styles as any).borderRightWidth;
    css.borderRightStyle = (styles as any).borderRightStyle || 'solid';
    if ((styles as any).borderRightColor) css.borderRightColor = (styles as any).borderRightColor;
  }
  if ((styles as any).borderTopWidth) {
    css.borderTopWidth = (styles as any).borderTopWidth;
    css.borderTopStyle = (styles as any).borderTopStyle || 'solid';
    if ((styles as any).borderTopColor) css.borderTopColor = (styles as any).borderTopColor;
  }
  if ((styles as any).borderBottomWidth) {
    css.borderBottomWidth = (styles as any).borderBottomWidth;
    css.borderBottomStyle = (styles as any).borderBottomStyle || 'solid';
    if ((styles as any).borderBottomColor) css.borderBottomColor = (styles as any).borderBottomColor;
  }

  // Minimal positioning
  if ((styles as any).position) css.position = (styles as any).position;
  if ((styles as any).top) css.top = (styles as any).top;
  if ((styles as any).right) css.right = (styles as any).right;
  if ((styles as any).bottom) css.bottom = (styles as any).bottom;
  if ((styles as any).left) css.left = (styles as any).left;

  // Effects
  if ((styles as any).textShadow) css.textShadow = (styles as any).textShadow;
  if (styles.boxShadow) css.boxShadow = styles.boxShadow;
  if (typeof styles.opacity === 'number') css.opacity = styles.opacity;
  if (styles.overflow) css.overflow = styles.overflow;
  if (typeof styles.zIndex === 'number') css.zIndex = styles.zIndex;

  return css;
}
