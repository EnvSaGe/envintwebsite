const fs = require('fs');
const html = fs.readFileSync('scratch_live_careers.html', 'utf8');

const idx = html.indexOf('Explore a career');
if (idx !== -1) {
  // Find container
  const start = html.lastIndexOf('<section', idx) !== -1 ? html.lastIndexOf('<section', idx) : html.lastIndexOf('<div class="elementor-element', idx - 200);
  const end = html.indexOf('</section>', idx) !== -1 ? html.indexOf('</section>', idx) + 10 : idx + 2000;
  console.log('=== LIVE EXPLORE SECTION HTML ===');
  console.log(html.slice(start, end));
}
