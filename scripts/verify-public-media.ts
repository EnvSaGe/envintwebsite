import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { resolveCmsImage } from '../packages/shared/src/index';

const DATA_FILES = ['insights.json', 'impacts.json', 'team.json'];
const IMAGE_EXTENSION = /\.(?:avif|gif|ico|jpe?g|png|svg|webp)(?:[?#].*)?$/i;
const HTML_IMAGE = /(?:src|srcset)=["']([^"']+)["']/gi;

function collectImageUrls(value: unknown, output: Set<string>, key = ''): void {
  if (typeof value === 'string') {
    if (IMAGE_EXTENSION.test(value) && /^(?:https?:\/\/|\/)/.test(value)) output.add(value);
    if (/html|content/i.test(key)) {
      for (const match of value.matchAll(HTML_IMAGE)) {
        for (const candidate of match[1].split(',').map((part) => part.trim().split(/\s+/)[0])) {
          if (IMAGE_EXTENSION.test(candidate)) output.add(candidate);
        }
      }
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => collectImageUrls(item, output, key));
    return;
  }
  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([childKey, child]) => collectImageUrls(child, output, childKey));
  }
}

async function main(): Promise<void> {
  const urls = new Set<string>();
  for (const filename of DATA_FILES) {
    const source = await readFile(path.resolve('apps/web/src/data', filename), 'utf8');
    collectImageUrls(JSON.parse(source), urls);
  }

  const failures: string[] = [];
  const resolved = [...urls].map((url) => resolveCmsImage(url));
  for (let index = 0; index < resolved.length; index += 12) {
    const batch = resolved.slice(index, index + 12);
    await Promise.all(batch.map(async (url) => {
      try {
        const response = await fetch(url, { method: 'HEAD', redirect: 'follow' });
        const type = response.headers.get('content-type') || '';
        if (!response.ok || (!type.startsWith('image/') && !url.toLowerCase().endsWith('.ico'))) {
          failures.push(`${response.status} ${type || 'unknown type'} ${url}`);
        }
      } catch (error) {
        failures.push(`request failed ${url}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }));
  }

  assert.equal(failures.length, 0, `Broken public media:\n${failures.join('\n')}`);
  console.log(`[public-media] ${resolved.length} referenced images verified`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
