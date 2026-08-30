with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Find renderReviewsProfile call inside openViewProfileDialog
idx = js.find('renderReviewsProfile(reviews);')
# show context around it
print(js[idx-50:idx+200].encode('ascii','ignore').decode('ascii'))
