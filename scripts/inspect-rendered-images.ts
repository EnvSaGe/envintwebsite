import { existsSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

async function main(): Promise<void> {
  const { chromium } = await import(pathToFileURL(path.resolve('envintmigration/site-capture/node_modules/playwright/index.mjs')).href);
  const executablePath = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ].find(existsSync);
  if (!executablePath) throw new Error('Browser not found');
  const browser = await chromium.launch({ executablePath, headless: true });
  for (const origin of ['https://envintglobal.com', 'http://localhost:3000']) {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
    await page.goto(new URL('/careers-at-envint/', origin).toString(), { waitUntil: 'domcontentloaded', timeout: 60_000 });
    await page.waitForTimeout(1_000);
    await page.evaluate(async () => {
      window.scrollTo(0, document.documentElement.scrollHeight);
      await new Promise((resolve) => setTimeout(resolve, 800));
    });
    const images = await page.locator('img').evaluateAll((nodes) => nodes.map((node) => {
      const image = node as HTMLImageElement;
      const rect = image.getBoundingClientRect();
      return {
        alt: image.alt,
        currentSrc: image.currentSrc || image.src,
        natural: `${image.naturalWidth}x${image.naturalHeight}`,
        rendered: `${Math.round(rect.width)}x${Math.round(rect.height)}`,
      };
    }).filter((image) => /careers|typical|team|envint colleagues|client|engagement/i.test(`${image.alt} ${image.currentSrc}`)));
    console.log(`\n${origin}`);
    for (const image of images) console.log(JSON.stringify(image));
    await page.close();
  }
  await browser.close();
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
