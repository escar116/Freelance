with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

import re
m = re.search(r'\.flex\s*\{', css)
if m:
    print("Found .flex")
else:
    print(".flex NOT FOUND")
