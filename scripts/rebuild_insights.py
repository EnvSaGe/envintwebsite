#!/usr/bin/env python3
"""
Rebuild apps/web/src/data/insights.json from the canonical WordPress export
(envintmigration/envint.WordPress.2026-08-31.xml).

The previous insights.json had double-escaped HTML (literal backslash-quote
sequences inside contentHtml), which also broke automated media localization.
This rebuilds the file with clean, single-encoded values straight from the XML
content:encoded payloads (the exact authored WP content), plus Yoast SEO
title/description, taxonomy terms, dates and featured-image URL.

Matching canonical insight slugs come from docs/migration/02-url-migration.csv.

Usage: python scripts/rebuild_insights.py
"""
import csv
import html as html_mod
import json
import os
import re
import sys
from xml.etree import ElementTree

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
XML_PATH = os.path.join(ROOT, "envintmigration", "envint.WordPress.2026-08-31.xml")
CSV_PATH = os.path.join(ROOT, "docs", "migration", "02-url-migration.csv")
OUT_PATH = os.path.join(ROOT, "apps", "web", "src", "data", "insights.json")

NS = {
    "content": "http://purl.org/rss/1.0/modules/content/",
    "dc": "http://purl.org/dc/elements/1.1/",
    "wp": "http://wordpress.org/export/1.2/",
    "excerpt": "http://wordpress.org/export/1.2/excerpt/",
}


def clean_text(value: str | None) -> str:
    if not value:
        return ""
    return value.strip()


def clean_yoast(value: str | None) -> str:
    value = clean_text(value)
    value = value.replace("%%sitename%%", "Envint")
    return value


def strip_html(value: str) -> str:
    value = re.sub(r"<!--.*?-->", "", value, flags=re.S)
    value = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", value, flags=re.S | re.I)
    value = re.sub(r"<[^>]+>", " ", value)
    value = html_mod.unescape(value)
    value = re.sub(r"\s+", " ", value)
    return value.strip()


def main() -> int:
    if not os.path.exists(XML_PATH):
        print(f"ERROR: XML export not found at {XML_PATH}", file=sys.stderr)
        return 1

    # WP exports occasionally contain raw control characters that make the XML
    # technically invalid; strip them before parsing (whitespace chars are kept).
    raw_xml = open(XML_PATH, encoding="utf-8").read()
    raw_xml = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f]", " ", raw_xml)
    root = ElementTree.fromstring(raw_xml)
    channel = root.find("channel")

    items = []
    for item in channel.findall("item"):
        post_type = item.findtext("wp:post_type", namespaces=NS) or ""
        status = item.findtext("wp:status", namespaces=NS) or ""
        if post_type not in ("post",) or status != "publish":
            continue
        items.append(item)

    # Featured image map: attachment id -> guid URL
    attachments = {}
    for item in channel.findall("item"):
        post_type = item.findtext("wp:post_type", namespaces=NS) or ""
        if post_type != "attachment":
            continue
        pid = item.findtext("wp:post_id", namespaces=NS) or ""
        guid = item.findtext("guid") or ""
        attachments[pid] = guid

    # Canonical slug set from the URL matrix
    canonical_slugs = set()
    with open(CSV_PATH, encoding="utf-8-sig") as fh:
        for row in csv.DictReader(fh):
            if row.get("template") == "ArticleDetailTemplate" and row.get("new_url", "").strip("/"):
                canonical_slugs.add(row["new_url"].strip("/").split("/")[-1])

    insights = []
    for item in items:
        slug = clean_text(item.findtext("wp:post_name", namespaces=NS))
        title = clean_text(item.findtext("title")) or slug
        if slug not in canonical_slugs:
            print(f"  skip (not in canonical matrix): {slug}")
            continue

        post_id = clean_text(item.findtext("wp:post_id", namespaces=NS))
        pub_gmt = clean_text(item.findtext("wp:post_date_gmt", namespaces=NS)) or clean_text(item.findtext("pubDate"))
        content = item.findtext("content:encoded", namespaces=NS) or ""
        # Defensive sanitation: drop script/style payloads from authored content
        content = re.sub(r"<(script|style)\b[^>]*>.*?</\1>", "", content, flags=re.S | re.I)
        content = re.sub(r"<iframe\b[^>]*>.*?</iframe>", "", content, flags=re.S | re.I)
        excerpt = clean_text(item.findtext("excerpt:encoded", namespaces=NS)) or strip_html(content)[:320]

        meta = {}
        for pm in item.findall("wp:postmeta", namespaces=NS):
            key = pm.findtext("wp:meta_key", namespaces=NS) or ""
            value = pm.findtext("wp:meta_value", namespaces=NS) or ""
            meta[key] = value

        categories, tags = [], []
        for cat in item.findall("category"):
            domain = cat.get("domain")
            text = clean_text(cat.text)
            if not text:
                continue
            if domain == "category":
                categories.append(text)
            elif domain == "post_tag":
                tags.append(text)

        # Featured image: _thumbnail_id -> attachment guid
        cover_url = ""
        thumb = meta.get("_thumbnail_id")
        if thumb and thumb in attachments:
            cover_url = attachments[thumb]

        insights.append({
            "id": int(post_id) if post_id.isdigit() else None,
            "title": title,
            "slug": slug,
            "publishedAt": pub_gmt,
            "excerpt": strip_html(excerpt) if excerpt else "",
            "contentHtml": content,
            "seoTitle": clean_yoast(meta.get("_yoast_wpseo_title")) or f"{title} - Envint Insights",
            "seoDescription": clean_yoast(meta.get("_yoast_wpseo_metadesc")) or (strip_html(excerpt)[:160] if excerpt else ""),
            "categories": categories,
            "tags": tags,
            "coverImage": {"url": cover_url},
        })

    insights.sort(key=lambda i: i["publishedAt"], reverse=True)
    with open(OUT_PATH, "w", encoding="utf-8") as fh:
        json.dump(insights, fh, ensure_ascii=False, indent=1)

    print(f"Rebuilt {OUT_PATH} with {len(insights)} insights "
          f"({len(canonical_slugs)} expected in matrix)")
    missing = sorted(canonical_slugs - {i["slug"] for i in insights})
    if missing:
        print("Slugs in matrix missing from XML export:")
        for s in missing:
            print(f"  - {s}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
