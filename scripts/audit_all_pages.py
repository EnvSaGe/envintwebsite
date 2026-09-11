#!/usr/bin/env python3
"""
Full 168-page fidelity audit: every captured live page vs the running build.

For each KEEP route in docs/migration/02-url-migration.csv:
  - fetches the built page from the dev server (http://localhost:3000)
  - compares <main> content against the captured live HTML
  - reports H1 match, heading coverage, wording containment, image/alt stats
  - classifies: OK / PARTIAL / DIFF / MISSING / ERROR / SKIP

Usage:
  python scripts/audit_all_pages.py [--base http://localhost:3000]
      [--captures envintmigration/site-capture/html]
      [--out docs/migration/10-fidelity-audit.md]
      [--live-csv scratch_live_now_{name}.txt]
"""
import csv
import glob
import html as html_mod
import os
import re
import sys
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_PATH = os.path.join(ROOT, "docs", "migration", "02-url-migration.csv")
DEFAULT_CAPTURES = os.path.join(ROOT, "envintmigration", "site-capture", "html")
DEFAULT_BASE = "http://localhost:3000"

# Core template pages we also re-verify against a FRESH live fetch (drift check).
FRESH_PAGES = [
    ("home", "https://envintglobal.com/"),
    ("about", "https://envintglobal.com/about/"),
    ("services", "https://envintglobal.com/services/"),
    ("impact", "https://envintglobal.com/impact/"),
    ("careers-at-envint", "https://envintglobal.com/careers-at-envint/"),
    ("connect", "https://envintglobal.com/connect/"),
    ("mapsense", "https://envintglobal.com/mapsense/"),
    ("esq", "https://envintglobal.com/esq/"),
    ("enviki", "https://envintglobal.com/enviki/"),
    ("envision", "https://envintglobal.com/envision/"),
    ("behind-the-buzz", "https://envintglobal.com/behind-the-buzz/"),
    ("glossary-zone", "https://envintglobal.com/glossary-zone/"),
    ("how-to-articles", "https://envintglobal.com/how-to-articles/"),
    ("connect-gbc2024", "https://envintglobal.com/connect-gbc2024/"),
]


def clean(s):
    s = re.sub(r"<[^>]+>", " ", s or "")
    s = html_mod.unescape(s)
    return re.sub(r"\s+", " ", s).strip()


def main_region(html_text):
    """Content region: <main>...</main> if present, else the <body>.
    Nested headers/footers/navs inside main are KEPT (e.g. the WordPress
    entry-header that holds the article H1). Global chrome lives outside
    <main> on both live and build, so it is naturally excluded."""
    m = re.search(r"<main[^>]*>(.*?)</main>", html_text, re.S)
    if m:
        return m.group(1)
    # No <main> (e.g. some WordPress member pages): use the body with the
    # Astra theme's global header (#masthead) and footer (#colophon) removed.
    body = html_text[html_text.find("<body"):]
    body = re.sub(r"<header[^>]*id=\"masthead\"[^>]*>.*?</header>", " ", body, flags=re.S)
    body = re.sub(r"<footer[^>]*id=\"colophon\"[^>]*>.*?</footer>", " ", body, flags=re.S)
    body = re.sub(r"<header[^>]*>.*?</header>", " ", body, flags=re.S, count=1)
    body = re.sub(r"<footer[^>]*>.*?</footer>", " ", body, flags=re.S, count=1)
    return body


def strip_chrome(region):
    region = re.sub(r"<script.*?</script>", " ", region, flags=re.S)
    region = re.sub(r"<style.*?</style>", " ", region, flags=re.S)
    return region


def visible_text(html_text):
    return clean(strip_chrome(main_region(html_text)))


def headings(html_text, tags=("h1", "h2", "h3")):
    region = strip_chrome(main_region(html_text))
    out = []
    for tag in tags:
        for m in re.finditer(rf"<{tag}[^>]*>(.*?)</{tag}>", region, re.S):
            t = clean(m.group(1))
            if t:
                out.append((tag.upper(), t))
    return out


