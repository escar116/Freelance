with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Remove the bad text-muted override
css = css.replace('.text-muted { color: rgba(255, 255, 255, 0.6); }', '')

with open('style.css', 'w', encoding='utf-8') as f:
    f.write(css)
print("Removed bad text-muted override")
