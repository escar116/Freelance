with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
m1 = re.search(r'(<h3 class="profile-block-heading mb-2">Credentials & references</h3>.*?)</div', html, re.DOTALL)
if m1: print("VP:\n" + m1.group(1).encode('ascii','ignore').decode('ascii'))
