import os
from bs4 import BeautifulSoup

site_html_dir = r'c:\Users\rahul\Desktop\Envint\envintwebsite\envintmigration\site-capture\html'
files = os.listdir(site_html_dir)

print("=== Captured HTML Pages ===")
for f in sorted(files):
    if any(k in f.lower() for k in ['about', 'service', 'impact', 'career', 'connect', 'sustainability', 'responsible', 'climate', 'envision']):
        print(f)
