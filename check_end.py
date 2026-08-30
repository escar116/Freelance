with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

idx = js.find('renderReviewsProfile(reviews);')
print(js[idx-100:idx+250].encode('ascii','ignore').decode('ascii'))
