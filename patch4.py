import re

with open('src/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = """    try {
      const res = await listAllUsers(dc);
      let users = res.data.users || [];
      users = users.filter(u => u.id !== userData.id);
      allUsersData = users;
      renderMentoringGrid(users);"""

replacement = """    try {
      const res = await listAllUsers(dc);
      let users = res.data.users || [];
      users = users.filter(u => u.id !== userData.id);
      
      try {
        const profilesSnap = await getDocs(collection(firestore, "user_profiles"));
        const profilesMap = {};
        profilesSnap.forEach(d => { profilesMap[d.id] = d.data(); });
        users.forEach(u => {
          u.bio = profilesMap[u.id]?.bio || '';
          u.skills = profilesMap[u.id]?.skills || [];
        });
      } catch(e) {}
      
      allUsersData = users;
      renderMentoringGrid(users);"""

content = content.replace(target, replacement)

with open('src/main.js', 'w', encoding='utf-8') as f:
    f.write(content)
