import io
import urllib.request
import sys
from bs4 import BeautifulSoup

PAGES = {
    'home': 'https://envintglobal.com/',
    'impact': 'https://envintglobal.com/impact/',
    'careers': 'https://envintglobal.com/careers-at-envint/',
    'services': 'https://envintglobal.com/services/',
    'connect': 'https://envintglobal.com/connect/',
    'mapsense': 'https://envintglobal.com/mapsense/',
    'esq': 'https://envintglobal.com/esq/',
    'about': 'https://envintglobal.com/about/',
    'enviki': 'https://envintglobal.com/enviki/',
    'envision': 'https://envintglobal.com/envision/',
    'behind-the-buzz': 'https://envintglobal.com/behind-the-buzz/',
    'glossary-zone': 'https://envintglobal.com/glossary-zone/',
    'how-to-articles': 'https://envintglobal.com/how-to-articles/',
    'gbc2024': 'https://envintglobal.com/connect-gbc2024/',
}


def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})
    r = urllib.request.urlopen(req, timeout=40)
    data = r.read()
    return r.status, data


def text_blocks(html_bytes):
    soup = BeautifulSoup(html_bytes.decode('utf-8', 'ignore'), 'html.parser')
    for t in soup(['script', 'style', 'noscript', 'svg', 'template']):
        t.decompose()
    main = soup.find('main') or soup.body
    out = []
    for el in main.find_all(['h1', 'h2', 'h3', 'h4', 'p']):
        t = el.get_text(' ', strip=True)
        if t and len(t) > 3:
            out.append(f"[{el.name}] {t}")
    return out


for name, url in PAGES.items():
    try:
        status, data = fetch(url)
    except Exception as e:
        print(f"{name}: ERR {e}", flush=True)
        continue
    blocks = text_blocks(data)
    with io.open(f'scratch_live_now_{name}.txt', 'w', encoding='utf-8') as f:
        f.write('\n'.join(blocks))
    print(f"{name}: {status} {len(data)} bytes, {len(blocks)} blocks", flush=True)
