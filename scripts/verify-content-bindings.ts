import assert from 'node:assert/strict';
import {
  resolveBinding,
  validateDynamicQuery,
} from '../packages/shared/src/content-bindings';
import { BuilderNodeSchema } from '../packages/shared/src/builder-schema';
import {
  contentDependencies,
  contentTemplates,
  globalBlockRevisions,
} from '../packages/db/src/schema';

const context = {
  record: {
    title: 'Climate Action',
    coverImage: { url: '/hero.webp' },
  },
  site: { contact: { email: 'connect@envintglobal.com' } },
  route: { pathname: '/climate-action/' },
  global: {},
};

assert.equal(resolveBinding({ source: 'record', path: 'title' }, context), 'Climate Action');
assert.equal(resolveBinding({ source: 'record', path: 'coverImage.url' }, context), '/hero.webp');
assert.equal(
  resolveBinding({ source: 'record', path: 'missing', fallback: 'Fallback' }, context),
  'Fallback',
);
assert.equal(
  resolveBinding({ source: 'site', path: 'contact.email' }, context),
  'connect@envintglobal.com',
);
assert.equal(
  resolveBinding({ source: 'record', path: '__proto__.polluted', fallback: 'Safe' }, context),
  'Safe',
  'prototype traversal must never be resolved',
);

assert.deepEqual(
  validateDynamicQuery({ source: 'insights', limit: 3, sort: 'publishedAt:desc' }),
  {
    source: 'insights',
    limit: 3,
    sort: 'publishedAt:desc',
    filters: [],
    pagination: 'none',
  },
);
assert.throws(
  () => validateDynamicQuery({ source: 'insights', limit: 0 }),
  /limit/i,
  'zero-sized collection queries must be rejected',
);

assert.equal(contentTemplates.slug.name, 'slug');
assert.equal(contentTemplates.publishedBlocks.name, 'published_blocks');
assert.equal(globalBlockRevisions.globalBlockSlug.name, 'global_block_slug');
assert.equal(contentDependencies.routePath.name, 'route_path');

const validBoundHeading = BuilderNodeSchema.safeParse({
  id: 'heading',
  type: 'heading',
  name: 'Bound Heading',
  parentId: null,
  children: [],
  content: {
    text: 'Fallback heading',
    tag: 'h1',
    bindings: { text: { source: 'record', path: 'title', fallback: 'Fallback heading' } },
  },
  styles: {},
});
assert.equal(validBoundHeading.success, true, 'supported heading fields must accept bindings');

const invalidDynamicQuery = BuilderNodeSchema.safeParse({
  id: 'grid',
  type: 'insights-grid',
  name: 'Insights',
  parentId: null,
  children: [],
  content: { query: { source: 'insights', limit: 0 } },
  styles: {},
});
assert.equal(invalidDynamicQuery.success, false, 'invalid dynamic queries must be rejected at the node boundary');

console.log('Content binding contracts pass.');
