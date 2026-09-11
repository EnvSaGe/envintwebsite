const fs = require('fs');
const html = fs.readFileSync('scratch_live_careers.html', 'utf8');

// Strip tags and print non-empty lines
const textLines = html
  .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
  .replace(/<[^>]+>/g, '\n')
  .split('\n')
  .map(l => l.trim())
  .filter(l => l.length > 0 && !l.startsWith('{') && !l.startsWith('('));

// Find unique significant lines
console.log('--- CAREERS PAGE TEXT FLOW ---');
const flow = [];
for (let i = 0; i < textLines.length; i++) {
  const line = textLines[i];
  if (line.includes('Envint') || line.includes('career') || line.includes('team') || line.includes('difference') || line.includes('Apply') || line.includes('sustainability')) {
    flow.push(line);
  }
}
console.log(flow.slice(0, 40).join('\n'));
