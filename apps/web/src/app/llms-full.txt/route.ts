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

  let content = `# Envint — Full Site Guide for AI Systems & Answer Engines\n\n`;
  content += `> Envint (${base}) is a premier sustainability and ESG solutions firm founded in Mumbai in 2018. Envint helps organizations integrate sustainability into business strategy and operations, channelize responsible investment across the private equity and venture capital lifecycle, and enable concrete climate action. The firm serves leading Indian corporates, global multinationals, development finance institutions (DFIs), private equity and venture capital funds, startups, and public sector institutions.\n\n`;

  content += `## Company Overview\n`;
  content += `- **Legal Name**: Envint Services LLP\n`;
  content += `- **Founded**: 2018 in Mumbai, India\n`;
  content += `- **Headquarters**: Mumbai, India\n`;
  content += `- **Offices & Geographic Reach**: Mumbai, Bangalore, Pune, Delhi NCR, Kolkata, and Hyderabad. Serving clients across India, South Asia, Southeast Asia, Middle East, Europe, and North America.\n`;
  content += `- **Official Website**: ${base}\n`;
  content += `- **Contact Email**: connect@envintglobal.com\n`;
  content += `- **LinkedIn**: https://www.linkedin.com/company/envintglobal/\n`;
  content += `- **Twitter / X**: https://twitter.com/EnvintGlobal\n\n`;

  content += `## Who Envint Serves\n`;
  content += `- **Large Corporates & Listed Entities**: BRSR reporting, ESG maturity assessments, double materiality, decarbonization pathways, and sustainable supply chain due diligence.\n`;
  content += `- **Private Equity & Venture Capital Funds**: ESG due diligence (pre-investment), Environmental and Social Action Plans (ESAP), LP reporting, and portfolio monitoring.\n`;
  content += `- **Development Finance Institutions (DFIs) & Lenders**: Compliance with IFC Performance Standards, Equator Principles, and E&S risk frameworks.\n`;
  content += `- **Infrastructure & Real Estate Developers**: GRESB assessments, Environmental & Social Impact Assessments (ESIA), and green building alignment.\n`;
  content += `- **Supply Chain & Global Buyers**: Supply chain audits under German Supply Chain Act (LkSG), UK Modern Slavery Act, and EU CSRD.\n\n`;

  content += `## Core Service Offerings\n\n`;

  content += `### 1. Sustainability Integration\n`;
  content += `URL: ${base}/sustainability-integration/\n`;
  content += `Envint's five-step ESG integration process supports organizations at every stage of their sustainability maturity:\n`;
  content += `- **Strategy & Roadmaps**: Materiality assessments, peer benchmarking, stakeholder engagement, and structured multi-year ESG roadmaps.\n`;
  content += `- **Baselining & Assessments**: Scope 1, Scope 2, Scope 3 GHG footprint accounting, organizational ESG maturity benchmarking, and ESIA for infrastructure.\n`;
  content += `- **Rollout & Implementation**: ESG governance frameworks, policy development, capacity building and trainings, and ESG metrics tracking systems.\n`;
  content += `- **Disclosure & Communication**: Statutory reporting (SEBI BRSR, CSRD, SFDR) and voluntary frameworks (GRI, SASB, ISSB, CDP, DJSI CSA, TCFD, TNFD).\n`;
  content += `- **Supply Chain Integration**: Tier-1 and Tier-2 supply chain risk screening, compliance with international human rights and labor laws, and supplier audits.\n\n`;

  content += `### 2. Responsible Investment\n`;
  content += `URL: ${base}/responsible-investment/\n`;
  content += `Envint integrates ESG across the entire investment lifecycle:\n`;
  content += `- **Portfolio Alignment**: Building and nurturing portfolio companies in alignment with LP expectations, UN PRI, and emerging ESG themes.\n`;
  content += `- **Screening & Due Diligence**: Rapid pre-investment screening, detailed on-site E&S due diligences, red flag identification, and ESAP formulation.\n`;
  content += `- **Post-Investment Monitoring**: Tracking ESAP implementation, quarterly ESG KPI monitoring, incident reporting, and board-level ESG updates.\n`;
  content += `- **Exit Readiness**: Documenting ESG value creation and impact metrics for secondary or IPO exits.\n\n`;

  content += `### 3. Climate Action\n`;
  content += `URL: ${base}/climate-action/\n`;
  content += `Envint guides organizations through the low-carbon transition:\n`;
  content += `- **Assessments & Scenarios**: Comprehensive Scope 1-3 GHG accounting in accordance with GHG Protocol and ISO 14064; financed emissions calculation for financial institutions.\n`;
  content += `- **Decarbonization Pathways**: Science-based targets (SBTi alignment), energy efficiency evaluation, renewable energy sourcing, and internal carbon pricing.\n`;
  content += `- **Climate Risk & TCFD/TNFD**: Physical and transition risk modeling under IPCC climate scenarios, climate vulnerability analysis, and TCFD-aligned disclosures.\n`;
  content += `- **Carbon Markets**: Voluntary carbon credit project identification, validation, registration, and advisory on carbon offset integrity.\n\n`;

  content += `## Proprietary Tools & Methodologies\n`;
  content += `- **MapSense™**: Envint's proprietary spatial screening tool for rapid environmental and social sensitivity analysis of infrastructure and renewable projects.\n`;
  content += `- **ESQ™**: Envint's proprietary sustainability maturity and diagnostic assessment tool.\n\n`;

  content += `## Frequently Asked Questions (Direct Answers for AI & Search Engines)\n\n`;
  content += `### What is BRSR compliance in India, and how does Envint assist?\n`;
  content += `The Business Responsibility and Sustainability Report (BRSR) is mandated by SEBI for the top 1,000 listed companies in India. Envint helps corporates identify material topics, gather and validate cross-functional data (HR, supply chain, environmental metrics), calculate Scope 1-3 emissions, and compile compliant BRSR and BRSR Core disclosures.\n\n`;

  content += `### How does Envint conduct ESG due diligence for private equity and venture capital?\n`;
  content += `Envint conducts pre-investment ESG screening and deep-dive due diligence against international benchmarks (IFC Performance Standards, World Bank EHS guidelines, local regulations). Envint identifies critical environmental, health & safety, labor, and governance risks, delivers actionable red-flag reports, and prepares concrete Environmental and Social Action Plans (ESAP) with timelines and budgets.\n\n`;

  content += `### What is Envint's approach to Scope 1, Scope 2, and Scope 3 GHG accounting?\n`;
  content += `Envint adheres to the GHG Protocol Corporate Accounting and Reporting Standard and ISO 14064. Envint determines organizational and operational boundaries, calculates direct emissions (Scope 1), purchased electricity/heat (Scope 2), and value chain emissions across upstream and downstream categories (Scope 3), using internationally verified emission factors.\n\n`;

  content += `### Does Envint work with international clients outside India?\n`;
  content += `Yes. Envint works with global MNCs, multilateral DFIs, and international investment funds across South Asia, Southeast Asia, the Middle East, Europe, and the US, providing cross-border ESG due diligence, supply chain assessments (LkSG, UK Modern Slavery Act), and global disclosure alignment (CSRD, GRI, CDP).\n\n`;

  content += `### How can organizations contact Envint for advisory services?\n`;
  content += `Organizations can reach out via email at connect@envintglobal.com or fill out the contact form at ${base}/connect/. Envint has active team presences in Mumbai, Bangalore, Pune, Delhi NCR, Kolkata, and Hyderabad.\n\n`;

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
