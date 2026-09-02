import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Fix alignment of search bar inside Mentoring Hub
m_mentoring = re.search(r'<div class="page-header-flex">.*?<h1 class="page-title">Mentoring Hub</h1>.*?</div>', html, re.DOTALL)
if m_mentoring:
    old_html = m_mentoring.group(0)
    new_html = old_html.replace('class="page-header-flex"', 'class="page-header-flex" style="align-items: center;"')
    html = html.replace(old_html, new_html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
