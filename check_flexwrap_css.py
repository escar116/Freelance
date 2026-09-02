with open('style.css', 'r', encoding='utf-8') as f:
    lines = f.readlines()
for i, l in enumerate(lines):
    if 'flex-wrap' in l:
        print(f"Line {i}: {l.strip()}")
