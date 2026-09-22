import fs from 'node:fs';
import path from 'node:path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { config as loadEnv } from 'dotenv';

loadEnv({ path: path.resolve(process.cwd(), 'apps/admin/.env.local') });
loadEnv({ path: path.resolve(process.cwd(), 'packages/db/.env') });

const region = process.env.AWS_REGION || 'ap-south-1';
const bucket = process.env.AWS_S3_BUCKET || process.env.AWS_S3_BUCKET_NAME || 'envintcms';

const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

async function uploadFile(localPath: string, s3Key: string, contentType: string, disposition?: string) {
  const fileBuffer = fs.readFileSync(localPath);
  console.log(`Uploading ${localPath} (${fileBuffer.length} bytes) to s3://${bucket}/${s3Key}...`);
  
  const cmd = new PutObjectCommand({
    Bucket: bucket,
    Key: s3Key,
    Body: fileBuffer,
    ContentType: contentType,
    ContentDisposition: disposition || 'inline',
  });

  await s3.send(cmd);
  const publicUrl = `https://${bucket}.s3.${region}.amazonaws.com/${s3Key}`;
  console.log(`✓ Uploaded successfully: ${publicUrl}`);
  return publicUrl;
}

async function main() {
  const pdfPath = path.resolve(process.cwd(), 'docs/migration/Vantage.pdf');
  const webpPath = path.resolve(process.cwd(), 'vantage-2026-preview.webp');

  if (!fs.existsSync(pdfPath)) {
    throw new Error(`PDF not found: ${pdfPath}`);
  }
  if (!fs.existsSync(webpPath)) {
    throw new Error(`WebP preview not found: ${webpPath}`);
  }

  // 1. Upload PDF
  const pdfKey = 'media/uploads/Vantage-2026-Navigating-the-ESG-Reset.pdf';
  const pdfUrl = await uploadFile(
    pdfPath,
    pdfKey,
    'application/pdf',
    'inline; filename="Vantage-2026-Navigating-the-ESG-Reset.pdf"'
  );

  // 2. Also copy to apps/web/public/images/vantage-2026.webp and vantage-2026-cover.webp
  const targetWebPublic = path.resolve(process.cwd(), 'apps/web/public/images/vantage-2026.webp');
  fs.copyFileSync(webpPath, targetWebPublic);
  const targetCoverWebp = path.resolve(process.cwd(), 'apps/web/public/images/vantage-2026-cover.webp');
  fs.copyFileSync(webpPath, targetCoverWebp);
  console.log(`✓ Copied ${webpPath} to ${targetWebPublic} and ${targetCoverWebp}`);

  // 3. Upload cover image to S3 (both filenames)
  const imageKey1 = 'images/vantage-2026.webp';
  await uploadFile(webpPath, imageKey1, 'image/webp', 'inline');
  const imageKey2 = 'images/vantage-2026-cover.webp';
  const imageUrl = await uploadFile(webpPath, imageKey2, 'image/webp', 'inline');

  console.log('\n--- UPLOAD SUMMARY ---');
  console.log('PDF URL:   ', pdfUrl);
  console.log('Cover URL: ', imageUrl);
}

main().catch((err) => {
  console.error('Upload failed:', err);
  process.exit(1);
});
