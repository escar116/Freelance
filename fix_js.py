with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Fix openViewProfileDialog clearing logic
js = js.replace(
    "if (document.getElementById('profile-feedback-list')) document.getElementById('profile-feedback-list').innerHTML = '';",
    ""
)
js = js.replace(
    "if (document.getElementById('ratings-feedback-list')) document.getElementById('ratings-feedback-list').innerHTML = '';",
    "if (document.getElementById('vp-ratings-list')) document.getElementById('vp-ratings-list').innerHTML = '';"
)
js = js.replace(
    "if (document.getElementById('ratings-avg-score')) document.getElementById('ratings-avg-score').textContent = '0.0';",
    "if (document.getElementById('vp-ratings-avg')) document.getElementById('vp-ratings-avg').textContent = '0.0';"
)
js = js.replace(
    "if (document.getElementById('ratings-total-count')) document.getElementById('ratings-total-count').textContent = '';",
    "if (document.getElementById('vp-ratings-count')) document.getElementById('vp-ratings-count').textContent = '';"
)

# Also fix `profile-bio-display` issue by letting HTML match JS or JS match HTML.
# JS has: `document.getElementById('profile-bio-display')` but HTML has `profile-bio`. Let's just fix HTML below.

with open('src/main.js', 'w', encoding='utf-8') as f:
    f.write(js)
