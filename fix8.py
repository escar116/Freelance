with open('src/main.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

fixed_sidebar = '''function setupMobileSidebar() {
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
  const closeMobileSidebar = (e) => {
    if(e) e.preventDefault();
    const sidebar = document.getElementById('sidebar');
    if(sidebar) sidebar.classList.remove('sidebar-open');
    const overlay = document.getElementById('sidebar-overlay');
    if(overlay) { overlay.style.display = 'none'; overlay.classList.add('hidden'); }
  };
  const overlay = document.getElementById('sidebar-overlay');
  if(overlay) overlay.addEventListener('click', closeMobileSidebar);
  const closeBtn = document.getElementById('sidebar-close-btn');
  if(closeBtn) closeBtn.addEventListener('click', closeMobileSidebar);
}'''

new_lines = lines[:1555] + [fixed_sidebar + '\n'] + lines[1558:]

with open('src/main.js', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
