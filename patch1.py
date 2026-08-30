import re

with open('src/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = """      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const bioEl = document.getElementById('edit-bio');
        const bio = bioEl ? bioEl.value.trim() : '';
        
        const skills = Array.from(document.querySelectorAll('#edit-skills-grid input[type="checkbox"]:checked')).map(cb => cb.value);
        
        if (userData) {
          userData.bio = bio;
          userData.skills = skills;
        }
        
        const bioDisplay = document.getElementById('profile-bio-display');
        if (bioDisplay) bioDisplay.textContent = bio || 'No bio provided yet.';
        
        const skillsDisplay = document.getElementById('profile-skills-display');
        if (skillsDisplay) {
          if (skills.length === 0) {
            skillsDisplay.innerHTML = '<p class="text-muted text-sm">No skills added yet.</p>';
          } else {
            skillsDisplay.innerHTML = skills.map(s => `<span class="skill-pill" style="display:inline-block; margin:2px; background:var(--bg-card); color:var(--text-heading); border:1px solid var(--border-card); padding:4px 10px; border-radius:999px; font-size:12px;">${s}</span>`).join('');
          }
        }
        
        showToast('Profile updated (Local session only).');
        const dialog = document.getElementById('dialog-edit-profile');
        if (dialog) dialog.close();
      });"""

replacement = """      form.addEventListener('submit', async (e) => {
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
              skillsDisplay.innerHTML = skills.map(s => `<span class="skill-pill" style="display:inline-block; margin:2px; background:var(--bg-card); color:var(--text-heading); border:1px solid var(--border-card); padding:4px 10px; border-radius:999px; font-size:12px;">${s}</span>`).join('');
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
      });"""

content = content.replace(target, replacement)

with open('src/main.js', 'w', encoding='utf-8') as f:
    f.write(content)
