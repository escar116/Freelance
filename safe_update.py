import re

with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Replace renderReviewsProfile
def repl_render(m):
    return """function renderReviewsProfile(reviews) {
  if (!reviews || reviews.length === 0) {
    if (document.getElementById('ratings-avg-score')) document.getElementById('ratings-avg-score').textContent = '0.0';
    if (document.getElementById('ratings-avg-stars')) document.getElementById('ratings-avg-stars').textContent = '★★★★★';
    if (document.getElementById('ratings-total-count')) document.getElementById('ratings-total-count').textContent = '0';
    if (document.getElementById('profile-feedback-list')) document.getElementById('profile-feedback-list').innerHTML = '<div class="empty-state text-center text-muted">No reviews yet.</div>';
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
    return '<div class="feedback-item mb-4 pb-4" style="border-bottom: 1px solid var(--border-card);"><div class="flex justify-between items-start"><strong style="color: var(--text-heading);">' + name + '</strong><span class="font-bold" style="color: var(--color-amber);">' + stars + '</span></div><p class="text-sm mt-2 text-muted">' + (r.comment || '') + '</p></div>';
  }).join('');
  
  if (document.getElementById('profile-feedback-list')) document.getElementById('profile-feedback-list').innerHTML = html;
}"""

js = re.sub(r'function renderReviewsProfile\(reviews\)\s*\{.*?^\}', repl_render, js, flags=re.DOTALL|re.MULTILINE)

# Fix openViewProfileDialog clearing logic
js = js.replace(
    "if (document.getElementById('profile-feedback-list')) document.getElementById('profile-feedback-list').innerHTML = '';\n  if (document.getElementById('ratings-feedback-list')) document.getElementById('ratings-feedback-list').innerHTML = '';\n  if (document.getElementById('ratings-avg-score')) document.getElementById('ratings-avg-score').textContent = '0.0';\n  if (document.getElementById('ratings-total-count')) document.getElementById('ratings-total-count').textContent = '';",
    "if (document.getElementById('vp-ratings-list')) document.getElementById('vp-ratings-list').innerHTML = '';\n  if (document.getElementById('vp-ratings-avg')) document.getElementById('vp-ratings-avg').textContent = '0.0';\n  if (document.getElementById('vp-ratings-avg-stars')) document.getElementById('vp-ratings-avg-stars').textContent = '★★★★★';\n  if (document.getElementById('vp-ratings-count')) document.getElementById('vp-ratings-count').textContent = '0';\n  [1,2,3,4,5].forEach(r => { const pb = document.getElementById('vp-pb-' + r); if (pb) pb.style.width = '0%'; });"
)

# Update fetch reviews logic in openViewProfileDialog
def repl_fetch(m):
    return """// Fetch reviews from Firestore
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
      document.getElementById('vp-ratings-list').innerHTML = '<div class="empty-state text-center text-muted">No reviews yet.</div>';
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
        return '<div class="feedback-item mb-3 pb-3" style="border-bottom: 1px solid var(--border-card);"><div class="flex justify-between items-start"><strong class="text-sm" style="color: var(--text-heading);">' + name + '</strong><span class="text-xs" style="color: var(--color-amber);">' + stars + '</span></div><p class="text-xs mt-1 text-muted">' + (r.comment || '') + '</p></div>';
      }).join('');
    }"""

js = re.sub(r'// Fetch reviews from Firestore.*?vp-ratings-list.*?\}', repl_fetch, js, flags=re.DOTALL)

with open('src/main.js', 'w', encoding='utf-8') as f:
    f.write(js)
print("Updated src/main.js successfully")
