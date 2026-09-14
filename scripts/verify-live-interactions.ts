import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const LOCAL_ORIGIN = process.env.LOCAL_ORIGIN ?? 'http://localhost:3000';

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

async function open(page: any, route = '/'): Promise<void> {
  const response = await page.goto(new URL(route, LOCAL_ORIGIN).toString(), { waitUntil: 'domcontentloaded', timeout: 45_000 });
  assert.ok(response?.ok(), `Failed to open ${route}: ${response?.status()}`);
  await page.addStyleTag({ content: 'nextjs-portal,.grecaptcha-badge,iframe{display:none!important}' });
  await page.waitForTimeout(750);
}

async function main(): Promise<void> {
  const chromium = await loadChromium();
  const browser = await chromium.launch({ executablePath: chromeExecutable(), headless: true });
  try {
    const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await open(desktop);
    const services = desktop.locator('a[aria-controls="desktop-menu-services"]');
    await services.hover();
    const serviceChild = desktop.locator('#desktop-menu-services').getByRole('link', { name: 'Sustainability Integration', exact: true });
    await serviceChild.waitFor({ state: 'visible', timeout: 5_000 });
    await desktop.keyboard.press('Escape');
    assert.equal(await serviceChild.isVisible(), false, 'Desktop dropdown did not close with Escape');

    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await open(mobile);
    const toggle = mobile.getByRole('button', { name: 'Toggle Navigation Menu' });
    await toggle.click();
    assert.equal(await toggle.getAttribute('aria-expanded'), 'true', 'Mobile menu did not open');
    await mobile.keyboard.press('Escape');
    assert.equal(await toggle.getAttribute('aria-expanded'), 'false', 'Mobile menu did not close with Escape');
    await toggle.click();
    const mobileServices = mobile.locator('button[aria-controls="mobile-menu-services"]');
    await mobileServices.click();
    assert.equal(await mobileServices.getAttribute('aria-expanded'), 'true', 'Mobile Services group did not expand');
    await mobileServices.press('Enter');
    assert.equal(await mobileServices.getAttribute('aria-expanded'), 'false', 'Mobile Services group did not collapse with keyboard input');

    for (const route of ['/', '/about/', '/services/', '/impact/', '/envision/', '/connect/']) {
      await open(mobile, route);
      const overflow = await mobile.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      assert.equal(overflow, false, `Horizontal overflow on mobile route ${route}`);
    }

    await open(desktop, '/connect/');
    const form = desktop.locator('form').first();
    if (await form.count()) {
      assert.equal(await form.evaluate((element: HTMLFormElement) => element.checkValidity()), false, 'Empty contact form should be invalid');
    }
  } finally {
    await browser.close();
  }
  console.log('[interactions] navigation, keyboard, responsive overflow, and form validation contracts pass');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
