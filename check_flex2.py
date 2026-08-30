with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

import re
matches = re.findall(r'\.[a-zA-Z0-9_-]+\s*\{[^}]*display:\s*flex[^}]*\}', css)
for m in matches:
    print(m.split('{')[0].strip())
