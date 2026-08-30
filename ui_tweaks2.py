import re
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('<h2>Post a Service / Service Request</h2>', '<h2>Post a Service</h2>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
