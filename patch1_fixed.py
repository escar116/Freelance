import re

with open('src/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the edit-profile-form submit handler
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

# The regex will match from form.addEventListener('submit', (e) => { up to showToast('Profile updated (Local session only).'); ... });
pattern = re.compile(r"form\.addEventListener\('submit', \(e\) => \{.*showToast\('Profile updated \(Local session only\)\.'\);\s*const dialog = document\.getElementById\('dialog-edit-profile'\);\s*if \(dialog\) dialog\.close\(\);\s*\}\);", re.DOTALL)

content, num_subs = pattern.subn(replacement, content)
print(f"Replaced form submit: {num_subs}")

with open('src/main.js', 'w', encoding='utf-8') as f:
    f.write(content)
