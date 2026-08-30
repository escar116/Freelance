import re

with open('src/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's see the broken block
start_idx = content.find('appsHtml = pending.map(app => ')
end_idx = content.find('container.appendChild(jobEl);', start_idx)
print(content[start_idx:end_idx+30])
