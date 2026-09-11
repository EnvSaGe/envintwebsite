#!/usr/bin/env python3
"""
Clean the team bios in apps/web/src/data/team.json.

Several bios were pasted into WordPress from Google Sheets / chat tools and
carry raw HTML wrappers (`<span data-sheets-value="{...}">`, AI-chat <article>
soup, WhatsApp-style <p> classes). The member page renders `bio` as text, so
that markup shows as garbage. This script converts every bio to clean plain
text with double-newline paragraph separators and decodes HTML entities.

Usage: python scripts/clean_team_bios.py [--check]   (--check = dry run, no write)
"""
import html as html_mod
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEAM_JSON = os.path.join(ROOT, "apps", "web", "src", "data", "team.json")

# Block-level closers create paragraph breaks; <br> becomes a newline.
BLOCK_END = re.compile(r"</(p|div|h[1-6]|li|ol|ul|section|article|blockquote|tr)>", re.I)
BR = re.compile(r"<br\s*/?>", re.I)
TAG = re.compile(r"<[^>]+>")
SPACES = re.compile(r"[ \t\f\v]+")


def bio_to_text(raw: str) -> str:
    if not raw:
        return ""
    marked = BLOCK_END.sub("\n\n", raw)
    marked = BR.sub("\n", marked)
    text = TAG.sub("", marked)
    text = html_mod.unescape(text)
    paras = []
    for p in re.split(r"\n{2,}", text):
        p = SPACES.sub(" ", p).strip()
        if p:
            paras.append(p)
    return "\n\n".join(paras)


def main() -> int:
    check_only = "--check" in sys.argv
    with open(TEAM_JSON, encoding="utf-8") as fh:
        team = json.load(fh)

    dirty = 0
    for m in team:
        raw = m.get("bio") or ""
        clean = bio_to_text(raw)
        if clean != raw:
            dirty += 1
        m["bio"] = clean

    print(f"members: {len(team)} | cleaned: {dirty} | "
          f"any html left: {sum(1 for m in team if '<' in (m.get('bio') or ''))}")

    # sanity: show a preview of every bio's first paragraph
    for m in team:
        bio = (m.get("bio") or "").split("\n\n")[0]
        print(f"  {m['slug']:<28} | {bio[:70]}")

    if check_only:
        print("\n--check: no changes written")
        return 0

    with open(TEAM_JSON, "w", encoding="utf-8", newline="\n") as fh:
        json.dump(team, fh, ensure_ascii=False, indent=1)
        fh.write("\n")
    print(f"\nWrote {TEAM_JSON}")
    return 0


if __name__ == "__main__":
    sys.exit(main())