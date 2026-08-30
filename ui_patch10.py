with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = html.replace('class="jobs-grid" id="mentoring-users-grid"', 'class="requests-grid" id="mentoring-users-grid"')
# Also adjust max-height from 55vh to 70vh to make the block bigger.
html = html.replace('max-height: 55vh;', 'max-height: 70vh;')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
