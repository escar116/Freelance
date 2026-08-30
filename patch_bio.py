import re

with open('src/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update imports
content = content.replace(
"import { getFirestore, collection, addDoc, getDocs, query, where, serverTimestamp as firestoreTimestamp } from 'firebase/firestore';",
"import { getFirestore, collection, addDoc, getDocs, query, where, serverTimestamp as firestoreTimestamp, setDoc, doc, getDoc } from 'firebase/firestore';"
)

# 2. Update setupEditProfile to save to Firestore
save_logic = '''
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const bioEl = document.getElementById('edit-bio');
        const bio = bioEl ? bioEl.value.trim() : '';
        
        const skills = Array.from(document.querySelectorAll('#edit-skills-grid input[type="checkbox"]:checked')).map(cb => cb.value);
        
        const btn = form.querySelector('button[type="submit"]');
        if (btn) { btn.disabled = true; btn.textContent = 'Saving...'; }
        
        try {
          if (userData) {
            userData.bio = bio;
            userData.skills = skills;
            
            // Save to Firestore permanently
            await setDoc(doc(firestore, "user_profiles", userData.id), {
              bio: bio,
              skills: skills
            }, { merge: true });
          }
          
          const bioDisplay = document.getElementById('profile-bio-display');
          if (bioDisplay) bioDisplay.textContent = bio || 'No bio provided yet.';
          
          const skillsDisplay = document.getElementById('profile-skills-display');
          if (skillsDisplay) {
            if (skills.length === 0) {
              skillsDisplay.innerHTML = '<p class="text-muted text-sm">No skills added yet.</p>';
            } else {
              skillsDisplay.innerHTML = '<div class="flex flex-wrap gap-2">' + 
                skills.map(s => <span class="badge" style="background: rgba(255,255,255,0.05);"></span>).join('') +
                '</div>';
            }
          }
          
          showToast('Profile successfully updated!');
          const dialog = document.getElementById('dialog-edit-profile');
          if (dialog) dialog.close();
        } catch (err) {
          console.error(err);
          showToast('Failed to save profile.', 'error');
        } finally {
          if (btn) { btn.disabled = false; btn.textContent = 'Save Changes'; }
        }
      });
'''

# Find the form.addEventListener('submit', ...) block and replace it
import re
pattern = re.compile(r"form\.addEventListener\('submit', \(e\) => \{.*?(?:showToast\('Profile updated \(Local session only\)\.'\);|if \(dialog\) dialog\.close\(\);\s*\});).*?\}\);", re.DOTALL)
content = pattern.sub(save_logic.strip(), content)

# 3. Load user_profiles globally in loadProfile
load_profile_logic = '''
    const reqs = userProfile.helpRequests_on_requester || [];
    #stat-emp-pending.textContent = reqs.filter(r => r.status === 'OPEN').length;
    #stat-emp-completed.textContent = reqs.filter(r => r.status === 'COMPLETED').length;
    #stat-emp-terminated.textContent = reqs.filter(r => r.status === 'TERMINATED').length;

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
          skillsDisplay.innerHTML = '<div class="flex flex-wrap gap-2">' + 
            userData.skills.map(s => <span class="badge" style="background: rgba(255,255,255,0.05);"></span>).join('') +
            '</div>';
        }
      }
    } catch(e) {
      console.error('Failed to fetch user_profile', e);
    }
'''
content = content.replace('''    const reqs = userProfile.helpRequests_on_requester || [];
    #stat-emp-pending.textContent = reqs.filter(r => r.status === 'OPEN').length;
    #stat-emp-completed.textContent = reqs.filter(r => r.status === 'COMPLETED').length;
    #stat-emp-terminated.textContent = reqs.filter(r => r.status === 'TERMINATED').length;''', load_profile_logic)


# 4. In listAllUsers for Mentoring Grid, we need to load user_profiles for all users
mentoring_grid_logic = '''
  async function loadMentoring() {
    const grid = document.getElementById('mentoring-users-grid');
    if (grid.children.length === 0 || grid.querySelector('.loader')) {
      grid.innerHTML = '<div class="loader"></div>';
    }
    
    try {
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
      renderMentoringGrid(users);
    } catch(e) {
      console.error(e);
      grid.innerHTML = '<div class="empty-state">Error loading users.</div>';
    }
  }
'''
pattern2 = re.compile(r"async function loadMentoring\(\) \{.*?\}\n  \}", re.DOTALL)
content = pattern2.sub(mentoring_grid_logic.strip(), content)

# 5. In openViewProfileDialog, we need to fetch user_profile for the target user
open_profile_logic = '''
    document.getElementById('vp-emp-pending').textContent = reqs.filter(r => r.status === 'OPEN').length;
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
            vpSkills.innerHTML = '<div class="flex flex-wrap gap-2">' + data.skills.map(s => <span class="badge" style="background: rgba(255,255,255,0.05);"></span>).join('') + '</div>';
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
    }
'''
content = content.replace('''    document.getElementById('vp-emp-pending').textContent = reqs.filter(r => r.status === 'OPEN').length;
    document.getElementById('vp-emp-completed').textContent = reqs.filter(r => r.status === 'COMPLETED').length;
    document.getElementById('vp-emp-terminated').textContent = reqs.filter(r => r.status === 'TERMINATED').length;''', open_profile_logic)


with open('src/main.js', 'w', encoding='utf-8') as f:
    f.write(content)
