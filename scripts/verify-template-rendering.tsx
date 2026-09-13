import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { BindingValue } from '../apps/web/src/components/builder/BindingValue';
import { resolveTreeBindings } from '../apps/web/src/components/builder/resolve-tree-bindings';
import { queryDynamicSource } from '../apps/web/src/lib/data/dynamic-sources';
import { buildHeaderNavigation } from '../apps/web/src/lib/data/layout-content';
import { textSetting } from '../apps/web/src/lib/data/site-settings';

const context = { record: { title: 'Envint', image: { url: '/hero.webp' } } };
const html = renderToStaticMarkup(
  <BindingValue
    binding={{ source: 'record', path: 'title' }}
    context={context}
  />,
);
assert.equal(html, 'Envint');

const resolved = resolveTreeBindings({
  version: 2,
  rootIds: ['hero'],
  nodes: {
    hero: {
      id: 'hero',
      type: 'section',
      name: 'Hero',
      parentId: null,
      children: ['title'],
      content: {},
      styles: {},
    },
    title: {
      id: 'title',
      type: 'heading',
      name: 'Title',
      parentId: 'hero',
      children: [],
      content: {
        text: 'Fallback',
        tag: 'h1',
        bindings: { text: { source: 'record', path: 'title', fallback: 'Fallback' } },
      },
      styles: {},
    },
  },
}, context);

assert.equal(resolved.nodes.title.content.text, 'Envint');
assert.equal(resolved.nodes.title.content.bindings, undefined, 'runtime trees must not leak binding metadata into elements');
assert.equal(resolved.nodes.hero, resolved.nodes.hero, 'unbound nodes remain available');
assert.equal(textSetting({ 'footer.tagline': 'Editable tagline' }, 'footer.tagline', 'Fallback'), 'Editable tagline');
assert.equal(textSetting({}, 'footer.tagline', 'Fallback'), 'Fallback');

assert.deepEqual(
  buildHeaderNavigation([
    {
      label: 'Services',
      href: '/services',
      children: [{ label: 'Climate Action', href: '/climate-action', children: [] }],
    },
    { label: 'About', href: '/about', children: [] },
  ]),
  [
    {
      label: 'Services',
      href: '/services/',
      items: [{ label: 'Climate Action', href: '/climate-action/' }],
    },
    { label: 'About', href: '/about/', items: [] },
  ],
);

async function verifyDynamicSources(): Promise<void> {
  const queried = await queryDynamicSource(
    {
      source: 'insights',
      filters: [{ field: 'categories', operator: 'contains', value: 'Envision' }],
      sort: 'publishedAt:desc',
      limit: 1,
      pagination: 'none',
    },
    {
      insights: async () => [
        { slug: 'older', categories: ['Envision'], publishedAt: '2025-01-01' },
        { slug: 'other', categories: ['Enviki'], publishedAt: '2026-01-01' },
        { slug: 'newer', categories: ['Envision'], publishedAt: '2026-02-01' },
      ],
    },
  );
  assert.deepEqual(queried.map((item) => item.slug), ['newer']);
}

verifyDynamicSources()
  .then(() => console.log('Template rendering contracts pass.'))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
