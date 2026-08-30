import re

with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Update CSS variables mapping
# --color-green: var(--status-completed);
# --color-amber: var(--status-pending);
# --color-red: var(--status-terminated);
# We can just change the definitions of --color-green etc in :root
css = css.replace('--color-green: #16a34a;', '--color-green: var(--status-completed);')
css = css.replace('--color-amber: #f59e0b;', '--color-amber: var(--status-pending);')
css = css.replace('--color-red: #ef4444;', '--color-red: var(--status-terminated);')

# Also fix .badge-pending hardcoded colors
css = css.replace('.badge-pending { background: #fffbeb; color: #d97706; }', '.badge-pending { background: color-mix(in srgb, var(--status-pending) 15%, transparent); color: var(--status-pending); }')

# For badge-approved, let's make it use completed
css = css.replace('.badge-approved { background: var(--color-green-bg); color: var(--color-green); }', '.badge-approved { background: color-mix(in srgb, var(--status-completed) 15%, transparent); color: var(--status-completed); }')

# And badge-rejected
css = css.replace('.badge-rejected { background: var(--color-red-bg); color: var(--color-red); }', '.badge-rejected { background: color-mix(in srgb, var(--status-terminated) 15%, transparent); color: var(--status-terminated); }')

with open('style.css', 'w', encoding='utf-8') as f:
    f.write(css)
