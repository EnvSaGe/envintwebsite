from bs4 import BeautifulSoup
import re

with open(r'c:\Users\rahul\Desktop\Envint\envintwebsite\envintmigration\site-capture\html\home.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')
# Find element containing 'From the air we breathe'
target = None
for el in soup.find_all(string=lambda t: t and 'From the air we breathe' in t):
    target = el.parent
    break

if target:
    cont = target.find_parent('div', class_='e-parent')
    if cont:
        print("=== CONTAINER DATA-ID ===", cont.get('data-id'))
        print("=== CLASSES ===", cont.get('class'))
        print("=== PRETTIFIED HTML ===")
        print(cont.prettify())
        
        # Let's search all css rules matching data-ids inside this container
        data_ids = [cont.get('data-id')]
        for sub in cont.find_all(True):
            if sub.get('data-id'):
                data_ids.append(sub.get('data-id'))
                
        print("\n=== CSS RULES FOR DATA-IDS ===")
        for did in set(data_ids):
            for m in re.finditer(r'([^{}]*' + did + r'[^{}]*\{[^}]+\})', html):
                print(f"[{did}] {m.group(1)}")
