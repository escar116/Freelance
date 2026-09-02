with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

start = js.find('async function loadProfile()')
end = js.find('} catch', js.find('renderReviewsProfile', start))
print(js[start:end+50].encode('ascii','ignore').decode('ascii'))
