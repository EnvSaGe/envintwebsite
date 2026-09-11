#!/usr/bin/env python3
"""
Ordered structural audit of a captured Envint page (or any HTML).

Walks the <body> in document order and prints a readable outline:
headings, paragraphs, image sources/alts, link labels, buttons and the
nearest Elementor data-id ancestor for each item (for CSS lookup).

Usage: python scripts/audit_page.py envintmigration/site-capture/html/about-f34bb62f.html
"""
import html as html_mod
import re
import sys
from html.parser import HTMLParser

VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'}


class OutlineParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []
        self.buffer = []
        self.records = []  # (type, text, data_id, cls)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        cls = a.get('class', '')
        did = a.get('data-id', '')
        if tag in ('h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'img', 'a', 'button', 'li', 'div', 'section', 'iframe'):
            self.stack.append((tag, did))
        else:
            self.stack.append((tag, ''))

    def handle_endtag(self, tag):
        if tag in ('h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'img', 'a', 'button', 'li', 'div', 'section', 'iframe'):
            # collect buffer text for this element
            text = ''.join(self.buffer).strip()
            text = re.sub(r'\s+', ' ', text)
            # find matching tag frame: pop until tag
            for i in range(len(self.stack) - 1, -1, -1):
                if self.stack[i][0] == tag:
                    depth = self.stack[:i + 1]
                    did = next((d for (_, d) in reversed(depth) if d), '')
                    self.records.append((tag, text, did))
                    del self.stack[i:]
                    break
            self.buffer.clear()

    def handle_data(self, data):
        self.buffer.append(data)

    def handle_startendtag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'img':
            did = next((d for (_, d) in reversed(self.stack) if d), '')
            self.records.append(('img', f"src={a.get('src', '')[:110]} | alt={a.get('alt', '')[:60]} | w={a.get('width','')} h={a.get('height','')}", did))
        elif tag == 'br':
            self.buffer.append(' ')


def main() -> int:
    path = sys.argv[1]
    raw = open(path, encoding='utf-8', errors='ignore').read()
    body = raw[raw.find('<body'):]
    body = re.sub(r'<script.*?</script>', ' ', body, flags=re.S)
    body = re.sub(r'<style.*?</style>', ' ', body, flags=re.S)
    p = OutlineParser()
    p.feed(body)
    last_section = None
    shown = 0
    for tag, text, did in p.records:
        if tag in ('h1', 'h2', 'h3', 'h4', 'p', 'li', 'button', 'img'):
            if not text:
                continue
            if len(text) > 500:
                text = text[:500] + '…'
            if did and did != last_section:
                print(f"\n[{did}]")
                last_section = did
            prefix = {'h1': 'H1', 'h2': 'H2', 'h3': 'H3', 'h4': 'H4', 'p': 'P', 'li': '•', 'button': 'BTN', 'img': 'IMG'}[tag]
            print(f"  {prefix:<4} {text}")
            shown += 1
    print(f"\n--- {shown} visible records ---")
    return 0


if __name__ == '__main__':
    sys.exit(main())
