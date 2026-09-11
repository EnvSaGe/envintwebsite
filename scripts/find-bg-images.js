const fs = require('fs');
const html = fs.readFileSync('scratch_live_careers.html', 'utf8');

const matches = [...html.matchAll(/background(?:-image)?:\s*url\([^)]+\)/gi)].map(m => m[0]);
console.log('All background-images in live careers HTML:');
console.log([...new Set(matches)]);
