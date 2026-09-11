from bs4 import BeautifulSoup
import zipfile, re, os

about_html_path = r'c:\Users\rahul\Desktop\Envint\envintwebsite\envintmigration\site-capture\html\about.html'
if not os.path.exists(about_html_path):
    print("about.html does not exist, searching site-capture...")
    for root, dirs, files in os.walk(r'c:\Users\rahul\Desktop\Envint\envintwebsite\envintmigration\site-capture'):
        for f in files:
            if 'about' in f.lower():
                print(os.path.join(root, f))
else:
    with open(about_html_path, 'r', encoding='utf-8', errors='ignore') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')

    parents = soup.find_all('div', class_='e-parent')
    print(f"Total parent sections in about.html: {len(parents)}")
    for i, p in enumerate(parents):
        cid = p.get('data-id')
        classes = p.get('class')
        print(f"\n--- Section {i} [{cid}] {classes} ---")
        for h in p.find_all(['h1', 'h2', 'h3', 'h4', 'p', 'a']):
            txt = h.get_text(strip=True)
            if txt and len(txt) > 2:
                print(f"  <{h.name}>: {txt[:70]}")
