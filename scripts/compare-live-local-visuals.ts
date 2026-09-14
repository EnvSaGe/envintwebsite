import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import type { PublicRouteEntry, PublicRouteKind } from './lib/public-route-inventory';

const LIVE_ORIGIN = process.env.LIVE_ORIGIN ?? 'https://envintglobal.com';
const LOCAL_ORIGIN = process.env.LOCAL_ORIGIN ?? 'http://localhost:3000';
const OUTPUT_DIR = path.resolve('envintmigration/site-capture/comparisons');
const INVENTORY_PATH = path.resolve('envintmigration/site-capture/public-route-inventory.json');
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
] as const;

function selectedViewports(): readonly (typeof VIEWPORTS)[number][] {
  const requested = option('viewports')?.split(',').map((value) => value.trim()).filter(Boolean);
  if (!requested?.length) return VIEWPORTS;
  const selected = VIEWPORTS.filter((viewport) => requested.includes(viewport.name));
  assert.ok(selected.length > 0, `No supported viewports matched: ${requested.join(', ')}`);
  return selected;
}

export interface VisualResult {
  route: string;
  family: PublicRouteKind;
  viewport: string;
  liveScreenshot: string;
  localScreenshot: string;
  diffRatio: number;
  headingCoverage: number;
  textSimilarity: number;
  hasHorizontalOverflow: boolean;
  status: 'ok' | 'error';
  error?: string;
}

function option(name: string): string | undefined {
  const direct = process.argv.find((arg) => arg.startsWith(`--${name}=`));
  if (direct) return direct.slice(name.length + 3);
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function routeKey(routePath: string): string {
  return routePath === '/'
    ? 'home'
    : routePath.replace(/^\/+|\/+$/g, '').replace(/[^a-z0-9]+/gi, '--').toLowerCase();
}

function chromeExecutable(): string {
  const candidates = [
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ].filter((candidate): candidate is string => Boolean(candidate));
  const executable = candidates.find(existsSync);
  if (!executable) throw new Error('Chrome or Edge was not found. Set CHROME_PATH.');
  return executable;
}

async function loadChromium(): Promise<any> {
  const modulePath = path.resolve('envintmigration/site-capture/node_modules/playwright/index.mjs');
  return (await import(pathToFileURL(modulePath).href)).chromium;
}

async function preparePage(page: any, url: string): Promise<void> {
  const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45_000 });
  if (!response || !response.ok()) throw new Error(`HTTP ${response?.status() ?? 'unknown'} for ${url}`);
  await page.addStyleTag({
    content: `
      *, *::before, *::after { animation-duration: 0s !important; transition-duration: 0s !important; }
      iframe, .grecaptcha-badge, nextjs-portal, [data-nextjs-toast] { display: none !important; }
    `,
  });
  await page.evaluate(async () => {
    if ('fonts' in document) await (document as Document & { fonts: FontFaceSet }).fonts.ready;
    const step = Math.max(window.innerHeight * 0.8, 500);
    for (let top = 0; top < document.documentElement.scrollHeight; top += step) {
      window.scrollTo(0, top);
      await new Promise((resolve) => window.setTimeout(resolve, 40));
    }
    const images = Array.from(document.images);
    await Promise.race([
      Promise.all(images.map((image) => image.complete ? Promise.resolve() : image.decode().catch(() => undefined))),
      new Promise((resolve) => window.setTimeout(resolve, 5_000)),
    ]);
    window.scrollTo(0, 0);
    await new Promise((resolve) => window.setTimeout(resolve, 150));
  });
  await page.waitForTimeout(350);
}

