with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

idx = js.find('function renderMentoringGrid')
end = js.find('function openViewProfileDialog', idx)
print(js[idx:end].encode('ascii','ignore').decode('ascii'))
