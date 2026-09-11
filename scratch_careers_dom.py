import io
from bs4 import BeautifulSoup

path = 'envintmigration/site-capture/html/careers-at-envint-c5d2f9d8.html'
with io.open(path, encoding='utf-8', errors='ignore') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

body = soup.find('body')
# iterate top-level flow: sections and headers/footers and elements inside main
main = soup.find('main') or body

idx = 0
for el in main.find_all(['section', 'header', 'footer'], recursive=True):
    if el.parent is not None and el.parent.name in ('section', 'header', 'footer'):
        continue
    classes = el.get('class', [])
    if 'e-parent' in classes:
        continue
    # look inside for headings
    texts = []
    for t in el.find_all(['h1', 'h2', 'h3', 'h4'], limit=6):
        tx = t.get_text(' ', strip=True)
        if tx:
            texts.append(tx[:70])
    # get background image urls
    style = el.get('style') or ''
    imgs = [i.get('src') for i in el.find_all('img', limit=3) if i.get('src') and 'uploads' in i.get('src','')]
    has_explore = 'Explore a career' in el.get_text()
    has_mail = 'careers@' in el.get_text()
    print(f"--- [{el.name}] {classes[:3]} explore={has_explore} mail={has_mail}")
    if texts:
        print("    H:", texts)
    if imgs:
        print("    IMG:", imgs[:2])
