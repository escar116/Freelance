import re

with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

def replacer(match):
    return """window.openViewProfileDialog = async function(userId) {
  const dialog = document.getElementById('dialog-view-profile');
  const overlay = document.getElementById('vp-loading-overlay');
  if (dialog) dialog.showModal();
  if (overlay) overlay.classList.remove('hidden');

  try {
    const res = await getUserProfile(dc, { id: userId }, SERVER_ONLY);
    const user = res.data.user;
    if (!user) return;
    
    try {
      const allRes = await listAllUsers(dc);
      const fullUser = allRes.data.users.find(u => u.id === userId);
      if (fullUser) {
        user.facultyReference = fullUser.facultyReference;
      }
    } catch(e) {}
    
    document.getElementById('vp-avatar').textContent = initials(user.fullName);
    document.getElementById('vp-name').textContent = user.fullName;
    if (document.getElementById('vp-program')) document.getElementById('vp-program').textContent = user.program || 'N/A';
    if (document.getElementById('vp-faculty')) document.getElementById('vp-faculty').textContent = user.facultyReference || 'Not provided';
    document.getElementById('vp-student-id').textContent = user.studentId || 'N/A';"""

js = re.sub(r"window\.openViewProfileDialog\s*=\s*async\s*function\s*\(\s*userId\s*\)\s*\{[\s\S]*?document\.getElementById\('vp-student-id'\)\.textContent\s*=\s*user\.studentId\s*\|\|\s*'N/A';", replacer, js)

def replacer_end(match):
    return """    renderReviewsProfile(reviews);
  } catch (err) {
    console.error('Error loading profile:', err);
  } finally {
    const overlay = document.getElementById('vp-loading-overlay');
    if (overlay) overlay.classList.add('hidden');
  }
}"""

js = re.sub(r"\s*renderReviewsProfile\(reviews\);\s*\}\s*catch\s*\(err\)\s*\{\s*console\.error\('Error loading profile:',\s*err\);\s*\}\s*\}", replacer_end, js)

def replacer_mentoring(match):
    return """      try {
        const profilesSnap = await getDocs(collection(firestore, "user_profiles"));
        const profilesMap = {};
        profilesSnap.forEach(d => { profilesMap[d.id] = d.data(); });
        
        const revSnap = await getDocs(collection(firestore, "reviews"));
        const revMap = {};
        revSnap.forEach(d => {
          const data = d.data();
          if(!revMap[data.targetUserId]) revMap[data.targetUserId] = { sum: 0, count: 0 };
          revMap[data.targetUserId].sum += Number(data.rating) || 5;
          revMap[data.targetUserId].count++;
        });

        users.forEach(u => {
          u.bio = profilesMap[u.id]?.bio || '';
          u.skills = profilesMap[u.id]?.skills || [];
          u.rating = revMap[u.id] ? (revMap[u.id].sum / revMap[u.id].count).toFixed(1) : 'New';
        });
      } catch(e) {}"""
      
js = re.sub(r"      try\s*\{\s*const profilesSnap = await getDocs\(collection\(firestore, \"user_profiles\"\)\);[\s\S]*?u\.skills = profilesMap\[u\.id\]\?\.skills \|\| \[\];\s*\}\);\s*\} catch\(e\) \{\}", replacer_mentoring, js)

js = js.replace("document.getElementById('dialog-view-profile').showModal();", "")

def replacer_card(match):
    return """      card.innerHTML = `
        <div class="flex items-center gap-3 mb-3">
          <div class="avatar cursor-pointer" onclick="openViewProfileDialog('${u.id}')">${initials(u.fullName)}</div>
          <div class="flex-1">
            <div class="flex justify-between items-center">
              <h3 class="job-title cursor-pointer hover:underline" style="margin:0;" onclick="openViewProfileDialog('${u.id}')">${u.fullName}</h3>
              <span class="flex items-center gap-1 text-sm font-bold" style="color: var(--color-amber);">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                ${u.rating || 'New'}
              </span>
            </div>
          </div>
        </div>
        <p class="text-sm text-muted mb-2 line-clamp-2">${u.bio || 'No bio provided.'}</p>
        ${skillsHtml}
        <div class="flex justify-between items-center mt-auto" style="padding-top: 1rem; border-top: 1px solid var(--border-card);">
          <button type="button" class="btn btn-outline btn-sm view-profile-btn">View Profile</button>
          <button type="button" class="btn btn-purple btn-sm apply-mentor-btn">Apply</button>
        </div>
      `;"""

js = re.sub(r"      card\.innerHTML = `[\s\S]*?Apply for Mentoring</button>\s*</div>\s*`;", replacer_card, js)


with open('src/main.js', 'w', encoding='utf-8') as f:
    f.write(js)
print("done regex patch")
