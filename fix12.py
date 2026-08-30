import re

with open('src/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

edit_profile = '''function setupEditProfile() {
  const btnEditProfile = document.getElementById('btn-edit-profile');
  if (btnEditProfile) {
    btnEditProfile.addEventListener('click', () => {
      const bioEl = document.getElementById('edit-bio');
      if (bioEl) bioEl.value = userData?.bio || '';
      
      const userSkills = userData?.skills || [];
      document.querySelectorAll('#edit-skills-grid input[type="checkbox"]').forEach(cb => {
        cb.checked = userSkills.includes(cb.value);
      });
      
      const searchEl = document.getElementById('edit-skills-search');
      if (searchEl) searchEl.value = '';
      
      document.querySelectorAll('#edit-skills-grid .skill-pill').forEach(pill => {
        pill.style.display = 'inline-flex';
      });
      
      const dialog = document.getElementById('dialog-edit-profile');
      if (dialog) dialog.showModal();
    });
  }

  const searchInput = document.getElementById('edit-skills-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      document.querySelectorAll('#edit-skills-grid .skill-pill').forEach(pill => {
        const text = pill.textContent.toLowerCase();
        pill.style.display = text.includes(q) ? 'inline-flex' : 'none';
      });
    });
  }

  const form = document.getElementById('edit-profile-form');
  if (form) {
    form.addEventListener('submit', (e) => {
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
          skillsDisplay.innerHTML = skills.map(s => \<span class="skill-pill" style="display:inline-block; margin:2px; background:var(--bg-card); color:var(--text-heading); border:1px solid var(--border-card); padding:4px 10px; border-radius:999px; font-size:12px;">\</span>\).join('');
        }
      }
      
      showToast('Profile updated (Local session only).');
      const dialog = document.getElementById('dialog-edit-profile');
      if (dialog) dialog.close();
    });
  }
}
'''

content = content.replace('function setupMobileSidebar() {', edit_profile + '\\nfunction setupMobileSidebar() {')

with open('src/main.js', 'w', encoding='utf-8') as f:
    f.write(content)
