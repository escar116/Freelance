with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace mentoring wrapper
s1 = html.find('<div class="search-filter-panel mb-6">')
s2 = html.find('id="mentoring-users-grid"', s1)
s3 = html.find('</div>', s2)
s3 = html.find('</div>', s3 + 1)
# we are replacing everything from s1 to s3 + 6
old_html = html[s1:s3+6]

new_html = '''<div class="search-filter-panel mb-4">
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

if 'mb-6' in old_html and 'mentoring-users-grid' in old_html:
    html = html[:s1] + new_html + html[s3+6:]
    print("Mentoring replaced successfully")
else:
    print("Mentoring replace failed")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
