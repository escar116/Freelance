import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update Mentoring section layout
mentoring_old = '''<div class="search-filter-panel mb-6">
                        <div class="search-bar mb-4">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon">
                                  <circle cx="11" cy="11" r="8"></circle>
                                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                              </svg>
                            <input type="text" id="mentoring-search-input" class="search-input" placeholder="Search by name, role, or skills...">
                        </div>
                      </div>

                      <div class="grid-requests" id="mentoring-users-grid">
                      </div>'''

mentoring_new = '''<div class="search-filter-panel mb-4">
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
                          <div class="grid-requests" id="mentoring-users-grid" style="max-height: 55vh; overflow-y: auto; padding-right: 0.5rem; padding-bottom: 0.5rem;">
                          </div>
                      </div>'''
html = html.replace(mentoring_old, mentoring_new)

# 2. Update View Profile Layout
# Find the modal body of dialog-view-profile and flatten it.
# We will use regex to find <div class="modal-body pb-0"> up to </div> before <div class="modal-footer">
# Let's write a python function to replace class="glass-panel mb-4" with nothing or just remove the extra padding boxes.
# Wait, it's easier to just strip the extra <div class="glass-panel mb-4"> wrappers manually in python.
# Actually, I'll extract the block and do string manipulation.
vp_start = html.find('<dialog id="dialog-view-profile" class="modal">')
vp_end = html.find('</dialog>', vp_start)
vp_block = html[vp_start:vp_end]

# In vp_block, replace the sequence of glass-panels with a single glass-panel.
# I'll modify the first profile-card glass-panel to NOT be mb-4, but pb-4 with border-bottom.
# Wait, if I just replace <div class="glass-panel mb-4"> with <div class="mb-4"> and wrap the whole modal-body in ONE glass-panel?
# modal-content is already a glass-panel in styling essentially (it has background, blur, border, etc.)
# Yes! modal-content has ackground: var(--bg-modal); border: 1px solid var(--border-card); border-radius: 20px; box-shadow: ...
# The glass-panel inside it is redundant! The only reason they are there is because I styled them that way initially.
# So I can just remove class="glass-panel ..." and replace it with class="mb-6" or class="pb-4 border-b border-card".

# Let's replace <div class="glass-panel mb-4"> with <div class="mb-4"> in vp_block
vp_block = vp_block.replace('<div class="glass-panel mb-4">', '<div class="mb-4 pt-4" style="border-top: 1px solid var(--border-card);">')
# Remove glass-panel from profile-card
vp_block = vp_block.replace('<div class="profile-card glass-panel mb-4 text-center">', '<div class="profile-card mb-4 text-center">')

html = html[:vp_start] + vp_block + html[vp_end:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
