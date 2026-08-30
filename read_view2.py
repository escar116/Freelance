with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

start = js.find('window.openViewProfileDialog = async function(userId)')
end = js.find('function renderReviewsProfile', start)
text = js[start:end]
print(text.encode('ascii', 'ignore').decode('ascii'))
