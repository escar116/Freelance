import re
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Mentoring HTML replace
old_mentoring = '''<div class="search-filter-panel mb-6">
                        <div class="search-bar mb-4">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon">
                                  <circle cx="11" cy="11" r="8"></circle>
                                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                              </svg>
                            <input type="text" id="mentoring-search-input" class="search-input" placeholder="Search by name, role, or skills...">
                        </div>
                    </div>
                    <div class="jobs-grid" id="mentoring-users-grid">
                        <div class="loader"></div>
                    </div>'''

new_mentoring = '''<div class="search-filter-panel mb-4">
                        <div class="search-bar">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon">
                                  <circle cx="11" cy="11" r="8"></circle>
                                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                              </svg>
                            <input type="text" id="mentoring-search-input" class="search-input" placeholder="Search by name, or skills...">
                        </div>
                    </div>
                    <div class="glass-panel" style="padding: 1.5rem;">
                        <h2 class="text-xl font-bold mb-4" style="color: var(--text-heading);">Available Mentors</h2>
                        <div class="jobs-grid" id="mentoring-users-grid" style="max-height: 55vh; overflow-y: auto; padding-right: 0.5rem; padding-bottom: 0.5rem;">
                            <div class="loader"></div>
                        </div>
                    </div>'''

html, n = re.subn(re.escape(old_mentoring).replace(r'\ ', r'\s*').replace(r'\n', r'\s*'), new_mentoring, html)
print("Mentoring HTML replaced:", n)
if n == 0:
    # try manual replacement with simpler targets
    pass

# Status color for "Pending: 0"
# They want the entire line colored. 
# Current HTML for stats:
# <div><span class="font-bold">Pending:</span> <span style="color: var(--status-pending); font-weight: bold;" id="vp-app-pending">0</span></div>
old_stats = '''<div><span class="font-bold">Pending:</span> <span style="color: var(--status-pending); font-weight: bold;" id="vp-app-pending">0</span></div>
                                <div><span class="font-bold">Completed:</span> <span style="color: var(--status-completed); font-weight: bold;" id="vp-app-completed">0</span></div>
                                <div><span class="font-bold">Terminated:</span> <span style="color: var(--status-terminated); font-weight: bold;" id="vp-app-terminated">0</span></div>'''
new_stats = '''<div style="color: var(--status-pending);"><span class="font-bold">Pending:</span> <span class="font-bold" id="vp-app-pending">0</span></div>
                                <div style="color: var(--status-completed);"><span class="font-bold">Completed:</span> <span class="font-bold" id="vp-app-completed">0</span></div>
                                <div style="color: var(--status-terminated);"><span class="font-bold">Terminated:</span> <span class="font-bold" id="vp-app-terminated">0</span></div>'''
html = html.replace(old_stats, new_stats)

# do the same for vp-emp
old_stats2 = '''<div><span class="font-bold">Pending:</span> <span style="color: var(--status-pending); font-weight: bold;" id="vp-emp-pending">0</span></div>
                                <div><span class="font-bold">Completed:</span> <span style="color: var(--status-completed); font-weight: bold;" id="vp-emp-completed">0</span></div>
                                <div><span class="font-bold">Terminated:</span> <span style="color: var(--status-terminated); font-weight: bold;" id="vp-emp-terminated">0</span></div>'''
new_stats2 = '''<div style="color: var(--status-pending);"><span class="font-bold">Pending:</span> <span class="font-bold" id="vp-emp-pending">0</span></div>
                                <div style="color: var(--status-completed);"><span class="font-bold">Completed:</span> <span class="font-bold" id="vp-emp-completed">0</span></div>
                                <div style="color: var(--status-terminated);"><span class="font-bold">Terminated:</span> <span class="font-bold" id="vp-emp-terminated">0</span></div>'''
html = html.replace(old_stats2, new_stats2)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
