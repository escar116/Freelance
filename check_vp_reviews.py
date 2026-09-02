with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

start = js.find('// Fetch reviews from Firestore')
end = js.find('}', js.find('vp-ratings-list', start)) + 150
print(js[start:end].encode('ascii','ignore').decode('ascii'))
