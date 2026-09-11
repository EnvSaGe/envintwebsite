import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'mock-key',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'mock-secret',
  },
});

export async function createPresignedUploadUrl(
  filename: string,
  contentType: string,
  contentHash: string
) {
  const safeFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  // Immutable S3 object key convention: media/<hash>/<safe-filename>
  const key = `media/${contentHash}/${safeFilename}`;
  const bucket = process.env.AWS_S3_BUCKET || process.env.AWS_S3_BUCKET_NAME || 'envintcms';
  const region = process.env.AWS_REGION || 'ap-south-1';
  
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 600 });
  const publicUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

  return { uploadUrl, key, publicUrl };
}
