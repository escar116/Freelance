with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

start1 = js.find('function renderReviewsProfile(reviews) {')
end1 = js.find('window.openViewProfileDialog = async function(userId)', start1)

print("Original Function:")
print(js[start1:end1].encode('ascii','ignore').decode('ascii'))
