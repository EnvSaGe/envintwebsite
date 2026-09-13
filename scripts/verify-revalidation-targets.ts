import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  collectStaticRevalidationTargets,
  normalizeRevalidationRequest,
} from '../apps/web/src/lib/revalidation/targets';

assert.deepEqual(collectStaticRevalidationTargets({ type: 'page', slug: '/about' }), {
  paths: ['/about/'],
  tags: ['page:/about'],
});
assert.deepEqual(collectStaticRevalidationTargets({ type: 'global', key: 'navigation' }), {
  paths: [],
  tags: ['global:navigation'],
});
assert.deepEqual(collectStaticRevalidationTargets({ type: 'record', recordType: 'impact', slug: 'example' }), {
  paths: ['/impact/example/'],
  tags: ['record:impact:example', 'archive:impact'],
});

assert.deepEqual(
  normalizeRevalidationRequest({
    paths: ['/about', '/about/', '/bad path'],
    tags: ['page:/about', 'global:navigation', 'not-allowed'],
  }),
  {
    paths: ['/about/'],
    tags: ['page:/about', 'global:navigation'],
    rejectedPaths: ['/bad path'],
    rejectedTags: ['not-allowed'],
  },
);

assert.throws(
  () => normalizeRevalidationRequest({ paths: Array.from({ length: 201 }, (_, index) => `/p-${index}`) }),
  /at most 200/i,
);

const netlifyConfig = readFileSync('apps/web/netlify.toml', 'utf8');
assert.match(netlifyConfig, /\[functions\."publish-scheduled"\][\s\S]*schedule\s*=\s*"@hourly"/);
assert.doesNotMatch(netlifyConfig, /\*\/5 \* \* \* \*/);
const scheduledFunction = readFileSync('apps/web/netlify/functions/publish-scheduled.mts', 'utf8');
assert.match(scheduledFunction, /x-cron-secret/);
assert.match(scheduledFunction, /schedule:\s*'@hourly'/);

console.log('Revalidation target contracts pass.');
