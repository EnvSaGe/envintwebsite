const fs = require('fs');
const html = fs.readFileSync('scratch_live_careers.html', 'utf8');

const idx = html.indexOf('careerfooter');
console.log(html.slice(idx - 400, idx + 2000));
