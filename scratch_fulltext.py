import io
import sys
from bs4 import BeautifulSoup

PAGES = {
    'careers': 'envintmigration/site-capture/html/careers-at-envint-c5d2f9d8.html',
    'services': 'envintmigration/site-capture/html/services-52233a36.html',
    'connect': 'envintmigration/site-capture/html/connect-725dcf45.html',
    'mapsense': 'envintmigration/site-capture/html/mapsense-f887b8bf.html',
    'enviki': 'envintmigration/site-capture/html/enviki-16fda567.html',
    'envision': 'envintmigration/site-capture/html/envision-60f44dac.html',
    'impact': 'envintmigration/site-capture/html/impact-82d0052e.html',
}


def dump(path, label):
    with io.open(path, encoding='utf-8', errors='ignore') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    for t in soup(['script', 'style', 'noscript', 'svg', 'template', 'form']):
        t.decompose()
    main = soup.find('main') or soup.body
    print(f"\n########## {label} ##########")
    for el in main.find_all(['h1', 'h2', 'h3', 'h4', 'p', 'li']):
        t = el.get_text(' ', strip=True)
        if t and len(t) > 1:
            cls = ' '.join(el.get('class', []))[:45]
            print(f"[{el.name}|{cls}] {t}")


for label, path in PAGES.items():
    dump(path, label)
