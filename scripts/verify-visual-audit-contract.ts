import assert from 'node:assert/strict';
import { assertVisualResults, type VisualResult } from './compare-live-local-visuals';

const matchingResult: VisualResult = {
  route: '/about/',
  family: 'unique-page',
  viewport: '1440x1000',
  liveScreenshot: 'live.png',
  localScreenshot: 'local.png',
  diffRatio: 0.04,
  headingCoverage: 1,
  textSimilarity: 1,
  hasHorizontalOverflow: false,
  status: 'ok',
};

assert.doesNotThrow(() => assertVisualResults([matchingResult], 0.1));

assert.throws(
  () => assertVisualResults([{ ...matchingResult, diffRatio: 0.31 }], 0.1),
  /Visual difference exceeded/,
  'A visibly redesigned page must fail the release gate',
);

assert.throws(
  () => assertVisualResults([{ ...matchingResult, textSimilarity: 0.82 }], 0.1),
  /Visible text differs/,
  'Changed or missing WordPress copy must fail the release gate',
);

console.log('Visual audit contract tests pass.');
