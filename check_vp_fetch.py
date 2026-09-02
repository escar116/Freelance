with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

start = js.find('window.openViewProfileDialog =')
end = js.find('catch', js.find('getDoc', start))
print(js[start:end+100].encode('ascii','ignore').decode('ascii'))
