import { NextResponse } from 'next/server';
import { getInsights } from '@/lib/data/insights';
import { getImpacts } from '@/lib/data/impacts';
import { getTeamMembers } from '@/lib/data/team';
import archiveRoutes from '@/data/archive-routes.json';

export async function GET() {
  const [insights, impacts, members] = await Promise.all([
    getInsights(),
    getImpacts(),
    getTeamMembers(),
  ]);

  const base = 'https://envintglobal.com';
  let content = `# Envint\n\n`;
  content += `> Envint is a sustainability & ESG solutions firm. We help clients integrate sustainability, channelize responsible investment and enable climate action.\n`;
  content += `> Contact: connect@envintglobal.com | ${base}/connect/\n\n`;

  content += `## Core Pages\n`;
  for (const p of [
    ['About Envint', '/about/'],
    ['Our Services', '/services/'],
    ['Impact Case Studies', '/impact/'],
    ['Careers at Envint', '/careers-at-envint/'],
    ['Connect (Contact)', '/connect/'],
    ['ESQ Newsletter', '/esq/'],
    ['Mapsense Screening Tool', '/mapsense/'],
  ] as const) {
    content += `- [${p[0]}](${base}${p[1]})\n`;
  }

  content += `\n## Services\n`;
  content += `- [Sustainability Integration](${base}/sustainability-integration/)\n`;
  content += `- [Responsible Investment](${base}/responsible-investment/)\n`;
  content += `- [Climate Action](${base}/climate-action/)\n`;

  const hubs = [
    ['Envision', '/envision/'],
    ['Enviki', '/enviki/'],
    ['Behind the Buzz', '/behind-the-buzz/'],
    ['Glossary Zone', '/glossary-zone/'],
    ['How to Articles', '/how-to-articles/'],
  ] as const;
  content += `\n## Knowledge Hubs\n`;
  for (const [name, path] of hubs) {
    content += `- [${name}](${base}${path})\n`;
  }

  content += `\n## Taxonomy Archives\n`;
  for (const r of archiveRoutes as { type: string; slug: string }[]) {
    content += `- [${r.type}/${r.slug}](${base}/${r.type}/${r.slug}/)\n`;
  }

  content += `\n## Insights & Thought Leadership (${insights.length} Articles)\n`;
  insights.forEach((i: any) => {
    content += `- [${i.title}](${base}/${i.slug}/)\n`;
  });

  content += `\n## Impact Case Studies (${impacts.length})\n`;
  impacts.forEach((imp: any) => {
    content += `- [${imp.title}](${base}/impact/${imp.slug}/)\n`;
  });

  content += `\n## Team & Leadership\n`;
  members.forEach((m: any) => {
    content += `- [${m.name} - ${m.roleTitle}](${base}/member/${m.slug}/)\n`;
  });

  content += `\n## Machine-Readable Index\n`;
  content += `- [Full page summaries for AI (llms-full.txt)](${base}/llms-full.txt)\n`;
  content += `- [Sitemap XML](${base}/sitemap.xml)\n`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
