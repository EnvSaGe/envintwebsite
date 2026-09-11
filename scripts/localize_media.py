#!/usr/bin/env python3
"""
Localize remote WordPress media referenced by Envint content data.

Scans apps/web/src/data/*.json (parsed), finds every https://envintglobal.com/
wp-content/uploads/... reference inside string values (contentHtml, srcset,
coverImage.url, heroImage, etc.), extracts the matching originals from
envintmigration/envint-wp-content.zip into apps/web/public/media/uploads/, and
rewrites every occurrence to the local path.

Result: fully self-contained site with zero wp-content references.

Usage:  python scripts/localize_media.py
"""
import json
import os
import re
import sys
import unicodedata
import zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ZIP_PATH = os.path.join(ROOT, "envintmigration", "envint-wp-content.zip")
DATA_DIR = os.path.join(ROOT, "apps", "web", "src", "data")
OUT_DIR = os.path.join(ROOT, "apps", "web", "public", "media", "uploads")

UPLOADS_PREFIX = "wp-content/uploads/"
# Note: filenames may legitimately contain U+202F (narrow no-break space),
# so only ASCII space / quotes / angle brackets terminate a URL here.
UPLOADS_URL_RE = re.compile(r"https://envintglobal\.com/wp-content/uploads/[^\"' <>]+")


def normalize(name: str) -> str:
    name = unicodedata.normalize("NFC", name)
    name = name.replace("\u202f", " ").replace("\u00a0", " ")
    return name.lower().strip()


def safe_basename(name: str) -> str:
    name = unicodedata.normalize("NFC", name)
    name = name.replace("\u202f", " ").replace("\u00a0", " ")
    base = os.path.basename(name)
    base = re.sub(r"[^A-Za-z0-9._-]", "_", base)
    return base


def find_zip_entry(zf, tail: str, name_index) -> str | None:
    normalized = normalize(tail)
    if normalized in name_index:
        return name_index[normalized]
    base = normalize(os.path.basename(tail))
    for candidate, entry in name_index.items():
        if candidate.endswith("/" + base):
            return entry
    # Master-file fallback: strip the -WxH size suffix
    master = re.sub(r"-\d+x\d+(?=\.\w+$)", "", base)
    for candidate, entry in name_index.items():
        if candidate.endswith("/" + master):
            return entry
    return None


def walk_strings(node, sink):
    if isinstance(node, dict):
        for v in node.values():
            walk_strings(v, sink)
    elif isinstance(node, list):
        for v in node:
            walk_strings(v, sink)
    elif isinstance(node, str):
        sink(node)


def rewrite_urls(node, mapping):
    if isinstance(node, dict):
        return {k: rewrite_urls(v, mapping) for k, v in node.items()}
    if isinstance(node, list):
        return [rewrite_urls(v, mapping) for v in node]
    if isinstance(node, str):
        out = node
        for url, local in sorted(mapping.items(), key=lambda kv: -len(kv[0])):
            if url in out:
                out = out.replace(url, local)
        return out
    return node


def main() -> int:
    if not os.path.exists(ZIP_PATH):
        print(f"ERROR: WordPress zip not found at {ZIP_PATH}", file=sys.stderr)
        return 1
    if not os.path.isdir(DATA_DIR):
        print(f"ERROR: Data dir not found at {DATA_DIR}", file=sys.stderr)
        return 1

    os.makedirs(OUT_DIR, exist_ok=True)

    data_files = sorted(p for p in os.listdir(DATA_DIR) if p.endswith(".json"))

    with zipfile.ZipFile(ZIP_PATH) as zf:
        name_index = {normalize(info.filename): info.filename for info in zf.infolist()}
        seen_urls: dict[str, str] = {}
        missing = set()

        # First pass: collect every remote URL referenced by any data file
        all_urls: set[str] = set()
        for data_file in data_files:
            with open(os.path.join(DATA_DIR, data_file), encoding="utf-8") as fh:
                data = json.load(fh)
            urls = set()
            walk_strings(data, lambda s: urls.update(UPLOADS_URL_RE.findall(s)))
            all_urls.update(u.rstrip(";,") for u in urls)

        # Extract assets & build the URL -> local mapping
        for url in sorted(all_urls):
            if UPLOADS_PREFIX not in url:
                continue
            tail = url.split(UPLOADS_PREFIX, 1)[1]
            entry = find_zip_entry(zf, tail, name_index)
            if entry is None:
                missing.add(url)
                continue
            dest_name = safe_basename(tail)
            if not dest_name:
                missing.add(url)
                continue
            dest_path = os.path.join(OUT_DIR, dest_name)
            if not os.path.exists(dest_path):
                with zf.open(entry) as src, open(dest_path, "wb") as out:
                    out.write(src.read())
            seen_urls[url] = f"/media/uploads/{dest_name}"
            print(f"  {tail[:76]:<78} -> /media/uploads/{dest_name}")

        # Second pass: rewrite every data file
        for data_file in data_files:
            path = os.path.join(DATA_DIR, data_file)
            with open(path, encoding="utf-8") as fh:
                data = json.load(fh)
            data = rewrite_urls(data, seen_urls)
            with open(path, "w", encoding="utf-8") as fh:
                json.dump(data, fh, ensure_ascii=False, indent=1)
            print(f"  rewrote {data_file}")

    if missing:
        print("\nWARNING: could not localize (no matching zip entry):")
        for url in sorted(missing):
            print(f"  - {url}")

    leftovers = 0
    for data_file in data_files:
        text = open(os.path.join(DATA_DIR, data_file), encoding="utf-8").read()
        if "wp-content" in text:
            leftovers += text.count("wp-content")
            print(f"  leftover wp-content in {data_file}: {text.count('wp-content')}")
    print(f"\nDone. Extracted {len(seen_urls)} assets to {OUT_DIR}. Leftover refs: {leftovers}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
