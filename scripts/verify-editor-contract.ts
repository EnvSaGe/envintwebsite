import assert from 'node:assert/strict';
import {
  createInitialStudioState,
  studioReducer,
} from '../apps/admin/src/app/pages/editor/studio/StudioState';

const tree = {
  version: 2 as const,
  rootIds: ['title'],
  nodes: {
    title: {
      id: 'title',
      type: 'heading' as const,
      name: 'Title',
      parentId: null,
      children: [],
      content: { text: 'Fallback', tag: 'h1' },
      styles: {},
    },
    grid: {
      id: 'grid',
      type: 'insights-grid' as const,
      name: 'Latest insights',
      parentId: null,
      children: [],
      content: {},
      styles: {},
    },
  },
};

const state = createInitialStudioState(tree);
const withBinding = studioReducer(state, {
  type: 'UPDATE_BINDING',
  nodeId: 'title',
  field: 'text',
  binding: { source: 'record', path: 'title' },
});

assert.equal(withBinding.tree.nodes.title.content.bindings?.text.path, 'title');
assert.equal(withBinding.saveStatus, 'unsaved');

const withQuery = studioReducer(withBinding, {
  type: 'UPDATE_DYNAMIC_QUERY',
  nodeId: 'grid',
  query: {
    source: 'insights',
    filters: [],
    sort: 'publishedAt:desc',
    limit: 6,
    pagination: 'none',
  },
});

assert.equal(withQuery.tree.nodes.grid.content.query?.source, 'insights');
assert.equal(withQuery.tree.nodes.grid.content.query?.limit, 6);
assert.equal(withQuery.saveStatus, 'unsaved');

console.log('Editor state contracts pass.');
