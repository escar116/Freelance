import re
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('<input type="text" id="mentoring-search-input" class="search-input mt-2 mb-2"', '<input type="text" id="mentoring-search-input" class="search-input"')

# Find the search-bar div for mentoring and add margin
# Currently:
# <div class="search-filter-panel mb-6">
#     <div class="search-bar">
#        <svg ...
content = content.replace(
'''<div class="search-filter-panel mb-6">
                        <div class="search-bar">''',
'''<div class="search-filter-panel mb-6">
                        <div class="search-bar mb-4">''')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
