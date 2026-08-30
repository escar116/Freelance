import re

with open('src/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

missing_part = '''  let sum = 0;
  const counts = {1:0, 2:0, 3:0, 4:0, 5:0};
  reviews.forEach(r => { sum += r.rating; counts[r.rating] = (counts[r.rating] || 0) + 1; });
  const avg = sum / reviews.length;
  if (document.getElementById('ratings-avg-score')) document.getElementById('ratings-avg-score').textContent = avg.toFixed(1);
  if (document.getElementById('ratings-total-count')) document.getElementById('ratings-total-count').textContent = 'Based on ' + reviews.length + ' reviews';
  
  [1,2,3,4,5].forEach(r => {
    const pb = document.getElementById('pb-' + r);
    if (pb) pb.style.width = ((counts[r] / reviews.length) * 100) + '%';
    const pc = document.getElementById('pc-' + r);
    if (pc) pc.textContent = counts[r];
  });
  
  const html = reviews.map(r => {
    const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
    const name = r.reviewerName || (r.reviewer ? r.reviewer.fullName : 'Anonymous');
    return '<div class="feedback-item mb-4 pb-4" style="border-bottom: 1px solid var(--border-card);"><div class="flex justify-between items-start"><strong style="color: var(--text-heading);">' + name + '</strong><span class="font-bold" style="color: var(--color-amber);">' + stars + '</span></div><p class="text-sm mt-2 text-muted">' + (r.comment || '') + '</p></div>';
  }).join('');
  
  if (document.getElementById('profile-feedback-list')) document.getElementById('profile-feedback-list').innerHTML = html;
  if (document.getElementById('ratings-feedback-list')) document.getElementById('ratings-feedback-list').innerHTML = html;
}

'''

content = re.sub(r'window\.openViewProfileDialog = async function\(userId\) \{', missing_part + 'window.openViewProfileDialog = async function(userId) {', content)

with open('src/main.js', 'w', encoding='utf-8') as f:
    f.write(content)
