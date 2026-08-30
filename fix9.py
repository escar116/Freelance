import re

with open('src/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix 1: The comment syntax error
content = content.replace('comment: #review-comment.value.trim(),', "comment: document.getElementById('review-comment').value.trim(),")

# Fix 2: The missing setupMobileSidebar and missing renderReviewsProfile closing brace
bad_code = '''};
  #sidebar-overlay?.addEventListener('click', closeMobileSidebar);
  #sidebar-close-btn?.addEventListener('click', closeMobileSidebar);
}'''

good_code = '''};

function setupMobileSidebar() {
  const closeMobileSidebar = (e) => {
    if(e) e.preventDefault();
    const sidebar = document.getElementById('sidebar');
    if(sidebar) sidebar.classList.remove('sidebar-open');
    const overlay = document.getElementById('sidebar-overlay');
    if(overlay) { overlay.style.display = 'none'; overlay.classList.add('hidden'); }
  };

  const btn = document.getElementById('mobile-menu-btn');
  if(btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const sidebar = document.getElementById('sidebar');
      if(sidebar) sidebar.classList.add('sidebar-open');
      const overlay = document.getElementById('sidebar-overlay');
      if(overlay) { overlay.style.display = 'block'; overlay.classList.remove('hidden'); }
    });
  }

  const overlay = document.getElementById('sidebar-overlay');
  if(overlay) overlay.addEventListener('click', closeMobileSidebar);
  const closeBtn = document.getElementById('sidebar-close-btn');
  if(closeBtn) closeBtn.addEventListener('click', closeMobileSidebar);
}'''

content = content.replace(bad_code, good_code)

with open('src/main.js', 'w', encoding='utf-8') as f:
    f.write(content)
