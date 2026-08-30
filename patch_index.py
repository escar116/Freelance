import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

nav_btn = '''                <button type="button" class="nav-btn" data-target="mentoring" title="Mentoring">
                    <svg class="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <span class="nav-btn-label">Mentoring</span>
                </button>
'''
content = content.replace('                <button type="button" class="nav-btn" data-target="applications"', nav_btn + '                <button type="button" class="nav-btn" data-target="applications"')

mentoring_section = '''                <!-- ==========================================================================
                     NEW SECTION: MENTORING
                     ========================================================================== -->
                <section id="section-mentoring" class="content-section hidden">
                    <div class="page-header-flex">
                        <div>
                            <h1 class="page-title">Mentoring Hub</h1>
                            <p class="text-muted">Find experts and propose 1-on-1 mentoring sessions</p>
                        </div>
                    </div>
                    <div class="search-filter-panel mb-6">
                        <div class="search-bar">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                            <input type="text" id="mentoring-search-input" class="search-input" placeholder="Search by name, role, or skills...">
                        </div>
                    </div>
                    <div class="jobs-grid" id="mentoring-users-grid">
                        <div class="loader"></div>
                    </div>
                </section>
'''
content = content.replace('                <!-- ==========================================================================\n                     6. SECTION: APPLICATIONS HUB', mentoring_section + '\n                <!-- ==========================================================================\n                     6. SECTION: APPLICATIONS HUB')

mentoring_app_tab = '''                        <button type="button" class="tab-btn" data-tab="mentoring">Mentoring Requests</button>'''
content = content.replace('<button type="button" class="tab-btn" data-tab="applied">My Applications</button>', '<button type="button" class="tab-btn" data-tab="applied">My Applications</button>\n' + mentoring_app_tab)

mentoring_app_list = '''                    <div id="mentoring-requests-list" class="apps-list hidden">
                        <div class="loader"></div>
                    </div>'''
content = content.replace('                    <div id="my-applications-list" class="apps-list hidden">\n                        <div class="loader"></div>\n                    </div>', '                    <div id="my-applications-list" class="apps-list hidden">\n                        <div class="loader"></div>\n                    </div>\n' + mentoring_app_list)

mentoring_dialog = '''
    <!-- Apply for Mentoring Modal -->
    <dialog id="dialog-mentoring-apply" class="modal">
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h2>Apply for Mentoring</h2>
                <button type="button" class="dialog-close-btn">&times;</button>
            </div>
            <p class="text-sm text-muted mb-4">Propose a mentoring session with <strong id="mentoring-target-name"></strong>.</p>
            <form id="mentoring-apply-form">
                <div class="form-group">
                    <label class="form-label" for="mentoring-title">Mentoring Topic / Title</label>
                    <input type="text" id="mentoring-title" class="form-control" placeholder="e.g., Intro to Python, UI/UX Critique" required>
                </div>
                <div class="form-group">
                    <label class="form-label" for="mentoring-desc">Description</label>
                    <textarea id="mentoring-desc" class="form-control" rows="3" placeholder="What specifically do you want to learn or get help with?" required></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label" for="mentoring-time">Expected Time</label>
                    <input type="text" id="mentoring-time" class="form-control" placeholder="e.g., 2 Hours this Friday, 1 Hour weekly" required>
                </div>
                <div class="form-group">
                    <label class="form-label" for="mentoring-amount">Amount to Pay (&#8369;)</label>
                    <input type="number" id="mentoring-amount" class="form-control" min="0" step="50" placeholder="0 if free" required>
                </div>
                <div class="modal-footer" style="margin-top: 1.5rem; justify-content: flex-end;">
                    <button type="button" class="btn btn-outline dialog-close-btn" style="margin-right: 0.5rem;">Cancel</button>
                    <button type="submit" class="btn btn-purple" id="btn-submit-mentoring">Submit Proposal</button>
                </div>
            </form>
        </div>
    </dialog>
'''
content = content.replace('    <!-- New Service Request Modal -->', mentoring_dialog + '\n    <!-- New Service Request Modal -->')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
