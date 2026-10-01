# Envint Website Modernization & Client-Acquisition Plan

**Audited:** the running `envintglobal.com` build + this monorepo (`apps/web`, `apps/admin`, `packages/shared/src/page-trees`).
**Audit date:** 28 September 2026
**Scope:** design/layout modernization + new features that generate qualified client conversations.

This is deliberately not a "10 website trends for 2026" list. Every claim below is either (a) something I verified in your code or on your live site, or (b) an external finding with the source named at the end.

---

## 1. The uncomfortable finding (read this first)

Before any redesign conversation: **your lead pipeline is currently a black hole.**

Evidence from the code:

- `apps/web/src/app/api/forms/contact/route.ts` inserts submissions into the `lead_submissions` Postgres table, then hits this line:

  ```
  // Configurable recipient notifications via server-only env: process.env.CONTACT_FORM_RECIPIENTS
  // Outbound email dispatched via sanitized template (e.g. Resend/SES) in production
  ```

  That's a comment, not code. No email, no webhook, no CRM push, no Slack ping.
- `newsletter/route.ts` and `gbc/route.ts` do the same insert-and-stop.
- There is **no Leads screen in the admin portal.** `apps/admin/src/app/` contains pages, insights, case-studies, team, media, templates, navigation, settings, analytics — and nothing that reads `lead_submissions`.

So: if a CSO at a listed Indian manufacturer fills in your contact form tomorrow, the record lands in a database table that no human is looking at. The `<form>` even submits fine and shows a success message, which means **you cannot tell you're losing leads.**

I'm leading with this because it changes the plan. A beautiful redesign on top of this converts *into a void*. Fixing it is a few days of work and is the single highest-ROI item in this document. Everything else is downstream.

### The second finding: your content moat has no conversion machinery attached

I audited what conversion mechanisms exist on your highest-value pages:

| Page | Forms on page | Contextual CTA | Booking link | Gated asset |
|---|---|---|---|---|
| `/eu-cbam-compliance-guide/` | 1 (footer newsletter) | none | none | none |
| `/brsr-getting-ready-for-round-2/` | 1 (footer newsletter) | none | none | none |
| `/impact/` (26 case studies) | 1 (footer newsletter) | none | none | none |
| `/services/` | 1 (footer newsletter) | none | none | none |
| `/esq/` (your ESG tool) | 1 (footer newsletter) | none | none | none |
| `/mapsense/` (your screening tool) | 1 (footer newsletter) | none | none | none |
| `/connect/` | 2 | "Get in touch" | none | none |

There is no Calendly/booking anywhere on the site. There is not a single PDF lead magnet. 153 URLs of top-of-funnel traffic, and the only thing a reader can do is scroll to the footer and subscribe to a newsletter — or navigate to a generic form.

The `/eu-cbam-compliance-guide/` row is the painful one. See §3.

---

## 2. What you actually have (the honest asset inventory)

This is a strong hand, which is why the gaps are frustrating.

- **153 public URLs** (live sitemap).
- **54 insight articles**, including a "How-to" hub and an Enviki explainer library covering exactly the terms your buyers search while building a business case: BRSR, CBAM, EPR, SBTi v2, GHG Protocol, LCA/PCF/EPD, Carbon Accounting, India's Carbon Credit Offset Mechanism, India's Climate Finance Taxonomy, EcoVadis, GRESB, CCPA greenwashing guidelines.
- **26 impact case studies** with `service` → `sector` → `theme` → `sub-service` taxonomies already modelled in the database, including many-to-many.
- **39 taxonomy archive URLs** (`/sector/*`, `/theme/*`, `/sub-service/*`) already indexed.
- **15 team members** with bios, leadership flags and LinkedIn URLs.
- **Two proprietary tools** — MapSense (ecosystem/spatial screening) and ESQ (ESG intelligence).
- **Vantage** — an annual flagship publication, positioned as "Vantage 2026: Navigating the ESG Reset".
- A CMS with a visual builder, RBAC, version history, scheduled publishing, and HMAC-signed cache revalidation.

The gap isn't content, credibility, or tooling. It's that **none of it is wired to ask for the business.**

---

## 3. Why 2026 specifically (the timing argument)

Your market is being repriced by regulation right now, and your existing content already sits on the keywords. Three concrete windows:

