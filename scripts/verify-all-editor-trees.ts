import { getCanonicalPageTree, ALL_CANONICAL_PAGE_SLUGS, BuilderNode } from '../packages/shared/src/index';

function validateTreeIntegrity(slug: string): { valid: boolean; errors: string[] } {
  const tree = getCanonicalPageTree(slug);
  const errors: string[] = [];

  if (!tree) {
    return { valid: false, errors: [`No canonical tree returned for ${slug}`] };
  }

  if (tree.version !== 2) {
    errors.push(`Invalid version: ${tree.version}`);
  }

  if (!Array.isArray(tree.rootIds) || tree.rootIds.length === 0) {
    errors.push(`Empty or non-array rootIds`);
  }

  const nodes = tree.nodes || {};
  const nodeCount = Object.keys(nodes).length;

  if (nodeCount === 0) {
    errors.push(`No nodes in tree`);
  }

  // Check rootIds exist in nodes
  for (const rootId of tree.rootIds) {
    if (!nodes[rootId]) {
      errors.push(`Root section "${rootId}" missing from nodes`);
    } else if (nodes[rootId].parentId !== null) {
      errors.push(`Root section "${rootId}" has non-null parentId: ${nodes[rootId].parentId}`);
    }
  }

  // Check all children exist and point back to correct parent
  for (const [nodeId, node] of Object.entries(nodes)) {
    if (!node.type) {
      errors.push(`Node "${nodeId}" missing type`);
    }
    if (!node.id || node.id !== nodeId) {
      errors.push(`Node key "${nodeId}" does not match node.id "${node.id}"`);
    }

    if (Array.isArray(node.children)) {
      for (const childId of node.children) {
        const child = nodes[childId];
        if (!child) {
          errors.push(`Node "${nodeId}" references non-existent child "${childId}"`);
        } else if (child.parentId !== nodeId) {
          errors.push(`Child "${childId}" parentId is "${child.parentId}", expected "${nodeId}"`);
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

async function main() {
  console.log('🔍 Validating Tree Integrity for all 18 pages...\n');

  let passed = 0;
  let failed = 0;

  for (const slug of ALL_CANONICAL_PAGE_SLUGS) {
    const tree = getCanonicalPageTree(slug);
    const { valid, errors } = validateTreeIntegrity(slug);

    if (valid && tree) {
      console.log(`✓ ${slug.padEnd(28)}: ${tree.rootIds.length} sections, ${Object.keys(tree.nodes).length} elements - OK`);
      passed++;
    } else {
      console.error(`✗ ${slug.padEnd(28)}: FAILED with ${errors.length} error(s):`);
      for (const err of errors) {
        console.error(`    - ${err}`);
      }
      failed++;
    }
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed out of ${ALL_CANONICAL_PAGE_SLUGS.length}`);
  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
