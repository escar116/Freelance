with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

import re
m = re.search(r'function renderMentoringGrid.*?card\.innerHTML = `(.*?)`;', js, re.DOTALL)
if m:
    print(m.group(1).encode('ascii','ignore').decode('ascii'))
