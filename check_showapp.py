with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

idx = js.find('function showApp(')
print(js[idx:idx+1200].encode('ascii','ignore').decode('ascii'))
