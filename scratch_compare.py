import io
import sys
from bs4 import BeautifulSoup

CAPTURE = {
    'impact': 'envintmigration/site-capture/html/impact-82d0052e.html',
    'careers': 'envintmigration/site-capture/html/careers-at-envint-c5d2f9d8.html',
    'services': 'envintmigration/site-capture/html/services-52233a36.html',
    'connect': 'envintmigration/site-capture/html/connect-725dcf45.html',
    'mapsense': 'envintmigration/site-capture/html/mapsense-f887b8bf.html',
    'about': 'envintmigration/site-capture/html/about-f34bb62f.html',
}


def capture_blocks(path):
    with io.open(path, encoding='utf-8', errors='ignore') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    for t in soup(['script', 'style', 'noscript', 'svg', 'template']):
        t.decompose()
    main = soup.find('main') or soup.body
    out = []
    for el in main.find_all(['h1', 'h2', 'h3', 'h4', 'p']):
        t = el.get_text(' ', strip=True)
        if t and len(t) > 3:
            out.append(f"[{el.name}] {t}")
    return out


for name, path in CAPTURE.items():
    cap = capture_blocks(path)
    try:
        with io.open(f'scratch_live_now_{name}.txt', encoding='utf-8') as f:
            live = [l for l in f.read().splitlines() if l.strip()]
    except FileNotFoundError:
        print(f'-- {name}: no live dump')
        continue
    # First-block prefix compare on normalized text
    def norm(s):
        return ' '.join(s.split())
    cap_n = [norm(x) for x in cap]
    live_n = [norm(x) for x in live]
    only_cap = [x for x in cap_n if not any(x[:80] in y or y[:80] in x for y in live_n)]
    only_live = [x for x in live_n if not any(x[:80] in y or y[:80] in x for y in cap_n)]
    print(f"===== {name}: capture {len(cap_n)} vs live {len(live_n)}")
    print(f"  only-in-CAPTURE ({len(only_cap)}):")
    for x in only_cap[:25]:
        print('   C:', x[:130])
    print(f"  only-in-LIVE ({len(only_live)}):")
    for x in only_live[:25]:
        print('   L:', x[:130])
