with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

import re
# First, let's locate openViewProfileDialog and fix it
m_dialog = re.search(r'window\.openViewProfileDialog = async function.*?vpSkeleton\.classList\.remove\(\'hidden\'\);', js, re.DOTALL)
if m_dialog:
    print("Found Dialog Clear Logic:")
    print(m_dialog.group(0).encode('ascii','ignore').decode('ascii'))
