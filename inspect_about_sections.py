from bs4 import BeautifulSoup
import zipfile, re

html_path = r'c:\Users\rahul\Desktop\Envint\envintwebsite\envintmigration\site-capture\html\about-f34bb62f.html'
with open(html_path, 'r', encoding='utf-8', errors='ignore') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

parents = soup.find_all('div', class_='e-parent')
print(f"Total sections in about: {len(parents)}")

for i, p in enumerate(parents):
    cid = p.get('data-id')
    classes = p.get('class', [])
    if 'elementor-hidden-desktop' in classes and 'elementor-hidden-mobile' in classes:
        continue
    print(f"\n==================== ABOUT SEC {i} [{cid}] ====================")
    for h in p.find_all(['h1', 'h2', 'h3', 'h4', 'p', 'a']):
        t = h.get_text(strip=True)
        if t and len(t) > 1:
            print(f"  <{h.name}>: {t[:80]}")
