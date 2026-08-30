import re

with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

target = """    try {
      const res = await getUserProfile(dc, { id: userId }, SERVER_ONLY);
      const user = res.data.user;
      if (!user) return;"""

replacement = """    try {
      const res = await getUserProfile(dc, { id: userId }, SERVER_ONLY);
      const user = res.data.user;
      if (!user) return;
      
      try {
        const allRes = await listAllUsers(dc);
        const fullUser = allRes.data.users.find(u => u.id === userId);
        if (fullUser) {
          user.facultyReference = fullUser.facultyReference;
          user.preferredRole = fullUser.preferredRole;
        }
      } catch(e) {}"""

js = js.replace(target, replacement)

with open('src/main.js', 'w', encoding='utf-8') as f:
    f.write(js)
