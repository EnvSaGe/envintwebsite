from bs4 import BeautifulSoup

html_path = r'c:\Users\rahul\Desktop\Envint\envintwebsite\envintmigration\site-capture\html\connect-725dcf45.html'
with open(html_path, 'r', encoding='utf-8', errors='ignore') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

for sid in ['e3cc80f', '01f7951']:
    sec = soup.find('div', {'data-id': sid})
    if sec:
        print(f'=== SECTION {sid} ===')
        for el in sec.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'p', 'form']):
            if el.name == 'form':
                print('  <form>')
                for inp in el.find_all(['input', 'select', 'textarea', 'button']):
                    print('    ', inp.name, inp.get('name'), inp.get('placeholder'), inp.get('type'))
            else:
                txt = el.get_text(strip=True)
                if txt:
                    print(f'  <{el.name}>: {txt}')
