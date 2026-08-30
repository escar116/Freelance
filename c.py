with open('src/main.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()
for i, line in enumerate(lines):
    if 'edit-profile-form' in line:
        for j in range(i-2, i+40):
            print(f'{j}: {lines[j].strip()}')
        break
