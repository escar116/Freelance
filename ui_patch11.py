with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Fix loading overlay logic in JS
js = js.replace("if (overlay) overlay.style.display = 'flex';", "if (overlay) overlay.classList.remove('hidden');")
js = js.replace("if (overlay) overlay.style.display = 'none';", "if (overlay) overlay.classList.add('hidden');")

with open('src/main.js', 'w', encoding='utf-8') as f:
    f.write(js)
