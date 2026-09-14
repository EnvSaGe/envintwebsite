import assert from 'node:assert/strict';
import type { BuilderNode } from '../packages/shared/src/builder-schema';
import { imageContainerStyles, imageDeliveryProps } from '../apps/web/src/components/builder/elements/ImageElement';

const backgroundImageNode: BuilderNode = {
  id: 'background-image',
  type: 'image',
  name: 'Editable CTA background',
  parentId: 'cta-card',
  children: [],
  content: {
    src: '/test-background.png',
    alt: 'Lush green mountain ridges',
    objectFit: 'cover',
    objectPosition: 'center',
  },
  styles: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  visibility: { desktop: true, tablet: true, mobile: true },
};

const styles = imageContainerStyles(backgroundImageNode.styles);

assert.equal(styles.position, 'absolute', 'Image nodes must preserve absolute positioning');
assert.equal(styles.top, '0', 'Image nodes must preserve their top inset');
assert.equal(styles.left, '0', 'Image nodes must preserve their left inset');
assert.equal(styles.zIndex, 0, 'Image nodes must preserve stacking order');

const defaultDelivery = imageDeliveryProps(backgroundImageNode.content);
assert.equal(defaultDelivery.sizes, '100vw', 'CMS banners must request a full-width source candidate by default');
assert.equal(defaultDelivery.quality, 90, 'CMS images must avoid the visibly soft default compression level');

const cardDelivery = imageDeliveryProps({ ...backgroundImageNode.content, sizes: '50vw', quality: 95 });
assert.deepEqual(cardDelivery, { sizes: '50vw', quality: 95 });

console.log('Builder image layout contract tests pass.');
