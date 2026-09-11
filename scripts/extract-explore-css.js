const fs = require('fs');
const html = fs.readFileSync('scratch_live_careers.html', 'utf8');

// Find all CSS rules matching 2d172de, 7fbed48, 4cfd8a7, or their parent
const ids = ['2d172de', '7fbed48', '4cfd8a7'];
// Find parent container id
const idx = html.indexOf('2d172de');
const parentSlice = html.slice(Math.max(0, idx - 800), idx);
console.log('Parent HTML snippet:\n', parentSlice);

const parentIds = [...parentSlice.matchAll(/elementor-element-([a-z0-9]+)/gi)].map(m => m[1]);
console.log('Parent IDs:', parentIds);

const allIds = [...new Set([...ids, ...parentIds])];
allIds.forEach(id => {
  const re = new RegExp(`[^{}]*elementor-element-${id}[^{}]*\\{[^{}]*\\}`, 'gi');
  const matches = [...html.matchAll(re)].map(m => m[0]);
  console.log(`\n--- CSS for ${id} ---`);
  console.log(matches.join('\n'));
});
