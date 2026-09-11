from bs4 import BeautifulSoup
import zipfile, re

with open(r'c:\Users\rahul\Desktop\Envint\envintwebsite\envintmigration\site-capture\html\home.html', 'r', encoding='utf-8', errors='ignore') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

with zipfile.ZipFile(r'c:\Users\rahul\Desktop\Envint\envintwebsite\envintmigration\envint-wp-content.zip', 'r') as z:
    css_content = z.read('wp-content/litespeed/css/61b13dfc2f62ba704cd277ee8b98ad4f.css').decode('utf-8', errors='ignore')

parents = soup.find_all('div', class_='e-parent')
print(f"Total parent sections: {len(parents)}")

for i, p in enumerate(parents):
    cid = p.get('data-id')
    print(f"\n==================== SECTION {i} [ID: {cid}] ====================")
    # Find headings and text elements
    for el in p.find_all(['h1', 'h2', 'h3', 'h4', 'p', 'a']):
        text = el.get_text(strip=True)
        if text and len(text) > 2:
            classes = el.get('class', [])
            el_id = el.parent.get('data-id') if el.parent else ''
            print(f"  <{el.name}> ({el_id}): {text[:70]}")
            
    # Search CSS rules for container and direct children
    cids = [cid] + [ch.get('data-id') for ch in p.find_all(True) if ch.get('data-id')]
    found_rules = set()
    for did in set(cids[:8]):
        for m in re.finditer(r'([^{}]*' + did + r'[^{}]*\{[^}]+\})', css_content):
            rule = m.group(1)
            # Filter to typography and layout
            if any(k in rule for k in ['font-', 'color:', 'line-height', 'padding', 'margin', 'background', 'gap', 'border']):
                found_rules.add(rule)
    print("  --- CSS RULES ---")
    for r in sorted(found_rules)[:10]:
        print(f"    {r[:160]}")
