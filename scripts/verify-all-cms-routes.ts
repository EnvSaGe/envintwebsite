import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import type { PublicRouteInventory } from './lib/public-route-inventory';
import { buildCmsCoverage, validateMigrationTemplates } from './migrate-live-parity-cms';

async function main() {
  const inventory = JSON.parse(
    readFileSync('envintmigration/site-capture/public-route-inventory.json', 'utf8'),
  ) as PublicRouteInventory;
  const coverage = await buildCmsCoverage(inventory);

  assert.equal(coverage.unaccounted.length, 0, `Unaccounted routes:\n${coverage.unaccounted.join('\n')}`);
  assert.equal(coverage.hardcodedOnly.length, 0, `Hard-coded routes:\n${coverage.hardcodedOnly.join('\n')}`);
  assert.equal(coverage.covered.length, inventory.routes.length);
  assert.equal(new Set(coverage.covered).size, inventory.routes.length);
  validateMigrationTemplates();

  console.log(`CMS coverage contracts pass for ${coverage.covered.length} public routes.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
