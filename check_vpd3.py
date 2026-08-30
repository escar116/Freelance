with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

start = js.find('window.openViewProfileDialog = async function(userId)')
end = js.find('\nfunction renderReviewsProfile', start)
print(js[start:end].encode('ascii','ignore').decode('ascii'))
