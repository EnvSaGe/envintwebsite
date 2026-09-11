import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const isProduction =
    process.env.CONTEXT === 'production' ||
    process.env.NEXT_PUBLIC_SITE_URL === 'https://envintglobal.com';

  if (!isProduction) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  const sitemap = 'https://envintglobal.com/sitemap.xml';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/search/', '/?s='],
      },
      // AI / LLM crawlers are explicitly welcome and pointed at the machine-
      // readable indexes (AEO/GEO: llms.txt, llms-full.txt, sitemap.xml).
      {
        userAgent: ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User'],
        allow: ['/', '/llms.txt', '/llms-full.txt'],
        disallow: ['/api/'],
      },
      {
        userAgent: ['ClaudeBot', 'Claude-Web', 'anthropic-ai'],
        allow: ['/', '/llms.txt', '/llms-full.txt'],
        disallow: ['/api/'],
      },
      {
        userAgent: ['PerplexityBot', 'Google-Extended', 'Applebot-Extended', 'cohere-ai'],
        allow: ['/', '/llms.txt', '/llms-full.txt'],
        disallow: ['/api/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/search/', '/?s='],
      },
    ],
    sitemap,
  };
}
