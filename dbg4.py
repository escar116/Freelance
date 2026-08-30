with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

idx = html.find('dialog-view-profile')
print(html[idx:idx+800])
