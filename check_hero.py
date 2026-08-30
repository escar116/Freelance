with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

idx = html.find('<div class="profile-hero mb-6">')
print(html[idx:idx+800])
