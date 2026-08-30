with open('src/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

start = content.find('function renderMentoringGrid(users)')
end = content.find('function setupMentoringDialog()')
print(content[start:end])
