import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Add blurred loading screen
# We inject <div id="vp-loading-overlay" class="hidden" style="..."> inside modal-content
overlay = '''<div id="vp-loading-overlay" class="hidden" style="position: absolute; top:0; left:0; width:100%; height:100%; background: rgba(255,255,255,0.7); backdrop-filter: blur(5px); z-index: 100; display: flex; flex-direction: column; justify-content: center; align-items: center; border-radius: 12px;">
                <div class="loader mb-2"></div>
                <p class="text-sm font-bold" style="color: var(--primary);">Loading profile...</p>
            </div>'''

if 'vp-loading-overlay' not in html:
    html = html.replace('<dialog id="dialog-view-profile" class="modal">\n        <div class="modal-content" style="max-width: 800px; padding: 2.5rem; border-radius: 12px;">',
                        f'<dialog id="dialog-view-profile" class="modal">\n        <div class="modal-content" style="max-width: 800px; padding: 2.5rem; border-radius: 12px; position: relative;">\n            {overlay}')

# 2. Fix o" Verified Student -> Verified
html = html.replace('o" Verified Student', 'Verified')

# 3. Remove student below it (vp-program)
# <p class="profile-user-program" id="vp-program">BS Computer Engineering A Cagayan State University</p>
html = html.replace('<p class="profile-user-program" id="vp-program">BS Computer Engineering A Cagayan State University</p>', '')

# 4. Update Platform Statistics format
old_stats = '''<!-- Statistics -->
                <div class="mb-5 pb-5 border-b" style="border-color: var(--border-card);">
                    <h3 class="profile-block-heading mb-3">Platform Statistics</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                        <div>
                            <h4 class="font-bold text-sm text-muted mb-2 uppercase">As Applicant</h4>
                            <div class="cred-grid">
                                <div class="cred-item"><span class="cred-label">Pending</span><span class="cred-value font-bold text-amber" id="vp-app-pending">0</span></div>
                                <div class="cred-item"><span class="cred-label">Completed</span><span class="cred-value font-bold text-green" id="vp-app-completed">0</span></div>
                                <div class="cred-item"><span class="cred-label">Terminated</span><span class="cred-value font-bold text-red" id="vp-app-terminated">0</span></div>
                            </div>
                        </div>
                        <div>
                            <h4 class="font-bold text-sm text-muted mb-2 uppercase">As Employer</h4>
                            <div class="cred-grid">
                                <div class="cred-item"><span class="cred-label">Pending</span><span class="cred-value font-bold text-amber" id="vp-emp-pending">0</span></div>
                                <div class="cred-item"><span class="cred-label">Completed</span><span class="cred-value font-bold text-green" id="vp-emp-completed">0</span></div>
                                <div class="cred-item"><span class="cred-label">Terminated</span><span class="cred-value font-bold text-red" id="vp-emp-terminated">0</span></div>
                            </div>
                        </div>
                    </div>
                </div>'''

new_stats = '''<!-- Statistics -->
                <div class="mb-5 pb-5 border-b" style="border-color: var(--border-card);">
                    <h3 class="profile-block-heading mb-3">Platform Statistics</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                        <div>
                            <h4 class="font-bold text-sm text-muted mb-2 uppercase">As Applicant</h4>
                            <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.9rem;">
                                <div><span class="font-bold">Pending:</span> <span style="color: var(--status-pending); font-weight: bold;" id="vp-app-pending">0</span></div>
                                <div><span class="font-bold">Completed:</span> <span style="color: var(--status-completed); font-weight: bold;" id="vp-app-completed">0</span></div>
                                <div><span class="font-bold">Terminated:</span> <span style="color: var(--status-terminated); font-weight: bold;" id="vp-app-terminated">0</span></div>
                            </div>
                        </div>
                        <div>
                            <h4 class="font-bold text-sm text-muted mb-2 uppercase">As Employer</h4>
                            <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.9rem;">
                                <div><span class="font-bold">Pending:</span> <span style="color: var(--status-pending); font-weight: bold;" id="vp-emp-pending">0</span></div>
                                <div><span class="font-bold">Completed:</span> <span style="color: var(--status-completed); font-weight: bold;" id="vp-emp-completed">0</span></div>
                                <div><span class="font-bold">Terminated:</span> <span style="color: var(--status-terminated); font-weight: bold;" id="vp-emp-terminated">0</span></div>
                            </div>
                        </div>
                    </div>
                </div>'''

html = html.replace(old_stats, new_stats)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
