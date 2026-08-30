with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

# I will find the start of the first renderReviewsProfile and the start of the second, and delete the first one entirely!
p1 = js.find('function renderReviewsProfile')
p2 = js.find('function renderReviewsProfile', p1 + 1)

if p1 != -1 and p2 != -1:
    js = js[:p1] + js[p2:]
    with open('src/main.js', 'w', encoding='utf-8') as f:
        f.write(js)
    print("Deleted duplicate!")
else:
    print("Not found twice", p1, p2)
