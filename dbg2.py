with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

idx = js.find('vpDialog.showModal')
print(js[idx:idx+300].encode('ascii','ignore').decode('ascii'))