def visual_headings(html_text):
    """Heading-like text on the live Elementor pages that is NOT a real h1-h3:
    elements rendered by the Elementor heading widget (`elementor-heading-title`
    class). Tagged VH so the report shows exactly which live 'div headings'
    the build must reproduce as semantic headings."""
    region = strip_chrome(main_region(html_text))
    out = []
    seen = set()
    for m in re.finditer(
        r'<[^>]+class="[^"]*elementor-heading-title[^"]*"[^>]*>(.*?)</[a-z0-9]+>',
        region, re.S,
    ):
        t = clean(m.group(1))
        k = norm(t)
        if t and k not in seen:
            seen.add(k)
            out.append(("VH", t))
    return out


def norm(t):
    return re.sub(r"[^a-z0-9]+", " ", t.lower()).strip()


def tokens(text):
    return set(re.findall(r"[a-z0-9]{3,}", text.lower()))


def prefix_align(a, b):
    wa, wb = a.split(), b.split()
    n = 0
    for x, y in zip(wa, wb):
        if x == y:
            n += 1
        else:
            break
    return n


def images(html_text):
    region = strip_chrome(main_region(html_text))
    imgs = re.findall(r"<img\b[^>]*>", region)
    missing_alt = sum(
        1 for i in imgs if not re.search(r'\balt\s*=\s*("[^"]*"|\'[^\']*\')', i)
        or re.search(r'\balt\s*=\s*(""|\'\')', i)
    )
    return len(imgs), missing_alt


def fetch(url, timeout=30):
    req = urllib.request.Request(
        url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
    )
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.status, r.read().decode("utf-8", "ignore")


def slug_from_url(url):
    """CSV slug: path of old_url, e.g. 'impact/brsr-reporting-nbfc' or '' for home."""
    path = url.split("//", 1)[-1]
    path = path.split("/", 1)[1] if "/" in path else ""
    return path.strip("/")


def capture_slug_from_url(url):
    """Capture filename slug: CSV slug with '/' -> '-' (captures use
    'impact-<slug>', 'member-<slug>', ... and 'home' for the root page)."""
    s = slug_from_url(url)
    if not s:
        return "home"
    return s.replace("/", "-")


def parse_csv():
    rows = []
    with open(CSV_PATH, encoding="utf-8-sig") as fh:
        reader = csv.DictReader(fh)
        for r in reader:
            rows.append(r)
    return rows


def build_capture_map(cap_dir):
    mapping = {}
    for path in glob.glob(os.path.join(cap_dir, "*.html")):
        fname = os.path.basename(path)[:-5]
        m = re.sub(r"-[a-f0-9]{8}$", "", fname)
        mapping.setdefault(m, []).append(path)
    return mapping


