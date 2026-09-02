import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Fix progress bar empty backgrounds:
html = html.replace('background: var(--border-light); height: 8px; border-radius: 4px;', 'background: #e8eaed; height: 10px; border-radius: 10px;')
# Fix progress bar filled backgrounds:
html = html.replace('background: var(--color-purple); width: 0%; height: 100%; border-radius: 4px;', 'background: #1a73e8; width: 0%; height: 100%; border-radius: 10px;')
# Fix big stars color
html = html.replace('color: var(--color-amber); font-size: 1.25rem; margin-top: 0.25rem;" id="ratings-avg-stars"', 'color: #1a73e8; font-size: 1.25rem; letter-spacing: 2px; margin-top: 0.25rem;" id="ratings-avg-stars"')
html = html.replace('color: var(--color-amber); font-size: 1.25rem; margin-top: 0.25rem;" id="vp-ratings-avg-stars"', 'color: #1a73e8; font-size: 1.25rem; letter-spacing: 2px; margin-top: 0.25rem;" id="vp-ratings-avg-stars"')

# Ensure the search bar is properly moved inside page-header-flex
# Let's completely rebuild the mentoring header to ensure it's aligned exactly as intended.
m_mentoring = re.search(r'<div class="page-header-flex".*?<h1 class="page-title">Mentoring Hub</h1>.*?</div>.*?<div class="search-filter-panel mb-4"[^>]*>.*?</div>\s*</div>', html, re.DOTALL)
if m_mentoring:
    old_html = m_mentoring.group(0)
    new_html = """<div class="page-header-flex" style="align-items: center; justify-content: space-between; display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
                          <div>
                              <h1 class="page-title" style="margin-bottom: 0.25rem;">Mentoring Hub</h1>
                              <p class="text-muted" style="margin: 0;">Find experts and propose 1-on-1 mentoring sessions</p>
                          </div>
                          <div class="search-filter-panel" style="margin: 0;">
                              <div class="search-bar mentoring-search">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                    </svg>
                                  <input type="text" id="mentoring-search-input" class="search-input" placeholder="Search by name, or skills...">
                              </div>
                          </div>
                      </div>"""
    html = html.replace(old_html, new_html)
else:
    print("Could not find the Mentoring Hub block to replace!")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
