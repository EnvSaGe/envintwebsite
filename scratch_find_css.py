import os, re

base_dir = r'c:\Users\rahul\Desktop\Envint\envintwebsite\envintmigration'
ids = ['ad30e59', 'e9a1b33', '67f2987']

for root, dirs, files in os.walk(base_dir):
    for f in files:
        if f.endswith('.css') or f.endswith('.html'):
            path = os.path.join(root, f)
            try:
                with open(path, 'r', encoding='utf-8', errors='ignore') as fl:
                    content = fl.read()
                for target_id in ids:
                    for m in re.finditer(r'([^{}]*' + target_id + r'[^{}]*\{[^}]+\})', content):
                        print(f"[{f}] {m.group(1)}")
            except Exception as e:
                pass
