import fs from 'fs';
import path from 'path';
import {
  ALL_CANONICAL_PAGE_SLUGS,
  getCanonicalPageTree,
  PageBlockTree,
  BuilderNode,
} from '../packages/shared/src/index';

async function checkUrl(url: string): Promise<{ ok: boolean; status: number | string }> {
  if (!url) return { ok: false, status: 'EMPTY' };
  let fullUrl = url;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    fullUrl = `https://envintcms.s3.ap-south-1.amazonaws.com${url.startsWith('/') ? '' : '/'}${url}`;
  }
  try {
    const res = await fetch(fullUrl, { method: 'HEAD' });
    return { ok: res.status === 200, status: res.status };
  } catch (e: any) {
    return { ok: false, status: e.message };
  }
}

async function auditAllPages() {
  console.log(`\n🔍 Comprehensive Audit of all ${ALL_CANONICAL_PAGE_SLUGS.length} Page Trees...\n`);

  for (const slug of ALL_CANONICAL_PAGE_SLUGS) {
    const tree = getCanonicalPageTree(slug);
    if (!tree) {
      console.error(`❌ [${slug}]: Tree not found!`);
      continue;
    }

    const { rootIds, nodes } = tree;
    const issues: string[] = [];

    // 1. Check roots
    if (!rootIds || rootIds.length === 0) {
      issues.push('No rootIds defined');
    }

    for (const rootId of rootIds) {
      if (!nodes[rootId]) {
        issues.push(`Root node "${rootId}" missing from nodes record`);
      }
    }

    // 2. Check all nodes
    for (const [nodeId, node] of Object.entries(nodes)) {
      // Check children exist
      for (const childId of node.children || []) {
        if (!nodes[childId]) {
          issues.push(`Node "${nodeId}" has nonexistent child "${childId}"`);
        }
      }

      // Check images
      if (node.type === 'image') {
        const src = node.content?.src;
        if (!src) {
          issues.push(`Image node "${nodeId}" has no content.src`);
        } else {
          const check = await checkUrl(src);
          if (!check.ok) {
            issues.push(`Image node "${nodeId}" broken URL: ${src} (HTTP ${check.status})`);
          }
        }
      }

      // Check background images in styles
      if (node.styles?.backgroundImage) {
        const bg = node.styles.backgroundImage;
        const match = bg.match(/url\(['"]?([^'"]+)['"]?\)/) || [null, bg];
        const bgUrl = match[1] || bg;
        if (bgUrl && !bgUrl.startsWith('linear-gradient')) {
          const check = await checkUrl(bgUrl);
          if (!check.ok) {
            issues.push(`Node "${nodeId}" broken backgroundImage: ${bgUrl} (HTTP ${check.status})`);
          }
        }
      }
    }

    if (issues.length === 0) {
      console.log(`✅ [${slug}]: ${rootIds.length} sections, ${Object.keys(nodes).length} elements — ALL OK!`);
    } else {
      console.log(`❌ [${slug}]: ${issues.length} issues found:`);
      issues.forEach((i) => console.log(`    - ${i}`));
    }
  }
}

auditAllPages();
