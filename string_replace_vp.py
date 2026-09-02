import re

with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

# View Profile Dialog Updates

# Clear logic
js = js.replace(
    "['vp-app-pending','vp-app-completed','vp-app-terminated','vp-emp-pending','vp-emp-completed','vp-emp-terminated'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = '0'; });\n  \n  if (document.getElementById('vp-ratings-list')) document.getElementById('vp-ratings-list').innerHTML = '';\n  if (document.getElementById('vp-ratings-avg')) document.getElementById('vp-ratings-avg').textContent = '0.0';\n  if (document.getElementById('vp-ratings-count')) document.getElementById('vp-ratings-count').textContent = '';",
    "['vp-app-pending','vp-app-completed','vp-app-terminated','vp-emp-pending','vp-emp-completed','vp-emp-terminated'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = '0'; });\n  \n  if (document.getElementById('vp-ratings-list')) document.getElementById('vp-ratings-list').innerHTML = '';\n  if (document.getElementById('vp-ratings-avg')) document.getElementById('vp-ratings-avg').textContent = '0.0';\n  if (document.getElementById('vp-ratings-avg-stars')) document.getElementById('vp-ratings-avg-stars').textContent = '★★★★★';\n  if (document.getElementById('vp-ratings-count')) document.getElementById('vp-ratings-count').textContent = '0';\n  [1,2,3,4,5].forEach(r => { const pb = document.getElementById('vp-pb-' + r); if (pb) pb.style.width = '0%'; });"
)

# Fetch logic
old_vp_reviews = """let sum = 0;
    reviews.forEach(r => sum += r.rating);
    const avg = reviews.length > 0 ? (sum / reviews.length).toFixed(1) : '0.0';
    
    document.getElementById('vp-ratings-avg').textContent = avg;
    document.getElementById('vp-ratings-count').textContent = 'Based on ' + reviews.length + ' reviews';
    
    if (reviews.length === 0) {
      document.getElementById('vp-ratings-list').innerHTML = '<div class="empty-state text-center text-muted">No reviews yet.</div>';
    } else {
      document.getElementById('vp-ratings-list').innerHTML = reviews.map(r => {
        const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
        const name = r.reviewerName || (r.reviewer ? r.reviewer.fullName : 'Student');
        return '<div class="feedback-item mb-4 pb-4" style="border-bottom: 1px solid var(--border-card);"><div class="flex justify-between items-start"><strong style="color: var(--text-heading);">' + name + '</strong><span class="font-bold" style="color: var(--color-amber);">' + stars + '</span></div><p class="text-sm mt-2 text-muted">' + (r.comment || '') + '</p></div>';
      }).join('');
    }"""

new_vp_reviews = """if (reviews.length === 0) {
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

js = js.replace(old_vp_reviews, new_vp_reviews)

with open('src/main.js', 'w', encoding='utf-8') as f:
    f.write(js)
