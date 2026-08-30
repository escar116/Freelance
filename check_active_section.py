with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

idx = js.find('let activeSection')
print(js[idx-100:idx+200].encode('ascii','ignore').decode('ascii'))
