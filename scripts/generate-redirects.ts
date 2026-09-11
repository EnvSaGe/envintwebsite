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
    
    // Parse CSV handling quoted fields
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

export function generateRedirects() {
  const csvPath = path.resolve(__dirname, '../docs/migration/02-url-migration.csv');
  const targetRedirectsPath = path.resolve(__dirname, '../apps/web/public/_redirects');

  if (!fs.existsSync(csvPath)) {
    throw new Error(`Migration CSV not found at: ${csvPath}`);
  }

  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCsv(csvContent);

  const redirectRules: string[] = [];
  const removeRules: string[] = [];

  for (const row of rows) {
    const oldPath = new URL(row.old_url).pathname;

    if (row.action === '301_REDIRECT') {
      const targetPath = row.new_url;
      redirectRules.push(`${oldPath.padEnd(50)} ${targetPath.padEnd(45)} 301!`);
    } else if (row.action === '410_REMOVE') {
      removeRules.push(`${oldPath.padEnd(50)} /                                             410!`);
    }
  }

  const output = `# ==========================================================
# ENVINT GLOBAL - AUTO-GENERATED FROM 02-url-migration.csv
# DO NOT EDIT MANUALLY - Run: pnpm generate:redirects
# Total Redirect Rules: ${redirectRules.length}
# Total 410 Gone Rules: ${removeRules.length}
# ==========================================================

# 1. Explicit 301 Permanent Redirects (${redirectRules.length} rules)
${redirectRules.join('\n')}

# 2. Obsolete Implementation Endpoints (${removeRules.length} rules)
${removeRules.join('\n')}

# 3. Security & WordPress Cleanup (404 Not Found)
/wp-admin/*                                        /                                             404!
/wp-login.php                                      /                                             404!
/xmlrpc.php                                        /                                             404!
`;

  // Ensure public directory exists
  const publicDir = path.dirname(targetRedirectsPath);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(targetRedirectsPath, output, 'utf-8');
  console.log(`Generated ${redirectRules.length} 301 rules and ${removeRules.length} 410 rules into: ${targetRedirectsPath}`);
}

if (require.main === module) {
  generateRedirects();
}
