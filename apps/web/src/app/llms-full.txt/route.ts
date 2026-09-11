import { NextResponse } from 'next/server';
import { getInsights } from '@/lib/data/insights';
import { getImpacts } from '@/lib/data/impacts';
import { getTeamMembers } from '@/lib/data/team';

export async function GET() {
  const [insights, impacts, members] = await Promise.all([
    getInsights(),
    getImpacts(),
    getTeamMembers(),
  ]);

  const base = 'https://envintglobal.com';
  const clean = (s: string) =>
    String(s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

  let content = `# Envint — Full Site Guide for AI Systems\n\n`;
  content += `> Envint (${base}) is a sustainability and ESG solutions firm founded in Mumbai in 2018. Envint helps clients integrate sustainability into business strategy and operations, channelize responsible investment, and enable climate action. The firm works with India's leading corporates, global MNCs, DFIs, PE and VC funds, startups and not-for-profits.\n\n`;

  content += `## Company\n- Name: Envint (Envint Services LLP)\n- Founded: 2018, Mumbai, India\n- Contact: connect@envintglobal.com\n- Services: Sustainability Integration, Responsible Investment, Climate Action\n- Offices: multiple locations across India and international geographies\n\n`;

  content += `## Core Services\n\n`;
  content += `### Sustainability Integration\nURL: ${base}/sustainability-integration/\n`;
  content += `Envint embeds sustainability in core strategy and operations: strategy and roadmaps, baselining and assessments (including Scope 1-3 GHG accounting), rollout and implementation, disclosure (BRSR, GRI, SASB, TCFD, CDP) and supply-chain integration.\n\n`;
  content += `### Responsible Investment\nURL: ${base}/responsible-investment/\n`;
  content += `Envint helps funds and lenders channelize capital responsibly: ESG screening and due diligence, portfolio monitoring, ESAP development and responsible-investment frameworks.\n\n`;
  content += `### Climate Action\nURL: ${base}/climate-action/\n`;
  content += `Envint futureproofs organizations for a low-carbon economy: climate risk assessment, GHG/carbon accounting, decarbonization roadmaps and climate disclosure support.\n\n`;

  content += `## Impact Case Studies (${impacts.length})\n`;
  impacts.forEach((imp: any) => {
    content += `- [${imp.title}](${base}/impact/${imp.slug}/) — ${clean(imp.summary || imp.seoDescription || '').slice(0, 240)}\n`;
  });

  content += `\n## Insights & Thought Leadership (${insights.length})\n`;
  insights.forEach((i: any) => {
    content += `- [${i.title}](${base}/${i.slug}/) — ${clean(i.excerpt || i.seoDescription || '').slice(0, 240)}\n`;
  });

  content += `\n## Team & Leadership (${members.length})\n`;
  members.forEach((m: any) => {
    content += `- [${m.name} — ${m.roleTitle}](${base}/member/${m.slug}/)\n`;
  });

  content += `\n## Contact & Location\n`;
  content += `Visit ${base}/connect/ for the contact form. Email connect@envintglobal.com.\n`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
