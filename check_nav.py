with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

idx = js.find('function navigateTo')
print(js[idx:idx+800])
