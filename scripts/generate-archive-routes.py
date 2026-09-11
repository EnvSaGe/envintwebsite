#!/usr/bin/env python3
"""
Generate apps/web/src/data/archive-routes.json from the canonical URL matrix.

Output: [{ "type": "category", "slug": "enviki/glossary-zone" }, ...] for every
retained TaxonomyArchiveTemplate route (categories, tags, services,
sub-services, sectors, themes) so archive pages can prerender and the sitemap
can enumerate the exact canonical set.

Usage: python scripts/generate-archive-routes.py
"""
import csv
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_PATH = os.path.join(ROOT, "docs", "migration", "02-url-migration.csv")
OUT_PATH = os.path.join(ROOT, "apps", "web", "src", "data", "archive-routes.json")

TAXONOMY_PREFIXES = ("category/", "tag/", "service/", "sub-service/", "sector/", "theme/")


def main() -> int:
    rows = list(csv.DictReader(open(CSV_PATH, encoding="utf-8-sig")))
    routes = []
    seen = set()
    for r in rows:
        if r.get("template") != "TaxonomyArchiveTemplate":
            continue
        url = (r.get("new_url") or "").strip("/")
        if not url.startswith(TAXONOMY_PREFIXES):
            continue
        kind, slug = url.split("/", 1)
        key = (kind, slug)
        if key in seen:
            continue
        seen.add(key)
        routes.append({"type": kind, "slug": slug})

    routes.sort(key=lambda x: (x["type"], x["slug"]))
    with open(OUT_PATH, "w", encoding="utf-8") as fh:
        json.dump(routes, fh, ensure_ascii=False, indent=1)
    print(f"Wrote {len(routes)} taxonomy archive routes to {OUT_PATH}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
