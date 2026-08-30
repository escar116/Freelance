with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Verify
for el in ['vp-skeleton', 'vp-body', 'skeleton-loader']:
    if el in html:
        print(f"FOUND: {el}")
    else:
        print(f"MISSING: {el}")
