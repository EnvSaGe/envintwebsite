import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const appRoot = path.resolve(process.cwd(), 'apps/web/src/app');

function pageFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return pageFiles(fullPath);
    return entry.name === 'page.tsx' ? [fullPath] : [];
  });
}

const publicPages = pageFiles(appRoot).filter((file) => !file.includes(`${path.sep}preview${path.sep}`));
const violations = publicPages.flatMap((file) => {
  const source = readFileSync(file, 'utf8');
  const relative = path.relative(process.cwd(), file).replace(/\\/g, '/');
  const errors: string[] = [];
  if (!source.includes("@/lib/routes/public-page-adapter")) errors.push('does not use the CMS public-page adapter');
  if (/Fallback|_cms_page|ServicesPageFallback/.test(source)) errors.push('still references a hardcoded fallback');
  return errors.map((error) => `${relative}: ${error}`);
});

assert.equal(violations.length, 0, `Hardcoded public routes remain:\n${violations.join('\n')}`);
console.log(`[cms-adapters] ${publicPages.length} public route adapters verified`);
