import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { loadPublicRouteInventory } from './lib/public-route-inventory';

const ORIGIN = process.env.LOCAL_ORIGIN || 'http://localhost:3000';

function chromeExecutable(): string {
  const candidates = [
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ].filter((candidate): candidate is string => Boolean(candidate));
  const executable = candidates.find(existsSync);
  if (!executable) throw new Error('Chrome or Edge was not found');
  return executable;
}

async function loadChromium(): Promise<any> {
  const modulePath = path.resolve('envintmigration/site-capture/node_modules/playwright/index.mjs');
  return (await import(pathToFileURL(modulePath).href)).chromium;
}

async function main(): Promise<void> {
  const inventory = await loadPublicRouteInventory();
  const routes = inventory.routes.map((route) => route.path);
  const chromium = await loadChromium();
  const browser = await chromium.launch({ executablePath: chromeExecutable(), headless: true });
  const failures: string[] = [];
  let nextIndex = 0;
  let completed = 0;

  async function worker(): Promise<void> {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    while (nextIndex < routes.length) {
      const index = nextIndex++;
      const route = routes[index];
      const url = new URL(route, ORIGIN).toString();
      try {
        const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45_000 });
        if (!response?.ok()) {
          failures.push(`${route}: HTTP ${response?.status() ?? 'unknown'}`);
          continue;
        }
        await page.evaluate(async () => {
          const height = document.documentElement.scrollHeight;
          for (let y = 0; y < height; y += Math.max(600, window.innerHeight - 100)) {
            window.scrollTo(0, y);
            await new Promise((resolve) => setTimeout(resolve, 35));
          }
          window.scrollTo(0, 0);
          await Promise.race([
            Promise.all(Array.from(document.images).map((image) =>
              image.complete ? Promise.resolve() : image.decode().catch(() => undefined),
            )),
            new Promise((resolve) => setTimeout(resolve, 5_000)),
          ]);
        });
        const broken = await page.locator('img').evaluateAll((images: HTMLImageElement[]) =>
          images
            .filter((image) => image.complete && image.naturalWidth === 0)
            .map((image) => ({ src: image.currentSrc || image.src, alt: image.alt })),
        );
        for (const image of broken) failures.push(`${route}: ${image.src} (${image.alt || 'no alt text'})`);
      } catch (error) {
        failures.push(`${route}: ${error instanceof Error ? error.message : String(error)}`);
      }
      completed += 1;
      if (completed % 20 === 0 || completed === routes.length) {
        console.log(`[rendered-media] ${completed}/${routes.length}`);
      }
    }
    await page.close();
  }

  await Promise.all(Array.from({ length: 4 }, () => worker()));
  await browser.close();
  assert.equal(failures.length, 0, `Broken rendered media:\n${failures.join('\n')}`);
  console.log(`[rendered-media] ${routes.length} public routes verified`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
