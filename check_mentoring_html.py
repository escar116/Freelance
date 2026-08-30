with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

idx = html.find('mentoring-users-grid')
print(html[idx-200:idx+300])
