with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

import re
start = js.find('// Fetch reviews from Firestore')
end = js.find('} catch(e) {', start)
print(js[start:end].encode('ascii', 'ignore').decode('ascii'))
