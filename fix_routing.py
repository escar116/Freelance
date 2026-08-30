with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

# 1. Update activeSection initialization
old_init = "let activeSection = sessionStorage.getItem('active_section') || 'dashboard';"
new_init = """const VALID_SECTIONS = ['dashboard', 'services', 'mentoring', 'applications', 'messages', 'transactions', 'ratings', 'profile', 'admin'];
const initialPath = window.location.pathname.replace(/^\\/|\\/$/g, '');
let activeSection = VALID_SECTIONS.includes(initialPath) ? initialPath : (sessionStorage.getItem('active_section') || 'dashboard');
if (VALID_SECTIONS.includes(initialPath)) {
  sessionStorage.setItem('active_section', initialPath);
}"""
js = js.replace(old_init, new_init)

# 2. Update navigateTo
old_nav = """function navigateTo(section) {
  activeSection = section;
  sessionStorage.setItem('active_section', section);

  $$('.content-section').forEach(s => s.classList.add('hidden'));
  const target = $(`#section-${section}`);
  if (target) {
    target.classList.remove('hidden');
  }

  $$('.nav-btn[data-target]').forEach(b => {
    b.classList.toggle('active', b.dataset.target === section);
  });"""

new_nav = """function navigateTo(section, pushState = true) {
  activeSection = section;
  sessionStorage.setItem('active_section', section);

  $$('.content-section').forEach(s => s.classList.add('hidden'));
  const target = $(`#section-${section}`);
  if (target) {
    target.classList.remove('hidden');
  }

  $$('.nav-btn[data-target]').forEach(b => {
    b.classList.toggle('active', b.dataset.target === section);
  });

  if (pushState && window.location.pathname !== '/' + section) {
    history.pushState({ section }, '', '/' + section);
  }"""
js = js.replace(old_nav, new_nav)

# 3. Add popstate listener in DOMContentLoaded
old_dom = """document.addEventListener('DOMContentLoaded', () => {
  setupLanding();"""

new_dom = """document.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('popstate', (e) => {
    if (e.state && e.state.section) {
      navigateTo(e.state.section, false);
    } else {
      const path = window.location.pathname.replace(/^\\/|\\/$/g, '');
      if (VALID_SECTIONS.includes(path)) navigateTo(path, false);
      else navigateTo('dashboard', false);
    }
  });

  setupLanding();"""
js = js.replace(old_dom, new_dom)

# 4. In setupLogout, reset the URL
old_logout = """    sessionStorage.removeItem('active_section');
    await signOut(auth);"""

new_logout = """    sessionStorage.removeItem('active_section');
    history.pushState(null, '', '/');
    await signOut(auth);"""
js = js.replace(old_logout, new_logout)

with open('src/main.js', 'w', encoding='utf-8') as f:
    f.write(js)
print("Routing changes applied")
