const fs = require('fs');
const html = fs.readFileSync('scratch_live_careers.html', 'utf8');

// Find all occurrences of bcd0920
const regex = /elementor-element-bcd0920\b[^{}]*\{[^{}]*\}/g;
let m;
while ((m = regex.exec(html)) !== null) {
  console.log(m[0]);
}

// Check parent container of bcd0920
const idx = html.indexOf('bcd0920');
const parentSlice = html.slice(Math.max(0, idx - 1500), idx);
console.log('\n--- Parent container snippet ---');
console.log(parentSlice);
