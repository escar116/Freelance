import re

with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

# 1. loadMentoring fix
old_mentoring_load = '''      try {
        const profilesSnap = await getDocs(collection(firestore, "user_profiles"));
        const profilesMap = {};
        profilesSnap.forEach(d => { profilesMap[d.id] = d.data(); });
        users.forEach(u => {
          u.bio = profilesMap[u.id]?.bio || '';
          u.skills = profilesMap[u.id]?.skills || [];
        });
      } catch(e) {}'''

new_mentoring_load = '''      try {
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
      } catch(e) {}'''

js = js.replace(old_mentoring_load, new_mentoring_load)

# 2. renderMentoringGrid fix
old_card = '''      card.innerHTML = 
        <div class="flex items-center gap-3 mb-3">
          <div class="avatar cursor-pointer" onclick="openViewProfileDialog('')"></div>
          <div>
            <h3 class="job-title cursor-pointer hover:underline" style="margin:0;" onclick="openViewProfileDialog('')"></h3>
            <p class="text-sm text-muted"></p>
          </div>
        </div>
        <p class="text-sm text-muted mb-2 line-clamp-2"></p>
        
        <div class="flex justify-between items-center mt-auto" style="padding-top: 1rem; border-top: 1px solid var(--border-card);">
          <button type="button" class="btn btn-outline btn-sm view-profile-btn">View Profile</button>
          <button type="button" class="btn btn-purple btn-sm apply-mentor-btn">Apply for Mentoring</button>
        </div>
      ;'''

new_card = '''      card.innerHTML = 
        <div class="flex items-center gap-3 mb-3">
          <div class="avatar cursor-pointer" onclick="openViewProfileDialog('')"></div>
          <div class="flex-1">
            <div class="flex justify-between items-center">
              <h3 class="job-title cursor-pointer hover:underline" style="margin:0;" onclick="openViewProfileDialog('')"></h3>
              <span class="flex items-center gap-1 text-sm font-bold" style="color: var(--color-amber);">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                
              </span>
            </div>
          </div>
        </div>
        <p class="text-sm text-muted mb-2 line-clamp-2"></p>
        
        <div class="flex justify-between items-center mt-auto" style="padding-top: 1rem; border-top: 1px solid var(--border-card);">
          <button type="button" class="btn btn-outline btn-sm view-profile-btn">View Profile</button>
          <button type="button" class="btn btn-purple btn-sm apply-mentor-btn">Apply</button>
        </div>
      ;'''

js = js.replace(old_card, new_card)

# 3. openViewProfileDialog fixes
# Add loading overlay and faculty fetching properly
old_view_start = '''window.openViewProfileDialog = async function(userId) {
  try {
    const res = await getUserProfile(dc, { id: userId }, SERVER_ONLY);
    const user = res.data.user;
    if (!user) return;'''

new_view_start = '''window.openViewProfileDialog = async function(userId) {
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
        user.preferredRole = fullUser.preferredRole;
      }
    } catch(e) {}'''

js = js.replace(old_view_start, new_view_start)

# Add finally block to openViewProfileDialog
# It ends with:
#     console.error('Error loading profile:', err);
#   }
# }
# Wait, let's target the end of openViewProfileDialog explicitly
old_view_end = '''    renderReviewsProfile(reviews);
  } catch (err) {
    console.error('Error loading profile:', err);
  }
}'''

new_view_end = '''    renderReviewsProfile(reviews);
  } catch (err) {
    console.error('Error loading profile:', err);
  } finally {
    const overlay = document.getElementById('vp-loading-overlay');
    if (overlay) overlay.classList.add('hidden');
  }
}'''

js = js.replace(old_view_end, new_view_end)

# Remove document.getElementById('dialog-view-profile').showModal(); which was at the bottom of the try block
js = js.replace("document.getElementById('dialog-view-profile').showModal();", "")

# Remove p-program setting because the HTML element was removed
js = re.sub(r"document\.getElementById\('vp-program'\)\.textContent = [^;]+;", "", js)


with open('src/main.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Restored and patched main.js safely.")
