#!/usr/bin/env python3
"""
Fidelity gap report: compares each captured live page against the running
build on localhost:3000 and lists heading/text/section deltas to fix.

Usage:
  python scripts/fidelity_report.py              # full report to stdout
  python scripts/fidelity_report.py --out docs/migration/09-fidelity-gap-report.md
"""
import html as html_mod
import json
import re
import sys
import urllib.request

BASE = "https://envintglobal.com" if False else "http://localhost:3000"

# (capture file, live path under /, route name)
PAGES = [
    ("home.html", "", "Home"),
    ("about-f34bb62f.html", "about/", "About"),
    ("services-52233a36.html", "services/", "Services Landing"),
    ("impact-82d0052e.html", "impact/", "Impact Listing"),
    ("connect-725dcf45.html", "connect/", "Connect"),
    ("careers-at-envint-c5d2f9d8.html", "careers-at-envint/", "Careers"),
    ("mapsense-f887b8bf.html", "mapsense/", "Mapsense"),
    ("esq-cbdbccbb.html", "esq/", "ESQ"),
    ("envision-60f44dac.html", "envision/", "Envision Hub"),
    ("enviki-16fda567.html", "enviki/", "Enviki Hub"),
    ("behind-the-buzz-3834a125.html", "behind-the-buzz/", "Behind the Buzz"),
    ("glossary-zone-d314ca6b.html", "glossary-zone/", "Glossary Zone"),
    ("how-to-articles-b62bf662.html", "how-to-articles/", "How-to Hub"),
]


def clean(s):
    s = re.sub(r"<[^>]+>", " ", s or "")
    s = html_mod.unescape(s)
    return re.sub(r"\s+", " ", s).strip()


def headings(html_text, tags=("h1", "h2")):
    out = []
    for tag in tags:
        for m in re.finditer(rf"<{tag}[^>]*>(.*?)</{tag}>", html_text, re.S):
            t = clean(m.group(1))
            if t:
                out.append(f"{tag.upper()}: {t[:90]}")
    return out


def visible_text(html_text):
    body = html_text[html_text.find("<body"):] if "<body" in html_text else html_text
    body = re.sub(r"<script.*?</script>", " ", body, flags=re.S)
    body = re.sub(r"<style.*?</style>", " ", body, flags=re.S)
    return clean(body)


def fetch(url):
    with urllib.request.urlopen(url, timeout=25) as r:
        return r.read().decode("utf-8", "ignore")


def main() -> int:
    import glob
    cap_dir = "envintmigration/site-capture/html/"
    report = []
    for pattern, path, name in PAGES:
        matches = glob.glob(cap_dir + pattern)
        if not matches:
            report.append(f"\n## {name} — capture file `{pattern}` not found\n")
            continue
        cap = open(matches[0], encoding="utf-8", errors="ignore").read()
        try:
            built = fetch(f"{BASE}/{path}")
        except Exception as e:
            report.append(f"\n## {name} — cannot fetch build ({e})\n")
            continue

        live_h = headings(cap)
        built_h = headings(built)
        # Compare section headings by (tag, text-normalized)
        def norm(t):
            return re.sub(r"[^a-z0-9]+", " ", t.lower()).strip()

        lmap = {norm(h): h for h in live_h}
        bmap = {norm(h): h for h in built_h}
        missing = [h for k, h in lmap.items() if k not in bmap]
        extra = [h for k, h in bmap.items() if k not in lmap]

        # crude body text diff (first mismatch window)
        lv, bv = visible_text(cap), visible_text(built)
        lwords, bwords = lv.split(), bv.split()
        shared = 0
        for a, b in zip(lwords, bwords):
            if a == b:
                shared += 1
            else:
                break
        report.append(f"\n## {name} (`/{path}`)\n")
        report.append(f"- word-alignment at start: {shared} shared words of {len(bwords)}")
        report.append(f"- live headings not found in build: {len(missing)}")
        for h in missing[:14]:
            report.append(f"  - {h}")
        report.append(f"- build headings not in live: {len(extra)}")
        for h in extra[:14]:
            report.append(f"  - {h}")

    text = "\n".join(report)
    out = "--out" in sys.argv
    if out:
        idx = sys.argv.index("--out")
        target = sys.argv[idx + 1]
        with open(target, "w", encoding="utf-8") as fh:
            fh.write("# 09 — Fidelity Gap Report (live capture vs current build)\n")
            fh.write(text)
        print(f"Wrote {target}")
    else:
        print(text)
    return 0


if __name__ == "__main__":
    sys.exit(main())
