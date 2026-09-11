const fs = require('fs');
const html = fs.readFileSync('scratch_live_careers.html', 'utf8');

const matches = [...html.matchAll(/[^{}]*careerfooter[^{}]*\{[^{}]*\}/gi)].map(m => m[0]);
console.log('=== CSS FOR careerfooter ===');
console.log(matches.join('\n'));

// Also find any background image or styling for bcd0920
const bcd = [...html.matchAll(/[^{}]*bcd0920[^{}]*\{[^{}]*\}/gi)].map(m => m[0]);
console.log('\n=== CSS FOR bcd0920 ===');
console.log(bcd.join('\n'));
