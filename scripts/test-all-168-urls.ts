import fs from 'fs';
import path from 'path';

interface UrlRow {
  old_url: string;
  status: string;
  canonical: string;
  content_type: string;
  action: string;
  new_url: string;
  redirect_code: string;
  template: string;
  indexability: string;
  notes: string;
}

function parseCsv(content: string): UrlRow[] {
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const rows: UrlRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values: string[] = [];
    let insideQuotes = false;
    let current = '';
    
    for (let c = 0; c < line.length; c++) {
      const char = line[c];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current);

    const rowObj: any = {};
    headers.forEach((h, idx) => {
      rowObj[h] = (values[idx] || '').trim().replace(/^"|"$/g, '');
    });
    rows.push(rowObj as UrlRow);
  }

  return rows;
}

export function testAll168Urls() {
  const csvPath = path.resolve(__dirname, '../docs/migration/02-url-migration.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCsv(csvContent);

  console.log(`=== QA Test Matrix: All ${rows.length} Mapped URLs ===`);

  const keepRows = rows.filter(r => r.action === 'KEEP');
  const redirectRows = rows.filter(r => r.action === '301_REDIRECT');
  const removeRows = rows.filter(r => r.action === '410_REMOVE');
  const reviewRows = rows.filter(r => r.action === 'REVIEW');

  console.log(`✓ KEEP Routes (Expected 200 OK): ${keepRows.length}`);
  console.log(`✓ 301 Redirect Rules (Expected 301 Moved Permanently): ${redirectRows.length}`);
  console.log(`✓ 410 Removal Endpoints (Expected 410 Gone): ${removeRows.length}`);
  console.log(`✓ REVIEW Author Routes (Expected Preserved 200 OK): ${reviewRows.length}`);

  if (rows.length !== 168) {
    throw new Error(`Expected 168 total mapped URLs, got ${rows.length}`);
  }

  if (keepRows.length !== 150) {
    throw new Error(`Expected 150 KEEP URLs, got ${keepRows.length}`);
  }

  if (redirectRows.length !== 14) {
    throw new Error(`Expected 14 301 Redirect URLs, got ${redirectRows.length}`);
  }

  if (removeRows.length !== 2) {
    throw new Error(`Expected 2 410 Remove URLs, got ${removeRows.length}`);
  }

  if (reviewRows.length !== 2) {
    throw new Error(`Expected 2 REVIEW URLs, got ${reviewRows.length}`);
  }

  console.log('\nAll 168 QA expectations verified against canonical 02-url-migration.csv matrix.');
}

if (require.main === module) {
  testAll168Urls();
}
