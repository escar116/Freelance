import re
with open('src/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(r"\'N/A\'", "'N/A'")
content = content.replace(r"\'-'", "'-'")

with open('src/main.js', 'w', encoding='utf-8') as f:
    f.write(content)
