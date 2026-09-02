with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

start = html.find('id="section-profile"')
end = html.find('</section>', start)
print(html[start:start+1200].encode('ascii','ignore').decode('ascii'))
