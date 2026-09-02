with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

start = js.find('function setupMentoringDialog')
end = js.find('function', start + 30)
print(js[start:end].encode('ascii','ignore').decode('ascii'))
