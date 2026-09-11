import urllib.request
import re

req = urllib.request.Request('https://envintglobal.com/impact/', headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        matches = re.findall(r'https://envintglobal\.com/wp-content/uploads/[^\s"\'\)]+?\.(?:webp|avif|jpg|png)', html)
        for m in sorted(list(set(matches))):
            print(m)
except Exception as e:
    print('Error:', e)
