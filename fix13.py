import base64

with open('src/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

bad = r'\<span class="skill-pill" style="display:inline-block; margin:2px; background:var(--bg-card); color:var(--text-heading); border:1px solid var(--border-card); padding:4px 10px; border-radius:999px; font-size:12px;">\</span>\).join(\'\');'
import re
# The bad string is too complicated to match exactly because of backslashes.
# Let's just find the line and replace it.
lines = content.split('\n')
for i, line in enumerate(lines):
    if 'skillsDisplay.innerHTML = skills.map(s =>' in line:
        lines[i] = '          skillsDisplay.innerHTML = skills.map(s => <span class="skill-pill" style="display:inline-block; margin:2px; background:var(--bg-card); color:var(--text-heading); border:1px solid var(--border-card); padding:4px 10px; border-radius:999px; font-size:12px;"></span>).join(\'\');'

with open('src/main.js', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))
