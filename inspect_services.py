from bs4 import BeautifulSoup

html_path = r'c:\Users\rahul\Desktop\Envint\envintwebsite\envintmigration\site-capture\html\services-52233a36.html'
with open(html_path, 'r', encoding='utf-8', errors='ignore') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

body = soup.find('body')
if body:
    print('Body classes:', body.get('class'))

parents = soup.find_all('div', class_='e-parent')
print(f"Total sections in services: {len(parents)}")

for i, p in enumerate(parents):
    cid = p.get('data-id')
    classes = p.get('class', [])
    print(f"\n==================== SERVICES SEC {i} [{cid}] ====================")
    for el in p.find_all(['h1', 'h2', 'h3', 'h4', 'p']):
        t = el.get_text(strip=True)
        if t and len(t) > 1:
            print(f"  <{el.name}>: {t[:90]}")
