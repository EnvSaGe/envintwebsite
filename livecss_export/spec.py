import re, io
from bs4 import BeautifulSoup

def get_spec(fname, name):
    with io.open(f'envintmigration/site-capture/html/{fname}', encoding='utf-8', errors='ignore') as f:
        html = f.read()
    soup = BeautifulSoup(html, 'html.parser')
    main = soup.find('main') or soup.body
    styles = re.findall(r'<style[^>]*>(.*?)</style>', html, re.S | re.I)
    rules = {}  # eid -> list of prop dicts (one per media breakpoint, in order)
    for s in styles:
        # match: .elementor-PAGE .elementor-element.elementor-element-XXXXX .elementor-heading-title{...}
        for m in re.finditer(r'\.elementor-element\.elementor-element-([0-9a-f]{7})[^{}]*\.elementor-heading-title\{([^}]+)\}', s):
            eid, body = m.groups()
            props = {}
            for prop in ['font-size', 'font-family', 'font-weight', 'line-height', 'color']:
                mm = re.search(prop + r':([^;}]+)', body)
                if mm:
                    props[prop] = mm.group(1).strip()
            if eid not in rules:
                rules[eid] = []
            rules[eid].append(props)
    print(f'===== {name} =====')
    for el in main.find_all(['h1', 'h2', 'h3', 'h4', 'p']):
        cls = ' '.join(el.get('class', []))
        if 'elementor-heading-title' not in cls and 'elementor-image-box-title' not in cls and 'elementor-image-box-description' not in cls:
            continue
        text = el.get_text(' ', strip=True)
        if not text or len(text) < 2:
            continue
        anc = el.find_parent(class_=re.compile(r'elementor-element-[0-9a-f]{7}'))
        eid = None
        if anc:
            m = re.search(r'elementor-element-([0-9a-f]{7})', ' '.join(anc.get('class', [])))
            if m:
                eid = m.group(1)
        rs = rules.get(eid, [])
        if not rs:
            # try image-box title/description pattern
            for m2 in re.finditer(r'\.elementor-element\.elementor-element-' + re.escape(eid or '') + r'[^{]*\.elementor-image-box-title\{([^}]+)\}', ' '.join(styles), re.S):
                pass
            print(f'  <{el.name}> [{eid}] NO-RULE :: {text[:70]}')
            continue
        variants = []
        for r in rs:
            variants.append(f"fs={r.get('font-size', '-')},w={r.get('font-weight', '-')},lh={r.get('line-height', '-')},c={r.get('color', '-')}")
        print(f'  <{el.name}> [{eid}] {variants[0]}  (n={len(rs)}) :: {text[:70]}')
    print()

pages = {
    'HOME': 'home.html',
    'SERVICES': 'services-52233a36.html',
    'ABOUT': 'about-f34bb62f.html',
    'IMPACT': 'impact-82d0052e.html',
    'CAREERS': 'careers-at-envint-c5d2f9d8.html',
    'CONNECT': 'connect-725dcf45.html',
    'MAPSENSE': 'mapsense-f887b8bf.html',
    'ENVIKI': 'enviki-16fda567.html',
    'ENVISION': 'envision-60f44dac.html',
    'BUZZ': 'behind-the-buzz-3834a125.html',
    'GLOSSARY': 'glossary-zone-d314ca6b.html',
    'HOWTO': 'how-to-articles-b62bf662.html',
}
for name, fname in pages.items():
    get_spec(fname, name)