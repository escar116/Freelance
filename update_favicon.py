with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

head_close_idx = html.find('</head>')
if head_close_idx != -1:
    # Check if there is already a favicon link
    if 'rel="icon"' in html[:head_close_idx]:
        import re
        html = re.sub(r'<link[^>]*rel=["\']icon["\'][^>]*>', '<link rel="icon" type="image/png" href="/favicon.png" />', html)
        print("Replaced existing favicon")
    else:
        favicon_tag = '    <link rel="icon" type="image/png" href="/favicon.png" />\n'
        html = html[:head_close_idx] + favicon_tag + html[head_close_idx:]
        print("Added new favicon")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
