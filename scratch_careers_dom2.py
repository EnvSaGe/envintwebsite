import io
from bs4 import BeautifulSoup

path = 'envintmigration/site-capture/html/careers-at-envint-c5d2f9d8.html'
with io.open(path, encoding='utf-8', errors='ignore') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

parents = soup.find_all('div', class_='e-parent')
print('total e-parent sections:', len(parents))
for i, p in enumerate(parents):
    texts = []
    for t in p.find_all(['h1', 'h2', 'h3', 'h4', 'p', 'span', 'a'], limit=8):
        tx = t.get_text(' ', strip=True)
        if tx and len(tx) > 1 and tx not in texts:
            texts.append(tx[:75])
    style_els = p.select('[style*="background-image"]')
    bgs = [s.get('style')[:120] for s in style_els[:2]]
    imgs = []
    for im in p.find_all('img', limit=4):
        src = im.get('src') or im.get('data-src') or ''
        if 'uploads' in src:
            imgs.append(src.split('/')[-1])
    print(f"\n===== e-parent {i} [{p.get('data-id')}] bgs={bgs}")
    for x in texts:
        print('   ', x)
    if imgs:
        print('    imgs:', imgs)
