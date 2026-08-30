with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

start = js.find('window.openViewProfileDialog = async function')
end = js.find('window.setupMentoringDialog = function()', start)
if end == -1:
    end = start + 2000
text = js[start:end]
print(text.encode('ascii', 'ignore').decode('ascii'))
