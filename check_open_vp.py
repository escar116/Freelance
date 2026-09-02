with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

import re
m = re.search(r'window\.openViewProfileDialog = async.*?vpSkeleton\.classList\.remove\(\'hidden\'\);', js, re.DOTALL)
if m: print(m.group(0).encode('ascii','ignore').decode('ascii'))