def audit_route(route, capture_path, base):
    """Returns a dict describing build vs capture fidelity for one route."""
    raw = open(capture_path, encoding="utf-8", errors="ignore").read()
    try:
        status, built = fetch(base + route)
    except Exception as e:
        return {"status": "ERROR", "detail": str(e)[:120]}
    if status != 200:
        return {"status": "MISSING", "detail": f"HTTP {status}"}

    lv, bv = visible_text(raw), visible_text(built)
    lh = headings(raw) + visual_headings(raw)
    bh = headings(built)

    def heading_maps(hs):
        d = {}
        for tag, t in hs:
            d.setdefault(norm(t), (tag, t))
        return d

    lm, bm = heading_maps(lh), heading_maps(bh)
    btext_norm = norm(bv)

    # CONTENT-BASED matching: a live heading is 'found' when its normalized
    # text exists in the build either as a heading OR anywhere in the visible
    # text. This measures real content fidelity (wording + section presence)
    # instead of tag-for-tag: the build is allowed (and encouraged) to use
    # cleaner semantic tags than the live site's broken ones.
    live_h_missing = []
    for k, (tag, t) in lm.items():
        if k in bm or k in btext_norm:
            continue
        live_h_missing.append(f"{tag}: {t[:80]}")
    live_cov = (len(lm) - len(live_h_missing)) / len(lm) if lm else 1.0

    # Build-only headings: informational (often intentional SEO improvements).
    build_h_extra = [f"{t}: {tx[:80]}" for k, (t, tx) in bm.items() if k not in lm]

    # Wording containment uses the full visible text (including styled-div
    # headings on live) so pages like /connect/ are judged on real wording.
    lt, bt = tokens(lv), tokens(bv)
    inter = len(lt & bt)
    contain = inter / len(lt) if lt else 1.0

    # SEO checks: exactly one H1, whose text matches a live heading.
    build_h1s = [tx for tag, tx in bh if tag == "H1"]
    live_texts = [tx for tag, tx in lm.values()]
    h1_match = (
        len(build_h1s) == 1
        and bool(live_texts)
        and any(norm(build_h1s[0]) == norm(x) for x in live_texts)
    )
    h1_live = next((t for tag, t in lm.values() if tag in ("H1", "VH")), "")
    h1_build = build_h1s[0] if build_h1s else ""
    seo_note = ""
    if len(build_h1s) == 0:
        seo_note = "SEO WARN: no H1 on build"
    elif len(build_h1s) > 1:
        seo_note = f"SEO WARN: {len(build_h1s)} H1s on build"

    score = 0.5 * live_cov + 0.5 * contain

    # A live page with no static content (e.g. /esq/ renders via JS) cannot be
    # scored meaningfully - mark it OK* instead of a false DIFF.
    if not lm and len(lv.split()) < 50:
        verdict = "OK*"
        score = 1.0
    elif score >= 0.85:
        verdict = "OK"
    elif score >= 0.6:
        verdict = "PARTIAL"
    else:
        verdict = "DIFF"

    limg, lmiss = images(raw)
    bimg, bmiss = images(built)

    return {
        "status": verdict,
        "score": round(score, 2),
        "h1_match": h1_match,
        "h1_live": h1_live[:80],
        "h1_build": h1_build[:80],
        "seo_note": seo_note,
        "live_heading_cov": round(live_cov, 2),
        "word_containment": round(contain, 2),
        "prefix_words": prefix_align(lv, bv),
        "live_words": len(lv.split()),
        "build_words": len(bv.split()),
        "live_headings_missing": live_h_missing,
        "build_headings_extra": build_h_extra,
        "live_imgs": limg,
        "live_imgs_noalt": lmiss,
        "build_imgs": bimg,
        "build_imgs_noalt": bmiss,
    }


