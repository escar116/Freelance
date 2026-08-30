with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

import re
matches = re.findall(r'\.profile-hero\s*\{[^}]+\}', css)
for m in matches: print(m)
matches2 = re.findall(r'\.credentials-card', css)
if matches2: print("credentials-card exists")
