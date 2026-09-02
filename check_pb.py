with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

import re
m = re.search(r'function renderReviewsProfile.*?// Fetch reviews from Firestore', js, re.DOTALL)
if m: print(m.group(0)[:500].encode('ascii','ignore').decode('ascii'))
