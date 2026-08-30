with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Check vp-skeleton
idx = html.find('vp-skeleton')
if idx == -1:
    print("vp-skeleton NOT FOUND!")
else:
    print("vp-skeleton found at", idx)
    print(html[idx-50:idx+200])

print("\n---\n")

# Check vp-body
idx2 = html.find('vp-body')
if idx2 == -1:
    print("vp-body NOT FOUND!")
else:
    print("vp-body found at", idx2)
    print(html[idx2-50:idx2+100])
