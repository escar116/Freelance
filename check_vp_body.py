with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

idx = html.find('<div id="vp-body">')
end = html.find('</div>', html.find('ratings-feedback-list'))
print(html[idx:idx+800])
