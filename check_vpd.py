with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

idx = js.find('openViewProfileDialog')
if idx == -1:
    print("MISSING: openViewProfileDialog not found at all!")
else:
    # find the function definition
    defn = js.find('window.openViewProfileDialog', idx)
    if defn == -1:
        defn = js.find('openViewProfileDialog = async', idx)
    if defn == -1:
        print("MISSING: function definition not found")
    else:
        print("FOUND at char", defn)
        snippet = js[defn:defn+200]
        print(snippet.encode('ascii','ignore').decode('ascii'))
