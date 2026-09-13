import https from 'https';
import fs from 'fs';

function fetchUrl(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function extractTextElements(html: string): string[] {
  const clean = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  
  const elements = [...clean.matchAll(/<(h[1-6]|p)[^>]*>([\s\S]*?)<\/\1>/gi)];
  return elements.map(e => {
    const tag = e[1].toLowerCase();
    const text = e[2].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
    return text ? `[${tag}] ${text}` : null;
  }).filter(Boolean) as string[];
}

async function main() {
  console.log('Fetching live homepage...');
  const liveHomeHtml = await fetchUrl('https://envintglobal.com/');
  const liveHomeElements = extractTextElements(liveHomeHtml);
  fs.writeFileSync('scripts/live_home_elements.txt', liveHomeElements.join('\n'));
  console.log(`Saved ${liveHomeElements.length} live home elements to scripts/live_home_elements.txt`);

  console.log('Fetching live services...');
  const liveServicesHtml = await fetchUrl('https://envintglobal.com/services/');
  const liveServicesElements = extractTextElements(liveServicesHtml);
  fs.writeFileSync('scripts/live_services_elements.txt', liveServicesElements.join('\n'));
  console.log(`Saved ${liveServicesElements.length} live services elements to scripts/live_services_elements.txt`);

  console.log('Fetching live about...');
  const liveAboutHtml = await fetchUrl('https://envintglobal.com/about/');
  const liveAboutElements = extractTextElements(liveAboutHtml);
  fs.writeFileSync('scripts/live_about_elements.txt', liveAboutElements.join('\n'));
  console.log(`Saved ${liveAboutElements.length} live about elements to scripts/live_about_elements.txt`);

  console.log('Fetching live careers...');
  const liveCareersHtml = await fetchUrl('https://envintglobal.com/careers-at-envint/');
  const liveCareersElements = extractTextElements(liveCareersHtml);
  fs.writeFileSync('scripts/live_careers_elements.txt', liveCareersElements.join('\n'));
  console.log(`Saved ${liveCareersElements.length} live careers elements to scripts/live_careers_elements.txt`);
}

main().catch(console.error);
