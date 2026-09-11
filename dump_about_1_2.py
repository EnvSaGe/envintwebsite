from bs4 import BeautifulSoup

html_path = r'c:\Users\rahul\Desktop\Envint\envintwebsite\envintmigration\site-capture\html\about-f34bb62f.html'
with open(html_path, 'r', encoding='utf-8', errors='ignore') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

parents = soup.find_all('div', class_='e-parent')
with open('about_sec_1_2.txt', 'w', encoding='utf-8') as out:
    for i in [1, 2]:
        p = parents[i]
        out.write(f"\n=== SECTION {i} [{p.get('data-id')}] ===\n")
        for el in p.find_all(['h1', 'h2', 'h3', 'h4', 'p']):
            out.write(f"<{el.name}>: {el.get_text(strip=True)}\n")
