with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

start = html.find('id="section-mentoring"')
end = html.find('</section>', start)
print(html[start:end+10].encode('ascii','ignore').decode('ascii'))
