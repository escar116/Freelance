with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

idx = js.find('onAuthStateChanged(auth')
print(js[idx:idx+1200].encode('ascii','ignore').decode('ascii'))
