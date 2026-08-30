import re

with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Add CSS variables for Status
if '--status-pending' not in css:
    css = css.replace(':root {', ':root {\n    --status-pending: #f59e0b;\n    --status-completed: #10b981;\n    --status-terminated: #ef4444;')

# Add mb-6
if '.mb-6' not in css:
    css = css.replace('.mb-4 { margin-bottom: 1rem; }', '.mb-4 { margin-bottom: 1rem; }\n.mb-6 { margin-bottom: 1.5rem; }')

# Make dialog-close-btn more obvious
# Current:
# .dialog-close-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 1.25rem; transition: 0.2s; }
css = re.sub(r'\.dialog-close-btn\s*\{[^}]*\}', '.dialog-close-btn { background: none; border: none; color: var(--text-heading); cursor: pointer; font-size: 2rem; font-weight: bold; transition: 0.2s; }', css)

with open('style.css', 'w', encoding='utf-8') as f:
    f.write(css)
