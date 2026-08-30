import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

start = html.find('<dialog id="dialog-view-profile" class="modal">')
end = html.find('</dialog>', start)
old_dialog = html[start:end]

# We will rewrite the modal-body equivalent part
new_dialog = '''<dialog id="dialog-view-profile" class="modal">
        <div class="modal-content" style="max-width: 800px; padding: 2.5rem; border-radius: 12px;">
            <div class="modal-header border-b pb-4 mb-4" style="border-color: var(--border-light);">
                <h2 style="font-size: 1.5rem;">User Profile</h2>
                <button type="button" class="dialog-close-btn">o </button>
            </div>

            <div class="profile-hero mb-6">
                <div class="profile-avatar-circle" id="vp-avatar">JD</div>
                <div class="profile-hero-info">
                    <div class="flex items-center gap-3">
                        <h2 class="profile-user-name" id="vp-name">Name</h2>
                        <span class="badge badge-approved" id="vp-verification">o" Verified Student</span>
                    </div>
                    <p class="profile-user-program" id="vp-program">BS Computer Engineering A Cagayan State University</p>
                    <div class="profile-availability-pill" id="vp-availability">Available</div>
                </div>
            </div>

            <div class="credentials-card" style="padding: 1.5rem;">
                <!-- About Me -->
                <div class="mb-5 pb-5 border-b" style="border-color: var(--border-card);">
                    <h3 class="profile-block-heading mb-2">About Me</h3>
                    <p class="text-muted text-sm" id="vp-bio">No bio provided yet.</p>
                </div>

                <!-- Skills -->
                <div class="mb-5 pb-5 border-b" style="border-color: var(--border-card);">
                    <h3 class="profile-block-heading mb-2">Skills, Languages & Software</h3>
                    <div class="skills-grid" id="vp-skills" style="border: none; padding: 0; background: transparent; max-height: none;">
                        <p class="text-muted text-sm">No skills added yet.</p>
                    </div>
                </div>

                <!-- Credentials & References -->
                <div class="mb-5 pb-5 border-b" style="border-color: var(--border-card);">
                    <h3 class="profile-block-heading mb-3">Credentials & references</h3>
                    <div class="cred-grid">
                        <div class="cred-item">
                            <span class="cred-label">Faculty reference</span>
                            <span class="cred-value" id="vp-faculty">Not provided</span>
                        </div>
                        <div class="cred-item">
                            <span class="cred-label">Student ID</span>
                            <span class="cred-value" id="vp-student-id">?"</span>
                        </div>
                    </div>
                </div>

                <!-- Statistics -->
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
                </div>

                <!-- Feedback -->
                <div>
                    <h3 class="profile-block-heading mb-3">Feedback & Reviews</h3>
                    <div class="rating-score-row mb-4">
                        <div class="rating-huge-num" id="vp-ratings-avg">0.0</div>
                        <div class="rating-score-meta">
                            <span>out of 5</span>
                            <small class="text-muted block" id="vp-ratings-count">Based on 0 reviews</small>
                        </div>
                    </div>
                    <div class="feedback-feed-list" id="vp-ratings-list" style="max-height: 250px; overflow-y: auto; padding-right: 8px;">
                        <div class="empty-state text-center text-muted">No reviews yet.</div>
                    </div>
                </div>
            </div>
        </div>'''

html = html.replace(old_dialog, new_dialog)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
