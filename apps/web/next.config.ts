import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  trailingSlash: true,
  reactStrictMode: true,
  transpilePackages: ['@envint/db', '@envint/shared'],
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 80, 90],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
