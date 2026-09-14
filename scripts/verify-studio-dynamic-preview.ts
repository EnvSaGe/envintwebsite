import assert from 'node:assert/strict';
import type { PageBlockTree } from '@envint/shared';
import * as shared from '@envint/shared';
import * as studioState from '../apps/admin/src/app/pages/editor/studio/StudioState';

const selectRecords = (studioState as any).selectDynamicPreviewRecords;
assert.equal(
  typeof selectRecords,
  'function',
  'Studio must expose a real dynamic-record selector instead of using hardcoded samples',
);

const records = [
  { slug: 'general', title: 'General', categories: ['Insights'] },
  { slug: 'enviki-one', title: 'Enviki one', categories: ['Enviki'] },
  { slug: 'enviki-two', title: 'Enviki two', categories: ['Enviki', 'Glossary Zone'] },
  { slug: 'enviki-three', title: 'Enviki three', categories: ['Enviki'] },
];

assert.deepEqual(
  selectRecords(records, { category: 'enviki', limit: 2 }).map((record: any) => record.slug),
  ['enviki-one', 'enviki-two'],
  'Studio dynamic previews must respect the module category and limit',
);
assert.deepEqual(
  selectRecords(records, {
    query: {
      source: 'insights',
      filters: [{ field: 'categories', operator: 'contains', value: 'enviki' }],
      sort: 'title:desc',
      limit: 1,
      pagination: 'none',
    },
  }).map((record: any) => record.slug),
  ['enviki-two'],
  'Studio previews must apply editor query filters, sorting, and limits immediately',
);

const tree: PageBlockTree = {
  version: 2,
  rootIds: [],
  nodes: {},
};
const dynamicModules = {
  mod_insights: [{ slug: 'live-record', title: 'Live record' }],
};
const initial = (studioState.createInitialStudioState as any)(tree, [], dynamicModules);
assert.deepEqual(
  initial.dynamicModules,
  dynamicModules,
  'Studio state must retain server-resolved dynamic records for canvas rendering',
);

const buildModules = (shared as any).buildStudioDynamicModules;
assert.equal(
  typeof buildModules,
  'function',
  'Studio must build a data payload for every dynamic module in the page tree',
);
const dynamicTree: PageBlockTree = {
  version: 2,
  rootIds: ['insights', 'impacts'],
  nodes: {
    insights: {
      id: 'insights',
      type: 'insights-grid',
      name: 'Insights',
      parentId: null,
      children: [],
      content: { category: 'enviki', limit: 1 },
      styles: {},
    },
    impacts: {
      id: 'impacts',
      type: 'impact-grid',
      name: 'Impacts',
      parentId: null,
      children: [],
      content: { limit: 2 },
      styles: {},
    },
  },
};
const recordPools = buildModules(dynamicTree, { insights: records, impacts: records.slice(0, 3) });
assert.equal(
  recordPools.insights.length,
  records.length,
  'Studio must retain the full source pool so changing a module filter or limit updates the canvas immediately',
);
assert.deepEqual(
  recordPools,
  {
    insights: records,
    impacts: records.slice(0, 3),
  },
  'Each dynamic node must receive the complete live-record source pool',
);

console.log('Studio dynamic preview contract tests pass.');
