with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()
start = html.find('<dialog id="dialog-view-profile"')
end = html.find('</dialog>', start)
print(html[start:end])
