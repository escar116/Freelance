with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

start = js.find('window.openViewProfileDialog = async function(userId)')
end = js.find('window.setupMentoringDialog = function()', start)
if end == -1:
    end = js.find('function setupMobileSidebar', start)

# completely rip it out
old_func = js[start:end]

new_func = '''window.openViewProfileDialog = async function(userId) {
  const dialog = document.getElementById('dialog-view-profile');
  const overlay = document.getElementById('vp-loading-overlay');
  
  if (dialog) dialog.showModal();
  if (overlay) overlay.classList.remove('hidden');

  try {
    const res = await getUserProfile(dc, { id: userId }, SERVER_ONLY);
    const user = res.data.user;
    if (!user) return;
    
    // workaround to fetch faculty reference
    try {
      const allRes = await listAllUsers(dc);
      const fullUser = allRes.data.users.find(u => u.id === userId);
      if (fullUser) {
        user.facultyReference = fullUser.facultyReference;
        user.preferredRole = fullUser.preferredRole;
      }
    } catch(e) {}
    
    document.getElementById('vp-avatar').textContent = initials(user.fullName);
    document.getElementById('vp-name').textContent = user.fullName;
    document.getElementById('vp-faculty').textContent = user.facultyReference || 'Not provided';
    document.getElementById('vp-student-id').textContent = user.studentId || 'N/A';

    // Set stats
    const apps = user.applications_on_applicant || [];
    document.getElementById('vp-app-pending').textContent = apps.filter(a => a.status === 'PENDING').length;
    document.getElementById('vp-app-completed').textContent = apps.filter(a => a.status === 'COMPLETED').length;
    document.getElementById('vp-app-terminated').textContent = apps.filter(a => a.status === 'TERMINATED').length;

    const reqs = user.helpRequests_on_requester || [];
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
            vpSkills.innerHTML = '<div class="text-sm text-muted">No skills listed</div>';
          }
        }
      } else {
        const vpBio = document.getElementById('vp-bio');
        if (vpBio) vpBio.textContent = 'No bio provided.';
        const vpSkills = document.getElementById('vp-skills');
        if (vpSkills) vpSkills.innerHTML = '<div class="text-sm text-muted">No skills listed</div>';
      }
    } catch (e) {
      console.error('Error fetching bio/skills', e);
    }

    const reviewsRes = await listUserReviews(dc, { targetUserId: userId }, SERVER_ONLY);
    const reviews = reviewsRes.data.reviews || [];
    renderReviewsProfile(reviews);
  } catch (err) {
    console.error('Error loading profile:', err);
  } finally {
    if (overlay) overlay.classList.add('hidden');
  }
}

function renderReviewsProfile(reviews) {
  if (!reviews || reviews.length === 0) {
    if (document.getElementById('ratings-avg-score')) document.getElementById('ratings-avg-score').textContent = '0.0';
    if (document.getElementById('ratings-total-count')) document.getElementById('ratings-total-count').textContent = 'Based on 0 reviews';
    if (document.getElementById('profile-feedback-list')) document.getElementById('profile-feedback-list').innerHTML = '<div class="empty-state text-center text-muted">No reviews yet.</div>';
    if (document.getElementById('ratings-feedback-list')) document.getElementById('ratings-feedback-list').innerHTML = '<div class="empty-state text-center text-muted">No reviews yet.</div>';
    return;
  }
  const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
  const avg = (sum / reviews.length).toFixed(1);

  if (document.getElementById('ratings-avg-score')) document.getElementById('ratings-avg-score').textContent = avg;
  if (document.getElementById('ratings-total-count')) document.getElementById('ratings-total-count').textContent = Based on  review;

  const html = reviews.map(r => {
    const name = r.reviewer?.fullName || 'Anonymous';
    let stars = '';
    const ratingNum = Number(r.rating) || 5;
    for(let i=0; i<5; i++) {
      stars += i < ratingNum ? '★' : '☆';
    }
    return '<div class="feedback-item mb-3 pb-3" style="border-bottom: 1px solid var(--border-card);"><div class="flex justify-between items-start"><strong class="text-sm" style="color: var(--text-heading);">' + name + '</strong><span class="text-xs" style="color: var(--color-amber);">' + stars + '</span></div><p class="text-xs mt-1 text-muted">' + (r.comment || '') + '</p></div>';
  }).join('');

  if (document.getElementById('profile-feedback-list')) document.getElementById('profile-feedback-list').innerHTML = html;
  if (document.getElementById('ratings-feedback-list')) document.getElementById('ratings-feedback-list').innerHTML = html;
}

'''

js = js[:start] + new_func + js[end:]
with open('src/main.js', 'w', encoding='utf-8') as f:
    f.write(js)
print("done")
