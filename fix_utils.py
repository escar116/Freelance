with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

utils = """
/* Utility Classes for JS Injected Cards */
.flex { display: flex; }
.flex-col { display: flex; flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.gap-1 { gap: 0.25rem; }
.gap-2 { gap: 0.5rem; }
.gap-3 { gap: 0.75rem; }
.gap-4 { gap: 1rem; }
.mb-1 { margin-bottom: 0.25rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 0.75rem; }
.mb-4 { margin-bottom: 1rem; }
.mt-auto { margin-top: auto; }
.text-sm { font-size: 0.875rem; }
.font-bold { font-weight: bold; }
.text-muted { color: rgba(255, 255, 255, 0.6); }
"""

if '.flex { display: flex; }' not in css:
    css += utils
    with open('style.css', 'w', encoding='utf-8') as f:
        f.write(css)
    print("Utilities added!")
else:
    print("Utilities already present")
