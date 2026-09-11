from bs4 import BeautifulSoup

html_path = r'c:\Users\rahul\Desktop\Envint\envintwebsite\envintmigration\site-capture\html\about-f34bb62f.html'
with open(html_path, 'r', encoding='utf-8', errors='ignore') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

parents = soup.find_all('div', class_='e-parent')
for i in range(1, len(parents) - 1):
    p = parents[i]
    cid = p.get('data-id')
    print(f"\n==================== SECTION {i} [{cid}] ====================")
    for el in p.find_all(['h1', 'h2', 'h3', 'h4', 'p']):
        t = el.get_text(strip=True)
        if t:
            print(f"  <{el.name}>: {t}")
