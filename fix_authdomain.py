with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

old_domain_line = 'authDomain: window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "work4abit.firebaseapp.com" : window.location.hostname,'
new_domain_line = 'authDomain: "work4abit.firebaseapp.com",'

if old_domain_line in js:
    js = js.replace(old_domain_line, new_domain_line)
    with open('src/main.js', 'w', encoding='utf-8') as f:
        f.write(js)
    print("Fixed authDomain")
else:
    print("Could not find the exact line")
