import re

with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

pattern = re.compile(r"(\} catch\s*\(err\)\s*\{\s*console\.error\('Error loading profile:', err\);\s*\})(\s*\})")
js, count = pattern.subn(r"\1 finally {\n    const overlay = document.getElementById('vp-loading-overlay');\n    if (overlay) overlay.style.display = 'none';\n  }\2", js)
print("Replaced:", count)

with open('src/main.js', 'w', encoding='utf-8') as f:
    f.write(js)
