import assert from 'node:assert/strict';
import { normalizeRoutePath, routePathToSlug } from '../apps/web/src/lib/routes/normalize';
import { choosePublishedTree } from '../apps/web/src/lib/routes/tree-selection';
import { createArchiveRoute, parseContentRoute } from '../apps/web/src/lib/routes/content-route';

assert.equal(normalizeRoutePath('about'), '/about');
assert.equal(normalizeRoutePath('/about/'), '/about');
assert.equal(normalizeRoutePath('https://envintglobal.com/impact/example/?ref=test'), '/impact/example');
assert.equal(normalizeRoutePath('/'), '/');
assert.equal(routePathToSlug('/'), '/');
assert.equal(routePathToSlug('/about/'), '/about');
assert.deepEqual(parseContentRoute('/impact/example/'), { kind: 'record', recordType: 'impact', slug: 'example', templateSlug: 'impact' });
assert.deepEqual(parseContentRoute('/member/example/'), { kind: 'record', recordType: 'team-member', slug: 'example', templateSlug: 'team-member' });
assert.deepEqual(parseContentRoute('/category/enviki/'), { kind: 'archive', archiveType: 'category', slug: 'enviki', templateSlug: 'taxonomy' });
assert.deepEqual(parseContentRoute('/author/envint/'), { kind: 'archive', archiveType: 'author', slug: 'envint', templateSlug: 'author' });
assert.deepEqual(parseContentRoute('/an-article/'), { kind: 'record', recordType: 'insight', slug: 'an-article', templateSlug: 'article' });
assert.deepEqual(createArchiveRoute('sub-service', 'materiality').query.filters, [
  { field: 'categories', operator: 'contains', value: 'materiality' },
]);
assert.equal(parseContentRoute('/nested/unknown/path/'), null);

assert.equal(
  choosePublishedTree({ draftBlocks: { rootIds: ['draft'], nodes: {} }, publishedBlocks: null }),
  null,
  'the public resolver must never expose a draft-only tree',
);
assert.deepEqual(
  choosePublishedTree({
    draftBlocks: { rootIds: ['draft'], nodes: {} },
    publishedBlocks: {
      rootIds: ['live'],
      nodes: {
        live: {
          id: 'live',
          type: 'section',
          name: 'Live section',
          parentId: null,
          children: [],
          content: {},
          styles: {},
        },
      },
    },
  }),
  {
    version: 2,
    rootIds: ['live'],
    nodes: {
      live: {
        id: 'live',
        type: 'section',
        name: 'Live section',
        parentId: null,
        children: [],
        content: {},
        styles: {},
      },
    },
  },
);
assert.equal(
  choosePublishedTree({ publishedBlocks: { rootIds: ['broken'] } }),
  null,
  'malformed published trees must not reach the renderer',
);

console.log('Public route resolver contracts pass.');
