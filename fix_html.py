with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update mentoring search HTML
search_html_old = """<div class="search-filter-panel mb-4">
                        <div class="search-bar">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon">
                                  <circle cx="11" cy="11" r="8"></circle>
                                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                              </svg>
                            <input type="text" id="mentoring-search-input" class="search-input" placeholder="Search by name, or skills...">
                        </div>
                      </div>"""

search_html_new = """<div class="search-filter-panel mb-4" style="display: flex; justify-content: flex-start;">
                        <div class="search-bar mentoring-search">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon">
                                  <circle cx="11" cy="11" r="8"></circle>
                                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                              </svg>
                            <input type="text" id="mentoring-search-input" class="search-input" placeholder="Search by name, or skills...">
                        </div>
                      </div>"""
html = html.replace(search_html_old, search_html_new)

# 2. Add dialog-mentoring-apply if it doesn't exist
if 'id="dialog-mentoring-apply"' not in html:
    apply_dialog = """
    <!-- Mentoring Apply Dialog -->
    <dialog id="dialog-mentoring-apply" class="modal">
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h2>Propose Mentoring Session</h2>
                <button type="button" class="dialog-close-btn">&times;</button>
            </div>
            <p class="text-sm text-muted mb-4">Send a request to <strong id="mentoring-target-name"></strong>.</p>
            <form id="mentoring-apply-form">
                <div class="form-group">
                    <label>Session Title</label>
                    <input type="text" id="mentoring-title" class="input" placeholder="e.g. Help with React concepts" required>
                </div>
                <div class="form-group">
                    <label>What do you need help with?</label>
                    <textarea id="mentoring-desc" class="input" rows="4" placeholder="Describe the topics you want to cover..." required></textarea>
                </div>
                <div class="form-group">
                    <label>Expected Duration / Schedule</label>
                    <input type="text" id="mentoring-time" class="input" placeholder="e.g. 1 hour, tomorrow afternoon" required>
                </div>
                <div class="form-group">
                    <label>Proposed Price (₱)</label>
                    <input type="number" id="mentoring-amount" class="input" min="0" placeholder="e.g. 500" required>
                </div>
                <div class="flex justify-end gap-3 mt-6">
                    <button type="button" class="btn btn-outline dialog-close-btn">Cancel</button>
                    <button type="submit" id="btn-submit-mentoring" class="btn btn-purple">Submit Proposal</button>
                </div>
            </form>
        </div>
    </dialog>
    """
    
    # insert before <div id="toast-container"
    idx = html.find('<div id="toast-container"')
    html = html[:idx] + apply_dialog + "\n    " + html[idx:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
