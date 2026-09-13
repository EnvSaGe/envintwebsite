import fs from 'fs';
import path from 'path';

const appDir = path.resolve(__dirname, '../apps/web/src/app');
const publicDir = path.resolve(__dirname, '../apps/web/public');

function getFiles(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(filePath));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(filePath);
    }
  });
  return results;
}

const files = getFiles(appDir);
const missingImages: { file: string; img: string }[] = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  const matches = content.matchAll(/['"](\/images\/[^'"]+)['"]/g);
  for (const match of matches) {
    const imgPath = match[1];
    const fullPath = path.join(publicDir, imgPath);
    if (!fs.existsSync(fullPath)) {
      missingImages.push({ file: path.relative(path.resolve(__dirname, '..'), file), img: imgPath });
    }
  }
});

console.log('TOTAL MISSING IMAGES COUNT:', missingImages.length);
missingImages.forEach(m => console.log(`${m.file} -> ${m.img}`));
