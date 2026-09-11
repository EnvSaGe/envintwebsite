const fs = require('fs');
const html = fs.readFileSync('scratch_live_journey.html', 'utf8');

const idx = html.indexOf('swiper-slide');
console.log(html.slice(idx - 100, idx + 2000));
