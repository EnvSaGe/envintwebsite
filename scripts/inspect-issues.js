const https = require('https');
const fs = require('fs');

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  // 1. Inspect About Page Journey on live site
  console.log('--- FETCHING LIVE ABOUT PAGE ---');
  const aboutHtml = await fetch('https://envintglobal.com/about/');
  const journeyMatch = aboutHtml.match(/journeyheader[\s\S]*?(?:A team you|teamSection|<footer)/i);
  if (journeyMatch) {
    fs.writeFileSync('scratch_live_journey.html', journeyMatch[0]);
    console.log('Saved scratch_live_journey.html, length:', journeyMatch[0].length);
  } else {
    console.log('Journey not found');
  }

  // 2. Inspect Live Careers Page
  console.log('--- FETCHING LIVE CAREERS PAGE ---');
  const careersHtml = await fetch('https://envintglobal.com/careers-at-envint/');
  fs.writeFileSync('scratch_live_careers.html', careersHtml);
  console.log('Saved scratch_live_careers.html, length:', careersHtml.length);

  // 3. Inspect Live Envision (Blogs) Page
  console.log('--- FETCHING LIVE ENVISION PAGE ---');
  const envisionHtml = await fetch('https://envintglobal.com/envision/');
  fs.writeFileSync('scratch_live_envision.html', envisionHtml);
  console.log('Saved scratch_live_envision.html, length:', envisionHtml.length);
}

main().catch(console.error);
