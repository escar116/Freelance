import re

with open('src/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = """    document.getElementById('vp-emp-pending').textContent = reqs.filter(r => r.status === 'OPEN').length;
    document.getElementById('vp-emp-completed').textContent = reqs.filter(r => r.status === 'COMPLETED').length;
    document.getElementById('vp-emp-terminated').textContent = reqs.filter(r => r.status === 'TERMINATED').length;"""

replacement = """    document.getElementById('vp-emp-pending').textContent = reqs.filter(r => r.status === 'OPEN').length;
    document.getElementById('vp-emp-completed').textContent = reqs.filter(r => r.status === 'COMPLETED').length;
    document.getElementById('vp-emp-terminated').textContent = reqs.filter(r => r.status === 'TERMINATED').length;

    try {
      const profileDoc = await getDoc(doc(firestore, "user_profiles", userId));
      if (profileDoc.exists()) {
        const data = profileDoc.data();
        const vpBio = document.getElementById('vp-bio');
        if (vpBio) vpBio.textContent = data.bio || 'No bio provided.';
        
        const vpSkills = document.getElementById('vp-skills');
        if (vpSkills) {
          if (data.skills && data.skills.length > 0) {
            vpSkills.innerHTML = '<div class="flex flex-wrap gap-2">' + data.skills.map(s => `<span class="badge" style="background: rgba(255,255,255,0.05);">${s}</span>`).join('') + '</div>';
          } else {
            vpSkills.innerHTML = '<span class="text-sm text-muted">No skills listed.</span>';
          }
        }
      } else {
        document.getElementById('vp-bio').textContent = 'No bio provided.';
        document.getElementById('vp-skills').innerHTML = '<span class="text-sm text-muted">No skills listed.</span>';
      }
    } catch(e) {
      console.error(e);
    }"""

content = content.replace(target, replacement)

with open('src/main.js', 'w', encoding='utf-8') as f:
    f.write(content)
