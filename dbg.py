with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

idx = js.find('window.openViewProfileDialog')
print(js[idx:idx+600].encode('ascii','ignore').decode('ascii'))
