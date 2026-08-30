with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Check if there's a .job-card rule with margins
import re
matches = re.findall(r'\.job-card\s*\{[^}]+\}', css)
for m in matches:
    print(m)
    print("---")
