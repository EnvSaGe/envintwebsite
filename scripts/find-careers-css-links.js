const fs = require('fs');
const html = fs.readFileSync('scratch_live_careers.html', 'utf8');

const cssLinks = [...html.matchAll(/href="([^"]*\.css[^"]*)"/gi)].map(m => m[1]);
console.log('CSS links in live careers:');
console.log(cssLinks.filter(l => l.includes('post') || l.includes('elementor') || l.includes('upload')));
