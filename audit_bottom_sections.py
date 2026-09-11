from bs4 import BeautifulSoup
import zipfile, re

with open(r'c:\Users\rahul\Desktop\Envint\envintwebsite\envintmigration\site-capture\html\home.html', 'r', encoding='utf-8', errors='ignore') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

with zipfile.ZipFile(r'c:\Users\rahul\Desktop\Envint\envintwebsite\envintmigration\envint-wp-content.zip', 'r') as z:
    css = z.read('wp-content/litespeed/css/61b13dfc2f62ba704cd277ee8b98ad4f.css').decode('utf-8', errors='ignore')

visible_sections = ['d696401', '0dad902', 'a120a62', '2413921', 'b0bcc10']

for cid in visible_sections:
    el = soup.find('div', attrs={'data-id': cid})
    print(f"\n====================== SECTION {cid} ======================")
    if not el:
        continue
    # Print headings & text
    for item in el.find_all(['h1', 'h2', 'h3', 'h4', 'p', 'a']):
        txt = item.get_text(strip=True)
        if txt and len(txt) > 2:
            pid = item.parent.get('data-id') if item.parent else ''
            print(f"  <{item.name}> [{pid}]: {txt[:70]}")
            
    # Search all rules for this section
    cids = [cid] + [ch.get('data-id') for ch in el.find_all(True) if ch.get('data-id')]
    print("  --- CSS RULES ---")
    seen = set()
    for did in set(cids):
        for m in re.finditer(r'([^{}]*' + did + r'[^{}]*\{[^}]+\})', css):
            r = m.group(1)
            if any(k in r for k in ['font-', 'color:', 'padding', 'margin', 'background', 'gap', 'border', 'width:']):
                if r not in seen:
                    seen.add(r)
                    print(f"    [{did}] {r[:150]}")