**EU CBAM entered its definitive regime on 1 January 2026.** It moved from reporting to a *financial obligation* — importers need authorised CBAM declarant status, and the first annual declaration plus certificate surrender is due **30 September 2027** (European Commission; DEHSt). That means 2026 is the year Indian exporters and their EU customers are selecting advisors to get ready. You already published `/eu-cbam-compliance-guide/`. It has zero CTAs on it.

**BRSR Core reasonable assurance is phasing to the top 1,000 listed companies by FY2026-27**, up from the top 150 (SEBI expert-committee glide path; corroborated by KPMG's 2026 BRSR reporting analysis). Every newly-in-scope company needs an external advisor to prepare data for an assurance provider — and they are deciding *now*. Your buyers are precisely these companies.

**Buyer behaviour has moved decisively to self-service research.** Gartner's buyer-journey research finds B2B buyers spend only **17%** of their total purchase time meeting with potential suppliers, and a March 2026 Gartner survey found **67% of B2B buyers prefer a rep-free experience**. Translate that for a consultancy: ~83% of your buying cycle happens on your website and your published thinking, *before* a prospect will talk to you. If the website only offers a generic form, you are absent for 83% of the decision.

**And thought leadership is the mechanism that works on this buyer.** The Edelman–LinkedIn 2025 B2B Thought Leadership Impact Report found **56%** of target buyers use thought leadership as part of their vendor evaluation (55% for "hidden" non-user stakeholders like finance, legal, and procurement), and **41%** of target buyers said a C-suite executive encouraged them to consider a *specific vendor* after engaging with that vendor's thought leadership. That last number is the one to internalise: your articles are not marketing garnish, they are the thing that generates executive-level sponsorship inside a buying committee — you just have no idea which buyer read which article.

**Caveat on market-size stats.** Every "ESG consulting market" number I found conflicts by an order of magnitude ($13B–$45B for 2026, depending on the analyst and the definition). Don't build a business case on them. The defensible signal is the *direction*, which FactMR characterises as the market moving "from voluntary sustainability statements toward auditable" disclosures. That's a move from advice to assurance-readiness — higher-stakes, harder to do in-house, longer engagements. Good news for a firm like yours.

**Competitive reality.** You compete for the same mandates as EY, KPMG and Deloitte India — see the search-result landscape where EY's sustainability practice, FTI and Bain all rank alongside you. You cannot outspend them. What boutique advisory firms win on is specialisation, senior-person access, and speed. **Your website should be an argument for those three things, not a cheaper-looking imitation of a Big 4 site.** That's the strategic constraint that should drive the whole redesign.

---

## 4. What "proper design and layout" should mean here

The design justification is not aesthetics — it's that **design quality is a credibility signal, and credibility is what a consultancy sells.** Nielsen Norman Group's credibility research (Jakob Nielsen's original four factors, reconfirmed in NN/g's cross-cultural usability study) identifies exactly four things users use to judge whether a site — and therefore the business — is trustworthy:

1. **Design quality** — clear organisation, meaningful navigation labels, deliberate colour and whitespace. NN/g's specific finding: typos, broken links and sloppiness degrade credibility immediately and communicate "an overall lack of attention to detail." For an advisory firm, that is the entire product.
2. **Up-front disclosure** — NN/g: when sites omitted basic information, "they were almost immediately ruled out of consideration in favour of more upfront sites." Applied to you: publish indicative engagement models, typical timelines, and who the client will actually work with. Right now a buyer cannot tell if a BRSR engagement takes 4 weeks or 9 months.
3. **Comprehensive, correct, and current** — date your content, show it's maintained.
4. **Connection to the rest of the web** — citations, publications, people findable elsewhere (your team's LinkedIn presence, awards, press).

So the modernization goals are:

**D1 — Replace the ad-hoc styling with a real design system.**
Current state: `apps/web/src/styles/tokens.css` is ~40 lines (colours, radii, shadows). `globals.css` is ~500 lines of hand-written utility classes with heavy `!important` usage. Components style themselves with inline JS objects — `Header.tsx` alone is hundreds of lines of inline style, and hex values like `#2F7ABE`, `#393939`, `#404040`, `#F0F0F0` are repeated literally across files instead of referencing tokens.

Needed: a proper type scale, spacing scale, semantic colour roles (surface / text / border / state — not "brand-blue"), elevation, motion tokens, container widths, and a z-index scale. Then migrate the `!important` overrides to real component styles.

**D2 — Resolve the CSS-ownership conflict. That's the actual architectural problem.**
You have a visual builder that writes inline styles into the page tree *and* hand-authored components with inline styles *and* global `!important` overrides fighting the tree. The `!important` in `.servicebox01`, `.enviki-subhub-card` and the search-bar rules are all evidence of this collision. You need an explicit policy: which properties belong to the design system (non-editable) and which the editor owns. Until that's decided, every restyle re-fights the builder. **Decide this before writing CSS.**

**D3 — Rebuild the page templates as argument, not inventory.**
The current homepage (`/`) does: full-bleed dark hero → Vantage banner → "We help you with..." 3 service cards → *#TheEnvintWay* culture values → 4 counter stats (550+, 185+, 10+, 6) → 3 latest articles → newsletter. That is a standard template. Two specific problems:

- The H1 is a 12-word, three-clause sentence: *"We help clients integrate sustainability, channelize responsible investment and enable climate action."* It never says **who** it helps or **what changes** for them. A CFO cannot tell in 5 seconds whether this firm fits.
- The proof section is anonymous counters. `550+`, `185+`, `10+`, `6` test the reader's patience — proof of scale with no outcome and no name. NN/g's "up-front disclosure" applies: the counters substitute for the disclosure buyers actually want.

The rebuild target for each template is in §5.

**D4 — Make the mobile experience a first-class citizen.**
You have ~153 indexed URLs and your buyers are CSOs and fund partners who read during commutes. Mobile form conversion runs materially below desktop — the Digital Applied 2026 form benchmark set puts mobile lead-gen forms roughly a third lower than desktop (8.7% vs 12.8%). Any new conversion element must be designed mobile-first, not shrunk down.

---

## 5. The plan

Sequenced deliberately. **Do not start at Phase 2.**

### Phase 0 — Stop the leak (target: 1 week)

Nothing else in this document works until this is done. It is small, boring, and worth more than the redesign.

1. **Deliver leads.** On `contact`, `newsletter` and `gbc` submit: send an email to a configurable recipient list, POST to a Slack/Teams webhook, and (if you have one) push to the CRM. Make the recipient list an env var exactly as the existing comment intended.
2. **Add a Leads inbox in the admin portal** (`apps/admin/src/app/leads/`), following the existing pattern of `case-studies`/`insights`: table of submissions, read/unread state, filter by form type, filter by date, CSV export. Leads must be visible without querying Postgres by hand.
3. **Alert on failure.** The form routes swallow database errors in a `catch {}` block with a comment about "offline local dev". In production that silently discards a lead. Log it, and fail loudly.
4. **Verify delivery.** Submit a real test lead end-to-end on production and confirm a human receives it and it appears in the admin inbox. Until that's confirmed, treat the site as having no lead capture.

### Phase 1 — Conversion instrumentation (target: 1 week, parallel with Phase 0)

You already have a privacy-respecting analytics pipeline (`AnalyticsBeacon`, `/api/analytics`, the admin dashboard with page views, unique visitors, countries, devices, referrers, and AI-bot crawls). It measures **traffic**. It does not measure **intent**.

5. **Add goal events**, not just page views: form submits, tool interactions, lead-magnet downloads, outbound clicks to booking, scroll-depth on service pages, PDF views. Store as event rows alongside the existing analytics events.
6. **Add a per-article conversion panel to the admin analytics dashboard**: which articles produce leads, not just which get traffic. This is the only way to know which of your 54 articles is actually a sales asset. Given the Edelman finding that 41% of buyers get a C-suite nudge after reading thought leadership, the article that generated a lead is worth more than the article with the most views.
7. **Add first-touch attribution** to `lead_submissions` — capture `referrer` and `landing_path` on the client and store them. Right now every lead is anonymous about its origin.

### Phase 2 — Design system foundation (target: 2–3 weeks)

Depends on the D2 ownership decision. This is the "modernize the design" work the user asked for, done in an order that doesn't get undone later.

8. Rebuild `tokens.css` as the real system: type scale, spacing scale, semantic colour roles, elevation, motion, container widths, z-index.
9. Migrate components off inline styles. Start with `Header.tsx` and `Footer.tsx` — they're the highest-traffic, most-inline-styled files and touch every page. **These two are also frozen by parity-first thinking** (see the `DARK_HERO_PAGES` / `LIGHT_HERO_PAGES` lists in `Header.tsx`, which hardcode per-route header colours to match the old WordPress site). A modernization should replace that hardcoded route list with a system — e.g. a CSS custom property set per page template — so new pages don't require editing the header.
10. Replace `!important` overrides with component-scoped styles. Establish the design-system-vs-editor property split from D2 and enforce it.
11. **Document it** alongside `docs/cms-builder/05-style-system.md`, so the CMS builder's inspector options and the CSS tokens are provably the same vocabulary. Right now they're two parallel universes.

### Phase 3 — Page template rebuild (target: 3–4 weeks)

Reuse the existing page-tree architecture (`packages/shared/src/page-trees/`) rather than replacing it — that's the right architecture for a CMS-driven site and it survives.

12. **Homepage.** Specific changes:
    - H1 that names the audience and the outcome, with the current sentence demoted to the subhead.
    - Client logo wall or named reference clients above the fold-adjacent proof section. A consultancy's single most persuasive asset is who trusts it, and it's currently absent from the homepage.
    - Replace anonymous counters with counters **bound to outcomes** ("550+ engagements, including BRSR Core readiness for N listed companies").
    - Surface 3 case studies with quantified results and service/sector tags, not 3 latest blog posts. Blog posts demonstrate thinking; case studies demonstrate delivery. Buyers shortlisting a firm want the second.
    - A real primary CTA ("Talk to a partner about BRSR Core readiness") instead of only the nav's generic "Connect".
13. **Service pages** (`/services/`, `/sustainability-integration/`, `/responsible-investment/`, `/climate-action/`). Add, per page: who it's for, what a typical engagement looks like and how long it takes, deliverables, the named team, 2–3 relevant case studies, and a booking CTA. This is NN/g's "up-front disclosure" applied to a consultancy — and it is the thing that removes the main objection ("are these people going to be expensive and slow?").
14. **Case study pages** (26 of them). Add a findings → approach → outcome structure with at least one measurable outcome, the sector/theme/service metadata rendered as navigable links, and a "related work" block. Add a **faceted finder** on `/impact/` using the taxonomies you already have in the database — buyers shortlist by "show me your manufacturing decarbonisation work", and right now they can't.
15. **Taxonomy archives** (`/sector/*`, `/theme/*`, `/sub-service/*` — 39 indexed URLs). These are currently thin index pages. Upgrade them into genuine landing pages with an intro, the services most relevant to that sector, relevant case studies, and a CTA. Highest effort-to-value ratio in the entire plan: the data already exists and the URLs already rank.
16. **Article and case-study templates.** Add the end-of-article conversion block from Phase 4, an author byline with a link to the team profile (your 15 bios are unused credibility), a "last updated" date, and related content.
17. **About page.** Lead with the people, not the journey timeline. Add the disclosure buyers want: how many people, where, what sectors, and who owns client relationships.

### Phase 4 — Conversion architecture (target: 3–4 weeks, overlaps Phase 3)

18. **Contextual CTAs mapped to intent.** This is the highest-value, lowest-effort item after Phase 0. You already have the mapping data — articles carry `category` and your services and sub-services are modelled. So:
    - `/eu-cbam-compliance-guide/` → "Get your CBAM exposure assessed" + the Climate Action team.
    - `/brsr-getting-ready-for-round-2/`, `/brsr-for-value-chain-compliance-and-implementation/`, `/brsr-compliance-for-the-top-1000-listed-entities/` → BRSR Core assurance readiness CTA.
    - `/esg-reporting/`, `/sustainability-reporting/`, `/impact-reporting-a-practical-guide/` → reporting/disclosure engagement CTA.
    - `/esg-due-diligence-*`, `/responsible-investment-*` → ESG-DD for PE/DFI CTA.
    Build this as a reusable builder element so editors can attach a CTA to any article from the CMS, with a sensible topic→service default.
19. **Booking.** Add a calendar embed (Calendly / Cal.com / Google Appointments) to every service page, every case study, every article, and `/connect/`. "Book 30 minutes with a partner" outperforms "submit an enquiry and wait" for the 67% of buyers who want a rep-free path to a decision.
20. **Lead magnets that match the regulation windows.**
    - *CBAM Readiness Checklist* — scoped to the 30 Sep 2027 declaration deadline.
    - *BRSR Core Assurance Readiness Assessment* — a short self-assessment returning a readiness band and next steps.
    - *ESG-DD Data Request Template* — for PE/DFI teams.
    - *Vantage 2026* already exists; give it a permanent home, a summary transcript, and a webinar, and use the gated PDF as the email-capture moment.
    Principle: **ungate the article, gate the artefact.** The article is what gets you found and what gives a buyer the C-suite nudge; the artefact is what gets you the email address.
21. **Productize ESQ and MapSense.** You have two real tools sitting behind a marketing page and a "download" button. Turn each into a self-serve interaction: an ESG diagnostic, or a sample screening against public data. A prospect who has used your tool has a materially different conversation with you than one who has read your brochure. Each tool's output should end in a booked call.

### Phase 5 — Compounding channels (ongoing)

22. **A regulatory deadline tracker.** A maintained, dated page tracking BRSR Core assurance phasing, CBAM milestones, CCPA greenwashing guidance, and India's carbon market — with an email alert for changes. This is genuinely differentiated (nobody in the Indian ESG advisory space owns this), it's evergreen SEO, and it creates a legitimate recurring reason to contact your entire list. This is the boldest idea here and the one with the longest payoff.
23. **Repurpose for LinkedIn.** Your 15 team members are the distribution. Per the Edelman–LinkedIn findings, thought leadership reaches the non-user stakeholders (finance, legal, procurement) who don't take sales meetings but do kill deals. Publish under named individuals, not the company page, and use LinkedIn Thought Leader Ads on the pieces that already generate leads per Phase 1's attribution data.
24. **Careers page as a client signal.** You are hiring into a scarce talent market. But the same page also tells a prospect how deep and senior the bench is. Right now `/careers-at-envint/` is purely candidate-facing; make it double as a bench-strength signal.

---

## 6. What I would NOT do

- **Don't start with the visual redesign.** A better-looking site with a broken lead pipeline is still a broken lead pipeline. Phase 0 first. This is the single most important recommendation here.
- **Don't gate the Enviki and How-to library.** Those articles are your discovery engine and your credibility engine. Gating them would trade a compounding SEO asset for a one-time email list.
- **Don't rebuild the CMS or the page-tree architecture.** The builder, RBAC, revisions, scheduled publishing and HMAC revalidation are genuinely good work. This is a design-and-conversion project, not a re-platforming project.
- **Don't chase Big 4 visual language.** Your credibility comes from specialisation and senior access, not corporate polish. A site that reads like a scaled-down Deloitte loses the comparison it invites.
- **Don't build a market-size-driven content strategy.** The analyst numbers disagree with each other by 3x. Target the regulatory deadlines instead — they're specific, dated and verifiable.
- **Don't add new features before Phase 1 measurement exists.** Otherwise you'll never know which of these 24 items paid for itself.

---

## 7. How to know it worked

| Metric | Where it comes from | Why this one |
|---|---|---|
| Leads delivered **and acknowledged** | Phase 0 inbox + email | The current pipeline can't even be measured. Baseline is effectively zero. |
| Lead-to-booked-call rate | Booking tool | Tests whether the offer, not just the traffic, is right |
| Articles producing leads (not just views) | Phase 1 per-article panel | Directly monetises the thought-leadership finding |
| Case-study → enquiry rate | Phase 1 goal events | Tests whether proof converts |
| Service pages: scroll depth + CTA click | Phase 1 goal events | Tests whether the disclosure in #13 removes the objection |
| Inbound share from taxonomy archives | Analytics referrers + landing paths | The 39 already-indexed URLs are the cheapest wins |
| Newsletter → qualified reply rate | Email | Tests whether the list is buying-committee members or just readers |

Benchmark context for realistic expectations: the widely cited median B2B website conversion rate is ~2.9% (Ruler Analytics, via multiple 2026 compilations), and a "strong" lead-gen form completion rate is around 10%+ for visitors who *reach* the form. Don't set targets off a generic benchmark — set them off your own Phase 1 baseline, which you currently don't have. That's a reason to do Phase 1 early, not late.

---

## 8. Open decisions I need from you

These change the plan materially, so I've flagged them rather than assuming.

1. **Where does design live — code or the CMS builder?** This determines whether modernization is a CSS/component project, a builder-feature project, or both. See D2. My recommendation: design system in code (non-negotiable primitives), layout and content in the builder.
2. **Which CRM / where should leads go?** Nothing downstream of the database exists today, so this is greenfield. Options: email only (fastest), email + Slack + spreadsheet, or a real CRM (HubSpot/Zoho/Salesforce) with owner routing.
3. **Do you have permission to name clients?** This decides whether the homepage proof section is a logo wall (strongest) or anonymous sector proof (weaker but still far better than counters). Getting this decision made early may require a permission email cycle, so start it now.
4. **Is there appetite for paid acquisition?** Everything above is organic/owned. If you also want to run LinkedIn or search ads against the CBAM/BRSR intent keywords, the landing-page requirements change (no nav, single CTA) and should be planned as a Phase 4b.
5. **Who owns the regulatory tracker (#22) editorially?** It only works if someone maintains it on a predictable cadence. If nobody owns it, skip it.

---

## Sources

**Envint-specific**
- Live site: `https://envintglobal.com/` (homepage DOM, sitemap = 153 URLs, per-page form/CTA audit, September 2026)
- This repo: `apps/web`, `apps/admin`, `packages/shared/src/page-trees`, `docs/migration/01-current-site-audit.md`, `docs/migration/09-fidelity-gap-report.md`

**Buyer behaviour**
- Gartner, B2B buying journey research — buyers spend only 17% of purchase time meeting with suppliers. `https://www.gartner.com/en/sales/insights/b2b-buying-journey`
- Gartner press release, 9 March 2026 — 67% of B2B buyers prefer a rep-free experience. `https://www.gartner.com/en/newsroom/press-releases/2026-03-09-gartner-sales-survey-finds-67-percent-of-b2b-buyers-prefer-a-rep-free-experience`
- Edelman–LinkedIn 2025 B2B Thought Leadership Impact Report — 56% / 55% use thought leadership in vendor evaluation; 64% / 63% consume 1+ hr/week; 41% / 35% received a C-suite nudge toward a specific vendor; 40%+ of deals stall on buying-group misalignment. Summarised by LinkedIn: `https://www.linkedin.com/business/marketing/blog/research-and-insights/b2b-thought-leadership-influence-hidden-buyers` · Report: `https://www.edelman.com/expertise/Business-Marketing/2025-b2b-thought-leadership-report`

**Trust and design**
- Nielsen Norman Group, "Trustworthiness in Web Design: 4 Credibility Factors" — design quality, up-front disclosure, comprehensive/current content, connection to the rest of the web. `https://www.nngroup.com/articles/trustworthy-design/`
- Nielsen Norman Group, B2B website usability research. `https://www.nngroup.com/reports/b2b-websites-usability/`

**Regulatory demand drivers**
- European Commission, CBAM definitive regime from 1 January 2026. `https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism_en`
- DEHSt (German Emissions Trading Authority) — first annual CBAM declaration and certificate surrender due 30 September 2027. `https://www.dehst.de/EN/Topics/CBAM/CBAM-definitive-regime-2026/cbam-definitive-regime-2026_artikel.html`
- SEBI, BRSR recommendations by the Expert Committee — BRSR Core reasonable-assurance glide path phasing to the top 1,000 listed entities. `https://www.sebi.gov.in/sebi_data/commondocs/may-2024/BRSR%20Recommendations%20by%20Expert%20Committee%20for%20Facilitating%20Ease%20of%20Doing%20..._p.pdf`
- KPMG India, "Emerging trends in BRSR reporting by listed companies" (February 2026). `https://assets.kpmg.com/content/dam/kpmgsites/in/pdf/2026/02/chapter-1-emerging-trends-in-brsr-reporting-by-listed-companies.pdf.coredownload.pdf`
- ICAP, EU CBAM enters its compliance phase (January 2026). `https://icapcarbonaction.com/en/news/eu-cbam-enters-compliance-phase-and-outlines-path-ahead`

**Market context and benchmarks**
- FactMR, ESG & Sustainability Advisory Market — shift "from voluntary sustainability statements toward auditable" disclosures. `https://www.factmr.com/report/esg-and-sustainability-advisory-market`
- Verdantix, sustainability consulting market forecast. `https://www.verdantix.com/client-portal/blog/market-size-and-forecast-data-reveal-a-growing-sustainability-consulting-market`
- Ruler Analytics B2B conversion benchmark (~2.9% median), as compiled in 2026. `https://gogreymatter.com/blog/b2b-website-conversion-benchmarks/`
- Digital Applied, 2026 form conversion benchmarks — lead-gen forms on mobile convert roughly a third below desktop. `https://www.digitalapplied.com/blog/form-conversion-rate-benchmarks-2026-data-points`
- Big 4 vs boutique positioning. `https://www.big4events.com/blog/big-4-vs-boutique-consulting`
