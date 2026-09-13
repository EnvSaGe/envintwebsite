import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import {
  loadPublicRouteInventory,
  type PublicRouteEntry,
} from './lib/public-route-inventory';

const LIVE_ORIGIN = 'https://envintglobal.com';
const CAPTURE_ROOT = path.resolve('envintmigration/site-capture');
const HTML_DIR = path.join(CAPTURE_ROOT, 'html-current');
const SCREENSHOT_DIR = path.join(CAPTURE_ROOT, 'screenshots-current');
const INVENTORY_PATH = path.join(CAPTURE_ROOT, 'public-route-inventory.json');
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
] as const;

function readOption(name: string): string | undefined {
  const direct = process.argv.find((arg) => arg.startsWith(`--${name}=`));
  if (direct) return direct.slice(name.length + 3);
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function routeKey(routePath: string): string {
  if (routePath === '/') return 'home';
  return routePath.replace(/^\/+|\/+$/g, '').replace(/[^a-z0-9]+/gi, '--').toLowerCase();
}

function resolveChromeExecutable(): string {
  const configured = process.env.CHROME_PATH;
  const candidates = [
    configured,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ].filter((candidate): candidate is string => Boolean(candidate));

  const executable = candidates.find((candidate) => existsSync(candidate));
  if (!executable) {
    throw new Error('Chrome or Edge was not found. Set CHROME_PATH to a Chromium executable.');
  }
  return executable;
}

async function captureScreenshot(
  executable: string,
  url: string,
  outputPath: string,
  viewport: (typeof VIEWPORTS)[number],
): Promise<void> {
  const args = [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-first-run',
    '--no-default-browser-check',
    '--run-all-compositor-stages-before-draw',
    '--virtual-time-budget=8000',
    `--window-size=${viewport.width},${viewport.height}`,
    `--screenshot=${outputPath}`,
    url,
  ];

  await new Promise<void>((resolve, reject) => {
    const child = spawn(executable, args, { stdio: ['ignore', 'ignore', 'pipe'] });
    let stderr = '';
    child.stderr.on('data', (chunk) => {
      stderr += String(chunk);
    });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Screenshot failed for ${url} (${code}): ${stderr.trim()}`));
    });
  });
}

async function captureRoute(executable: string, route: PublicRouteEntry): Promise<void> {
  const key = routeKey(route.path);
  const url = new URL(route.path, LIVE_ORIGIN).toString();
  const response = await fetch(url, {
    headers: { 'user-agent': 'Envint CMS fidelity capture/1.0' },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  await writeFile(path.join(HTML_DIR, `${key}.html`), await response.text(), 'utf8');

  for (const viewport of VIEWPORTS) {
    const output = path.join(SCREENSHOT_DIR, `${key}--${viewport.name}.png`);
    await captureScreenshot(executable, url, output, viewport);
  }
}

async function main(): Promise<void> {
  const inventory = await loadPublicRouteInventory();
  const limitValue = Number.parseInt(readOption('limit') ?? '', 10);
  const requestedRoute = readOption('route');
  let routes = inventory.routes;
  if (requestedRoute) {
    const normalized = requestedRoute === '/' ? '/' : `/${requestedRoute.replace(/^\/+|\/+$/g, '')}/`;
    routes = routes.filter((route) => route.path === normalized);
  }
  if (Number.isFinite(limitValue) && limitValue > 0) routes = routes.slice(0, limitValue);

  await Promise.all([
    mkdir(HTML_DIR, { recursive: true }),
    mkdir(SCREENSHOT_DIR, { recursive: true }),
  ]);
  await writeFile(INVENTORY_PATH, `${JSON.stringify(inventory, null, 2)}\n`, 'utf8');

  const executable = resolveChromeExecutable();
  for (const [index, route] of routes.entries()) {
    process.stdout.write(`[${index + 1}/${routes.length}] ${route.path}\n`);
    await captureRoute(executable, route);
  }
  process.stdout.write(`Captured ${routes.length} routes into ${CAPTURE_ROOT}\n`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
