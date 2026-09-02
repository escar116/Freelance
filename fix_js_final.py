import re

with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

# 1. Completely rewrite renderReviewsProfile
start1 = js.find('function renderReviewsProfile(reviews) {')
end1 = js.find('window.openViewProfileDialog = async function(userId)')

new_render = """function renderReviewsProfile(reviews) {
  if (!reviews || reviews.length === 0) {
    if (document.getElementById('ratings-avg-score')) document.getElementById('ratings-avg-score').textContent = '0.0';
    if (document.getElementById('ratings-avg-stars')) document.getElementById('ratings-avg-stars').textContent = '★★★★★';
    if (document.getElementById('ratings-total-count')) document.getElementById('ratings-total-count').textContent = '0';
    if (document.getElementById('profile-feedback-list')) document.getElementById('profile-feedback-list').innerHTML = '<div class="empty-state text-center text-muted" style="padding: 2rem 0;">No reviews yet.</div>';
    [1,2,3,4,5].forEach(r => {
      const pb = document.getElementById('pb-' + r);
      if (pb) pb.style.width = '0%';
    });
    return;
  }
  
  let sum = 0;
  const counts = {1:0, 2:0, 3:0, 4:0, 5:0};
  reviews.forEach(r => { sum += r.rating; counts[r.rating] = (counts[r.rating] || 0) + 1; });
  const avg = sum / reviews.length;
  
  if (document.getElementById('ratings-avg-score')) document.getElementById('ratings-avg-score').textContent = avg.toFixed(1);
  if (document.getElementById('ratings-avg-stars')) document.getElementById('ratings-avg-stars').textContent = '★'.repeat(Math.round(avg)) + '☆'.repeat(5 - Math.round(avg));
  if (document.getElementById('ratings-total-count')) document.getElementById('ratings-total-count').textContent = reviews.length.toLocaleString();
  
  [1,2,3,4,5].forEach(r => {
    const pb = document.getElementById('pb-' + r);
    if (pb) pb.style.width = ((counts[r] / reviews.length) * 100) + '%';
  });
  
  const html = reviews.map(r => {
    const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
    const name = r.reviewerName || (r.reviewer ? r.reviewer.fullName : 'Student');
    const initial = name.charAt(0).toUpperCase();
    const dateStr = r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Just now';
    return `
    <div class="feedback-item mb-4 pb-4" style="border-bottom: 1px solid var(--border-card);">
        <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background-color: var(--color-primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 12px; flex-shrink: 0;">${initial}</div>
            <strong style="color: var(--text-heading); font-size: 0.95rem;">${name}</strong>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <span style="color: #1a73e8; font-size: 0.85rem; letter-spacing: 1px;">${stars}</span>
            <span class="text-xs text-muted">${dateStr}</span>
        </div>
        <p class="text-sm" style="color: var(--text-heading); line-height: 1.5; margin: 0;">${r.comment || ''}</p>
    </div>`;
  }).join('');
  
  if (document.getElementById('profile-feedback-list')) document.getElementById('profile-feedback-list').innerHTML = html;
}
  
"""

js = js[:start1] + new_render + js[end1:]

# 2. Fix View Profile fetch block
start2 = js.find('// Fetch reviews from Firestore')
end2 = js.find('} catch (err) {\n    console.error(\'Profile Dialog Error:', start2)

new_fetch = """// Fetch reviews from Firestore
    const reviewsSnap = await getDocs(query(collection(firestore, "reviews"), where("targetUserId", "==", userId)));
    const reviews = reviewsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    
    for (let r of reviews) {
      if (!r.reviewerName && r.reviewerId) {
        try {
          const res = await getUserProfile(dc, { id: r.reviewerId });
          if (res.data.user) r.reviewerName = res.data.user.fullName;
        } catch(e) {}
      }
    }
    
    if (reviews.length === 0) {
      document.getElementById('vp-ratings-avg').textContent = '0.0';
      document.getElementById('vp-ratings-avg-stars').textContent = '★★★★★';
      document.getElementById('vp-ratings-count').textContent = '0';
      document.getElementById('vp-ratings-list').innerHTML = '<div class="empty-state text-center text-muted" style="padding: 2rem 0;">No reviews yet.</div>';
      [1,2,3,4,5].forEach(r => { const pb = document.getElementById('vp-pb-' + r); if (pb) pb.style.width = '0%'; });
    } else {
      let sum = 0;
      const counts = {1:0, 2:0, 3:0, 4:0, 5:0};
      reviews.forEach(r => { sum += r.rating; counts[r.rating] = (counts[r.rating] || 0) + 1; });
      const avg = sum / reviews.length;
      
      document.getElementById('vp-ratings-avg').textContent = avg.toFixed(1);
      document.getElementById('vp-ratings-avg-stars').textContent = '★'.repeat(Math.round(avg)) + '☆'.repeat(5 - Math.round(avg));
      document.getElementById('vp-ratings-count').textContent = reviews.length.toLocaleString();
      
      [1,2,3,4,5].forEach(r => {
        const pb = document.getElementById('vp-pb-' + r);
        if (pb) pb.style.width = ((counts[r] / reviews.length) * 100) + '%';
      });
      
      document.getElementById('vp-ratings-list').innerHTML = reviews.map(r => {
        const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
        const name = r.reviewerName || (r.reviewer ? r.reviewer.fullName : 'Student');
        const initial = name.charAt(0).toUpperCase();
        const dateStr = r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Just now';
        return `
        <div class="feedback-item mb-4 pb-4" style="border-bottom: 1px solid var(--border-card);">
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <div style="width: 32px; height: 32px; border-radius: 50%; background-color: var(--color-primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 12px; flex-shrink: 0;">${initial}</div>
                <strong style="color: var(--text-heading); font-size: 0.95rem;">${name}</strong>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <span style="color: #1a73e8; font-size: 0.85rem; letter-spacing: 1px;">${stars}</span>
                <span class="text-xs text-muted">${dateStr}</span>
            </div>
            <p class="text-sm" style="color: var(--text-heading); line-height: 1.5; margin: 0;">${r.comment || ''}</p>
        </div>`;
      }).join('');
    }
    
  """

js = js[:start2] + new_fetch + js[end2:]

with open('src/main.js', 'w', encoding='utf-8') as f:
    f.write(js)
