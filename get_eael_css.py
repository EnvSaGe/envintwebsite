import urllib.request
import re

req = urllib.request.Request('https://envintglobal.com/impact/', headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')
    css_urls = re.findall(r'href=[\'"](https://envintglobal\.com/[^\s\'"]+\.css[^\s\'"]*)[\'"]', html)
    for cu in css_urls:
        if any(k in cu for k in ['eael', 'post-2210', 'elementor']):
            try:
                c = urllib.request.urlopen(urllib.request.Request(cu, headers={'User-Agent': 'Mozilla/5.0'})).read().decode('utf-8', errors='ignore')
                for m in re.finditer(r'\.(?:eael-grid-post-holder|eael-entry-wrapper|eael-entry-title|eael-post-elements-readmore-btn)[^{]*\{([^}]+)\}', c):
                    print(cu)
                    print(m.group(0)[:250])
                    print('---')
            except Exception:
                pass
except Exception as e:
    print('Error:', e)
