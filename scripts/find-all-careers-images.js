const fs = require('fs');
const html = fs.readFileSync('scratch_live_careers.html', 'utf8');

// Find all css in scratch_live_careers.html
const allImages = [...html.matchAll(/https:\/\/[^"'\s)]+\.(?:jpg|jpeg|png|webp|avif)/gi)].map(m => m[0]);
console.log('All image URLs found in live careers:');
console.log([...new Set(allImages)]);
