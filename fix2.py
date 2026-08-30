import re

with open('src/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

new_open_vp = '''window.openViewProfileDialog = async function(userId) {
  try {
    const res = await getUserProfile(dc, { id: userId }, SERVER_ONLY);
    const user = res.data.user;
    if (!user) return;
    
    document.getElementById('vp-avatar').textContent = initials(user.fullName);
    document.getElementById('vp-name').textContent = user.fullName;
    document.getElementById('vp-program').textContent = user.facultyReference || 'Student';
    document.getElementById('vp-faculty').textContent = user.facultyReference || 'Not provided';
    document.getElementById('vp-student-id').textContent = user.studentId || '?';

    // Set stats
    const apps = user.applications_on_applicant || [];
    document.getElementById('vp-app-pending').textContent = apps.filter(a => a.status === 'PENDING').length;
    document.getElementById('vp-app-completed').textContent = apps.filter(a => a.status === 'COMPLETED').length;
    document.getElementById('vp-app-terminated').textContent = apps.filter(a => a.status === 'TERMINATED').length;

    const reqs = user.helpRequests_on_requester || [];
    document.getElementById('vp-emp-pending').textContent = reqs.filter(r => r.status === 'OPEN').length;
    document.getElementById('vp-emp-completed').textContent = reqs.filter(r => r.status === 'COMPLETED').length;
    document.getElementById('vp-emp-terminated').textContent = reqs.filter(r => r.status === 'TERMINATED').length;
    
    // Fetch reviews from Firestore
    const reviewsSnap = await getDocs(query(collection(firestore, "reviews"), where("targetUserId", "==", userId)));
    const reviews = reviewsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    
    let sum = 0;
    reviews.forEach(r => sum += r.rating);
    const avg = reviews.length > 0 ? (sum / reviews.length).toFixed(1) : '0.0';
    
    document.getElementById('vp-ratings-avg').textContent = avg;
    document.getElementById('vp-ratings-count').textContent = 'Based on ' + reviews.length + ' reviews';
    
    if (reviews.length === 0) {
      document.getElementById('vp-ratings-list').innerHTML = '<div class="empty-state text-center text-muted">No reviews yet.</div>';
    } else {
      document.getElementById('vp-ratings-list').innerHTML = reviews.map(r => {
        const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
        const name = r.reviewerName || (r.reviewer ? r.reviewer.fullName : 'Anonymous');
        return '<div class="feedback-item mb-3 pb-3" style="border-bottom: 1px solid var(--border-card);"><div class="flex justify-between items-start"><strong class="text-sm" style="color: var(--text-heading);">' + name + '</strong><span class="text-xs" style="color: var(--color-amber);">' + stars + '</span></div><p class="text-xs mt-1 text-muted">' + (r.comment || '') + '</p></div>';
      }).join('');
    }
    
    document.getElementById('dialog-view-profile').showModal();
  } catch (err) {
    console.error('Profile Dialog Error:', err);
    showToast('Failed to load profile', 'error');
  }
};'''

content = re.sub(r'window\.openViewProfileDialog\s*=\s*async\s*function\(userId\)\s*\{.*?\n  \};', new_open_vp, content, flags=re.DOTALL)

with open('src/main.js', 'w', encoding='utf-8') as f:
    f.write(content)