function normalizedVisibleText(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[\u00a0\s]+/g, ' ')
    .replace(/[^a-z0-9&’'\- ]+/g, ' ')
    .split(' ')
    .filter(Boolean);
}

function textSimilarity(left: string, right: string): number {
  const a = normalizedVisibleText(left);
  const b = normalizedVisibleText(right);
  if (a.length === 0 && b.length === 0) return 1;
  const counts = new Map<string, number>();
  for (const token of a) counts.set(token, (counts.get(token) ?? 0) + 1);
  let intersection = 0;
  for (const token of b) {
    const remaining = counts.get(token) ?? 0;
    if (remaining > 0) {
      intersection++;
      counts.set(token, remaining - 1);
    }
  }
  return (2 * intersection) / (a.length + b.length);
}

async function pageContentText(page: any): Promise<string> {
  return page.evaluate(() => {
    const candidates = [
      document.querySelector('main'),
      document.querySelector('#content'),
      document.querySelector('.envint-dynamic-page-tree'),
      document.querySelector('article'),
    ].filter(Boolean) as HTMLElement[];
    return (candidates[0] ?? document.body).innerText;
  });
}

async function comparePngs(comparator: any, live: Buffer, local: Buffer): Promise<number> {
  const liveUrl = `data:image/png;base64,${live.toString('base64')}`;
  const localUrl = `data:image/png;base64,${local.toString('base64')}`;
  await comparator.setContent(`
    <canvas></canvas><img id="live" src="${liveUrl}"><img id="local" src="${localUrl}">
    <script>
      window.__diffRatio = undefined;
      Promise.all([document.getElementById('live').decode(), document.getElementById('local').decode()]).then(() => {
        const a = document.getElementById('live');
        const b = document.getElementById('local');
        if (a.width !== b.width || a.height !== b.height) { window.__diffRatio = 1; return; }
        const canvas = document.querySelector('canvas');
        canvas.width = a.width; canvas.height = a.height;
        const context = canvas.getContext('2d', { willReadFrequently: true });
        context.drawImage(a, 0, 0);
        const pixelsA = context.getImageData(0, 0, a.width, a.height).data;
        context.clearRect(0, 0, a.width, a.height);
        context.drawImage(b, 0, 0);
        const pixelsB = context.getImageData(0, 0, b.width, b.height).data;
        let changed = 0;
        for (let index = 0; index < pixelsA.length; index += 4) {
          const delta = Math.abs(pixelsA[index] - pixelsB[index]) + Math.abs(pixelsA[index + 1] - pixelsB[index + 1]) + Math.abs(pixelsA[index + 2] - pixelsB[index + 2]);
          if (delta > 60) changed++;
        }
        window.__diffRatio = changed / (a.width * a.height);
      });
    </script>
  `, { waitUntil: 'load' });
  await comparator.waitForFunction('window.__diffRatio !== undefined');
  return comparator.evaluate('window.__diffRatio');
}

function filterRoutes(routes: PublicRouteEntry[]): PublicRouteEntry[] {
  const requestedRoutes = option('routes')?.split(',').map((value) => value.trim()).filter(Boolean);
  const requestedFamilies = option('families')?.split(',').map((value) => value.trim()).filter(Boolean);
  const familyAliases: Record<string, PublicRouteKind[]> = {
    unique: ['unique-page'], article: ['article'], impact: ['impact'], team: ['team-member'], taxonomy: ['taxonomy', 'author'],
  };
  let filtered = routes;
  if (requestedRoutes?.length) {
    const normalized = new Set(requestedRoutes.map((value) => value === '/' ? '/' : `/${value.replace(/^\/+|\/+$/g, '')}/`));
    filtered = filtered.filter((route) => normalized.has(route.path));
  }
  if (requestedFamilies?.length) {
    const kinds = new Set(requestedFamilies.flatMap((family) => familyAliases[family] ?? [family as PublicRouteKind]));
    filtered = filtered.filter((route) => kinds.has(route.kind));
  }
  const limit = Number.parseInt(option('limit') ?? '', 10);
  return Number.isFinite(limit) && limit > 0 ? filtered.slice(0, limit) : filtered;
}

async function main(): Promise<void> {
  const inventory = JSON.parse(await readFile(INVENTORY_PATH, 'utf8')) as { routes: PublicRouteEntry[] };
  const routes = filterRoutes(inventory.routes);
  assert.ok(routes.length > 0, 'No routes matched the requested comparison set');
  await mkdir(OUTPUT_DIR, { recursive: true });

  const chromium = await loadChromium();
  const browser = await chromium.launch({ executablePath: chromeExecutable(), headless: true });
  const comparator = await browser.newPage({ viewport: { width: 10, height: 10 } });
  const results: VisualResult[] = [];

  for (const [routeIndex, route] of routes.entries()) {
    for (const viewport of selectedViewports()) {
      const key = `${routeKey(route.path)}--${viewport.name}`;
      const livePath = path.join(OUTPUT_DIR, `${key}--live.png`);
      const localPath = path.join(OUTPUT_DIR, `${key}--local.png`);
      const result: VisualResult = {
        route: route.path,
        family: route.kind,
        viewport: `${viewport.width}x${viewport.height}`,
        liveScreenshot: livePath,
        localScreenshot: localPath,
        diffRatio: 1,
        headingCoverage: 0,
        textSimilarity: 0,
        hasHorizontalOverflow: false,
        status: 'error',
      };
      const context = await browser.newContext({ viewport });
      const livePage = await context.newPage();
      const localPage = await context.newPage();
      try {
        await Promise.all([
          preparePage(livePage, new URL(route.path, LIVE_ORIGIN).toString()),
          preparePage(localPage, new URL(route.path, LOCAL_ORIGIN).toString()),
        ]);
        const [liveHeadings, liveText, localText, overflow, livePng, localPng] = await Promise.all([
          livePage.locator('h1,h2,h3').allTextContents(),
          pageContentText(livePage),
          pageContentText(localPage),
          localPage.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1),
          livePage.screenshot({ type: 'png', fullPage: true }),
          localPage.screenshot({ type: 'png', fullPage: true }),
        ]);
        await Promise.all([writeFile(livePath, livePng), writeFile(localPath, localPng)]);
        const normalizedText = localText.replace(/\s+/g, ' ').toLowerCase();
        const meaningfulHeadings = liveHeadings.map((value: string) => value.replace(/\s+/g, ' ').trim()).filter(Boolean);
        const matched = meaningfulHeadings.filter((heading: string) => normalizedText.includes(heading.toLowerCase())).length;
        result.headingCoverage = meaningfulHeadings.length === 0 ? 1 : matched / meaningfulHeadings.length;
        result.textSimilarity = textSimilarity(liveText, localText);
        result.hasHorizontalOverflow = overflow;
        result.diffRatio = await comparePngs(comparator, livePng, localPng);
        result.status = 'ok';
      } catch (error) {
        result.error = error instanceof Error ? error.message : String(error);
      } finally {
        await context.close();
      }
      results.push(result);
      console.log(`[visual ${routeIndex + 1}/${routes.length}] ${route.path} ${result.viewport} diff=${result.diffRatio.toFixed(4)} headings=${result.headingCoverage.toFixed(2)} text=${result.textSimilarity.toFixed(2)} overflow=${result.hasHorizontalOverflow}`);
    }
  }
  await browser.close();
  const reportPath = path.join(OUTPUT_DIR, 'report.json');
  await writeFile(reportPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2)}\n`, 'utf8');

  assertVisualResults(results, Number.parseFloat(option('max-diff') ?? '0.10'));
  console.log(`[visual] ${results.length} viewport comparisons passed; report=${reportPath}`);
}

export function assertVisualResults(results: VisualResult[], maxDiffRatio = 0.1, minimumTextSimilarity = 0.98): void {
  for (const result of results) {
    assert.equal(result.status, 'ok', result.error ?? `Comparison failed for ${result.route}`);
    assert.equal(result.viewport.includes('x'), true);
    assert.ok(result.liveScreenshot && result.localScreenshot);
    assert.ok(result.diffRatio >= 0 && result.diffRatio <= 1);
    assert.ok(result.diffRatio <= maxDiffRatio, `Visual difference exceeded ${maxDiffRatio} at ${result.route} (${result.viewport}): ${result.diffRatio.toFixed(4)}`);
    assert.equal(result.hasHorizontalOverflow, false, `Horizontal overflow at ${result.route} (${result.viewport})`);
    assert.ok(result.headingCoverage >= 0.8, `Heading coverage regressed at ${result.route} (${result.viewport})`);
    assert.ok(result.textSimilarity >= minimumTextSimilarity, `Visible text differs at ${result.route} (${result.viewport}): ${result.textSimilarity.toFixed(4)}`);
  }
}

if (process.argv[1]?.replace(/\\/g, '/').endsWith('/compare-live-local-visuals.ts')) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
