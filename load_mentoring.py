with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()
start = js.find('async function loadMentoring()')
end = js.find('allUsersData = users;', start)
print(js[start:end])
