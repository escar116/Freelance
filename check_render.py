with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

import re
m_render = re.search(r'function renderReviewsProfile.*?// Fetch reviews from Firestore', js, re.DOTALL)
if m_render:
    print(m_render.group(0).encode('ascii','ignore').decode('ascii'))