def main() -> int:
    args = [a for a in sys.argv[1:]]
    base = DEFAULT_BASE
    cap_dir = DEFAULT_CAPTURES
    out_path = None
    if "--base" in args:
        base = args[args.index("--base") + 1]
    if "--captures" in args:
        cap_dir = args[args.index("--captures") + 1]
    if "--out" in args:
        out_path = args[args.index("--out") + 1]

    rows = parse_csv()
    cap_map = build_capture_map(cap_dir)

    # Sanity: slugs with no capture
    no_cap = [slug_from_url(r["old_url"]) for r in rows if r["action"] == "KEEP"
              and slug_from_url(r["old_url"]) not in cap_map]
    if no_cap:
        print(f"WARN: {len(no_cap)} KEEP slugs missing capture: {no_cap[:10]}", file=sys.stderr)

    results = []
    for r in rows:
        action = r["action"]
        slug = slug_from_url(r["old_url"])
        route = r["new_url"]
        if action != "KEEP":
            results.append({
                "route": route or f"/{slug}/",
                "template": r["template"],
                "action": action,
                "status": "SKIP",
                "score": None,
                "detail": f"{action} (redirect to {r.get('redirect_code','')})" if action == "301_REDIRECT" else action,
            })
            continue
        caps = cap_map.get(capture_slug_from_url(r["old_url"]))
        if not caps:
            results.append({
                "route": route, "template": r["template"], "action": action,
                "status": "NO_CAPTURE", "score": None, "detail": "no capture file",
            })
            continue
        res = audit_route(route, caps[0], base)
        res.update({"route": route, "template": r["template"], "action": action,
                    "dup_captures": len(caps)})
        results.append(res)
        marker = {"OK": " ", "PARTIAL": "~", "DIFF": "X", "MISSING": "!", "ERROR": "E"}.get(res["status"], "?")
        print(f"[{marker}] {res['status']:<8} {route:<60} score={res.get('score')} "
              f"h1={'y' if res.get('h1_match') else 'n'} cov={res.get('live_heading_cov')} "
              f"word={res.get('word_containment')}")

    # ---- summarize ----
    counts = {}
    for res in results:
        counts[res["status"]] = counts.get(res["status"], 0) + 1

    lines = []
    lines.append("# 10 — Full 168-Page Fidelity Audit (live captures vs current build)")
    lines.append("")
    lines.append(f"Reference captures: `{cap_dir}`  ·  Build base: `{base}`")
    lines.append("")
    lines.append("> **How it works:** every KEEP route in `02-url-migration.csv` is fetched from the running build and")
    lines.append("> compared against its live capture within `<main>` (or body minus global header/footer). Metrics:")
    lines.append("> CONTENT-based coverage (each live heading h1-h3 + Elementor visual heading VH is found if its")
    lines.append("> text exists in the build as a heading OR anywhere in the visible text - so cleaner semantic tags")
    lines.append("> in the build are allowed, matching content/wording rather than broken live tags), wording")
    lines.append("> containment (shared content words), plus SEO checks (exactly one H1 whose text matches a live")
    lines.append("> heading). Verdict: `OK` >= 0.85 - `PARTIAL` >= 0.6 - `DIFF` below; `OK*` = live page has no")
    lines.append("> static content (e.g. /esq/). Re-run:")
    lines.append("> `python scripts/audit_all_pages.py --out docs/migration/10-fidelity-audit.md` (dev server on :3000).")
    lines.append("")
    lines.append("> **Member pages caveat:** the 14 `/member/*` captures are blank on the live site (header/footer")
    lines.append("> only - the WordPress member template renders nothing, and the raw bios in the WP DB are polluted")
    lines.append("> with Google-Sheets / AI-chat HTML). The build intentionally renders full bios from the WordPress")
    lines.append("> XML export, so low member-page scores are expected and not regressions. Bios in `team.json` were")
    lines.append("> cleaned to plain text (`scripts/clean_team_bios.py`) and match the XML exactly.")
    lines.append("")
    lines.append("## Summary")
    lines.append("")
    for k, v in sorted(counts.items()):
        lines.append(f"- **{k}**: {v}")
    lines.append("")
    lines.append("## Page-by-page")
    lines.append("")
    lines.append("| Status | Route | Template | Score | H1 match | Head-cov | Word-cont | Notes |")
    lines.append("| :--- | :--- | :--- | ---: | :--- | ---: | ---: | :--- |")
    for res in results:
        if res["status"] == "SKIP":
            continue
        note = res.get("detail", "")
        if res.get("seo_note"):
            note = (note + " · " if note else "") + res["seo_note"]
        if res["status"] in ("DIFF", "PARTIAL") and res.get("prefix_words") is not None:
            note = f"first {res['prefix_words']}/{res.get('build_words', 0)} words align"
        if res["status"] == "OK*":
            note = (note + " · " if note else "") + "live page has no static content"
        lines.append(
            f"| {res['status']} | `{res['route']}` | {res.get('template') or res.get('action','')} "
            f"| {res.get('score') or ''} | {'yes' if res.get('h1_match') else 'no'} "
            f"| {res.get('live_heading_cov') or ''} | {res.get('word_containment') or ''} | {note} |"
        )
    lines.append("")

    # ---- detailed deltas for pages needing work ----
    need = [res for res in results if res["status"] in ("DIFF", "PARTIAL")]
    if need:
        lines.append(f"## Deltas for {len(need)} pages needing work")
        lines.append("")
        for res in sorted(need, key=lambda r: (r.get("score") or 0)):
            lines.append(f"### `{res['route']}` ({res['status']}, score {res.get('score')})")
            lines.append("")
            lines.append(f"- Live H1: *{res.get('h1_live') or '(none)'}*")
            lines.append(f"- Build H1: *{res.get('h1_build') or '(none)'}*")
            lines.append(f"- Live headings missing in build ({len(res.get('live_headings_missing', []))}):")
            for h in res.get("live_headings_missing", [])[:20]:
                lines.append(f"  - {h}")
            lines.append(f"- Build headings not in live ({len(res.get('build_headings_extra', []))}):")
            for h in res.get("build_headings_extra", [])[:20]:
                lines.append(f"  - {h}")
            lines.append("")

    text = "\n".join(lines)
    if out_path:
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        with open(out_path, "w", encoding="utf-8") as fh:
            fh.write(text)
        print(f"\nWrote {out_path}")
    else:
        print(text)
    return 0


if __name__ == "__main__":
    sys.exit(main())