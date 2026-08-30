with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Make gap tighter on the mentoring card specifically
js = js.replace('<div class="flex items-center gap-3 mb-3">', '<div class="flex items-center gap-2 mb-3">')

with open('src/main.js', 'w', encoding='utf-8') as f:
    f.write(js)
print("done")
