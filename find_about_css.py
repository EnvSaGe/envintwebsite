import zipfile, re

with zipfile.ZipFile(r'c:\Users\rahul\Desktop\Envint\envintwebsite\envintmigration\envint-wp-content.zip', 'r') as z:
    for n in z.namelist():
        if 'litespeed/css' in n and n.endswith('.css'):
            raw = z.read(n).decode('utf-8', errors='ignore')
            if '66b2318' in raw or '8b69cb9' in raw:
                print("FOUND CSS FILE FOR ABOUT:", n)
                for target_id in ['66b2318', '8b69cb9', 'c3a7276', '202b14c', '31fb9cf']:
                    for m in re.finditer(r'([^{}]*' + target_id + r'[^{}]*\{[^}]+\})', raw):
                        r = m.group(1)
                        if any(k in r for k in ['font-', 'color:', 'padding', 'margin', 'background', 'height', 'width', 'border']):
                            print(f"[{target_id}] {r}")
                break
