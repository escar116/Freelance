with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

start = js.find('function renderMentoringGrid(users)')
end = js.find('function openViewProfileDialog', start)
print(js[start:end].encode('ascii','ignore').decode('ascii'))
