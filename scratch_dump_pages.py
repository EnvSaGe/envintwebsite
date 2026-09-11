import sys
from bs4 import BeautifulSoup


def dump(path, label, maxlen=220, only_el=None):
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    for t in soup(['script', 'style', 'noscript', 'svg', 'template']):
        t.decompose()
    main = soup.find('main')
    if main is None:
        main = soup.body
    print(f"\n########## {label} ##########")
    tags = only_el or ['h1', 'h2', 'h3', 'h4', 'p', 'li', 'figcaption', 'blockquote']
    for el in main.find_all(tags):
        t = el.get_text(' ', strip=True)
        if t and len(t) > 2:
            cls = ' '.join(el.get('class', []))[:40]
            print(f"[{el.name}|{cls}] {t[:maxlen]}")


if __name__ == '__main__':
    pairs = [
        ('impact', 'envintmigration/site-capture/html/impact-82d0052e.html'),
        ('careers', 'envintmigration/site-capture/html/careers-at-envint-c5d2f9d8.html'),
        ('services', 'envintmigration/site-capture/html/services-52233a36.html'),
        ('connect', 'envintmigration/site-capture/html/connect-725dcf45.html'),
        ('mapsense', 'envintmigration/site-capture/html/mapsense-f887b8bf.html'),
        ('esq', 'envintmigration/site-capture/html/esq-cbdbccbb.html'),
        ('about', 'envintmigration/site-capture/html/about-f34bb62f.html'),
    ]
    for label, path in pairs:
        dump(path, label)
