import re

with open('src/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = """    const reqs = userProfile.helpRequests_on_requester || [];
    $('#stat-emp-pending').textContent = reqs.filter(r => r.status === 'OPEN').length;
    $('#stat-emp-completed').textContent = reqs.filter(r => r.status === 'COMPLETED').length;
    $('#stat-emp-terminated').textContent = reqs.filter(r => r.status === 'TERMINATED').length;"""

replacement = """    const reqs = userProfile.helpRequests_on_requester || [];
    $('#stat-emp-pending').textContent = reqs.filter(r => r.status === 'OPEN').length;
    $('#stat-emp-completed').textContent = reqs.filter(r => r.status === 'COMPLETED').length;
    $('#stat-emp-terminated').textContent = reqs.filter(r => r.status === 'TERMINATED').length;

    try {
      const profileDoc = await getDoc(doc(firestore, "user_profiles", userData.id));
      if (profileDoc.exists()) {
        const data = profileDoc.data();
        userData.bio = data.bio || '';
        userData.skills = data.skills || [];
        
        const bioDisplay = document.getElementById('profile-bio-display');
        if (bioDisplay) bioDisplay.textContent = userData.bio || 'No bio provided yet.';
        
        const skillsDisplay = document.getElementById('profile-skills-display');
        if (skillsDisplay && userData.skills.length > 0) {
          skillsDisplay.innerHTML = userData.skills.map(s => `<span class="skill-pill" style="display:inline-block; margin:2px; background:var(--bg-card); color:var(--text-heading); border:1px solid var(--border-card); padding:4px 10px; border-radius:999px; font-size:12px;">${s}</span>`).join('');
        }
      }
    } catch(e) {
      console.error('Failed to fetch user_profile', e);
    }"""

content = content.replace(target, replacement)

with open('src/main.js', 'w', encoding='utf-8') as f:
    f.write(content)
