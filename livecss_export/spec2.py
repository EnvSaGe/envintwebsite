import re, io
from bs4 import BeautifulSoup

def get_spec(fname, name):
    with io.open(f'envintmigration/site-capture/html/{fname}', encoding='utf-8', errors='ignore') as f:
        html = f.read()
    soup = BeautifulSoup(html, 'html.parser')
    main = soup.find('main') or soup.body
    styles = re.findall(r'<style[^>]*>(.*?)</style>', html, re.S | re.I)
    rules = {}
    for s in styles:
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
        for m in re.finditer(r'\.elementor-element\.elementor-element-([0-9a-f]{7})[^{}]*\.elementor-image-box-title\{([^}]+)\}', s):
            eid, body = m.groups()
            props = {}
            for prop in ['font-size', 'font-family', 'font-weight', 'line-height', 'color']:
                mm = re.search(prop + r':([^;}]+)', body)
                if mm:
                    props[prop] = mm.group(1).strip()
            rules.setdefault(eid, []).append(props)
        for m in re.finditer(r'\.elementor-element\.elementor-element-([0-9a-f]{7})[^{}]*\.elementor-image-box-description\{([^}]+)\}', s):
            eid, body = m.groups()
            props = {}
            for prop in ['font-size', 'font-family', 'font-weight', 'line-height', 'color']:
                mm = re.search(prop + r':([^;}]+)', body)
                if mm:
                    props[prop] = mm.group(1).strip()
            rules.setdefault(eid, []).append(props)
        for m in re.finditer(r'\.elementor-element\.elementor-element-([0-9a-f]{7})[^{}]*\.eael-entry-title\{([^}]+)\}', s):
            eid, body = m.groups()
            props = {}
            for prop in ['font-size', 'font-family', 'font-weight', 'line-height', 'color']:
                mm = re.search(prop + r':([^;}]+)', body)
                if mm:
                    props[prop] = mm.group(1).strip()
            rules.setdefault(eid, []).append(props)
    print(f'===== {name} =====')
    for el in main.find_all(['h1', 'h2', 'h3', 'h4', 'p']):
        cls = ' '.join(el.get('class', []))
        if not any(k in cls for k in ['elementor-heading-title', 'elementor-image-box-title', 'elementor-image-box-description', 'eael-entry-title']):
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
            print(f'  <{el.name}> [{eid}] NO-RULE :: {text[:70]}')
            continue
        r = rs[0]
        print(f"  <{el.name}> [{eid}] fs={r.get('font-size','-'):>8} w={r.get('font-weight','-'):>4} lh={r.get('line-height','-'):>8} c={r.get('color','-'):>10} :: {text[:70]}")
    print()

pages = {
    'HOME': 'home.html',
    'SERVICES': 'services-52233a36.html',
    'IMPACT': 'impact-82d0052e.html',
    'CONNECT': 'connect-725dcf45.html',
    'MAPSENSE': 'mapsense-f887b8bf.html',
    'ENVIKI': 'enviki-16fda567.html',
    'ENVISION': 'envision-60f44dac.html',
}
for name, fname in pages.items():
    get_spec(fname, name)