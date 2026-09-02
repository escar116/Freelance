import re

with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Just update renderReviewsProfile the manual way
js = js.replace(
    "if (document.getElementById('ratings-avg-score')) document.getElementById('ratings-avg-score').textContent = avg.toFixed(1);\n  if (document.getElementById('ratings-total-count')) document.getElementById('ratings-total-count').textContent = 'Based on ' + reviews.length + ' reviews';",
    "if (document.getElementById('ratings-avg-score')) document.getElementById('ratings-avg-score').textContent = avg.toFixed(1);\n  if (document.getElementById('ratings-avg-stars')) document.getElementById('ratings-avg-stars').textContent = '★'.repeat(Math.round(avg)) + '☆'.repeat(5 - Math.round(avg));\n  if (document.getElementById('ratings-total-count')) document.getElementById('ratings-total-count').textContent = reviews.length.toLocaleString();"
)

js = js.replace(
    "const pc = document.getElementById('pc-' + r);\n    if (pc) pc.textContent = counts[r];",
    ""
)

js = js.replace(
    "const pc = document.getElementById('pc-' + r);\n      if (pc) pc.textContent = '0';",
    ""
)

js = js.replace(
    "if (document.getElementById('vp-ratings-avg')) document.getElementById('vp-ratings-avg').textContent = '0.0';",
    "if (document.getElementById('vp-ratings-avg')) document.getElementById('vp-ratings-avg').textContent = '0.0';\n    if (document.getElementById('vp-ratings-avg-stars')) document.getElementById('vp-ratings-avg-stars').textContent = '★★★★★';"
)
js = js.replace(
    "if (document.getElementById('ratings-total-count')) document.getElementById('ratings-total-count').textContent = 'Based on 0 reviews';",
    "if (document.getElementById('ratings-total-count')) document.getElementById('ratings-total-count').textContent = '0';"
)
js = js.replace(
    "if (document.getElementById('ratings-feedback-list')) document.getElementById('ratings-feedback-list').innerHTML = '<div class=\"empty-state text-center text-muted\">No reviews yet.</div>';",
    ""
)
js = js.replace(
    "if (document.getElementById('ratings-feedback-list')) document.getElementById('ratings-feedback-list').innerHTML = html;",
    ""
)

js = js.replace(
    "const stars = ''.repeat(r.rating) + ''.repeat(5 - r.rating);",
    "const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);"
)


with open('src/main.js', 'w', encoding='utf-8') as f:
    f.write(js)
