with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

start = js.find('window.openViewProfileDialog = async function(userId)')
end = js.find('function renderReviewsProfile', start)
lines = js[start:end].split('\n')
for i, l in enumerate(lines):
    if 'return' in l or 'catch' in l or 'finally' in l or 'hidden' in l:
        print(f"{i}: {l}")
