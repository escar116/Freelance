with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = html.replace(
    '<div class="search-filter-panel mb-4" style="display: flex; justify-content: flex-start;">',
    '<div class="search-filter-panel mb-4" style="display: flex; justify-content: flex-end;">'
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
