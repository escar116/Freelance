import re
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace vp-body contents
m = re.search(r'<div id="vp-body">.*?(</dialog>)', html, re.DOTALL)
if m:
    vp_body_old = m.group(0)
    # Reconstruct the vp_body exactly up to </dialog>
    vp_body_new = """<div id="vp-body">
            <div class="profile-hero mb-6" style="display: flex; flex-wrap: wrap; gap: 2rem; position: relative;">
                <div class="profile-avatar-circle" id="vp-avatar" style="flex-shrink: 0;">JD</div>
                <div class="profile-hero-info" style="flex: 1; min-width: 250px;">
                    <div class="flex items-center gap-3 flex-wrap">
                        <h2 class="profile-user-name" id="vp-name">Name</h2>
                        <span class="badge badge-approved" id="vp-verification">Verified</span>
                    </div>
                    <div class="profile-availability-pill mt-2" id="vp-availability">Available</div>
                    
                    <!-- Credentials in Top Block -->
                    <div class="mt-4 pt-4 border-t" style="border-color: var(--border-light); display: flex; gap: 2rem; flex-wrap: wrap;">
                        <div>
                            <span class="text-xs text-muted font-bold block uppercase mb-1">Faculty reference</span>
                            <strong id="vp-faculty" style="font-size: 0.9rem;">Not provided</strong>
                        </div>
                        <div>
                            <span class="text-xs text-muted font-bold block uppercase mb-1">Student ID</span>
                            <strong id="vp-student-id" style="font-size: 0.9rem;">N/A</strong>
                        </div>
                    </div>
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
                    <div class="flex flex-wrap gap-2" id="vp-skills-list">
                        <span class="text-muted text-sm">No skills listed.</span>
                    </div>
                </div>

                <!-- Compact Stats & Ratings -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
                    <!-- Ratings (Left) -->
                    <div>
                        <h3 class="profile-block-heading mb-3">Feedback & Reviews</h3>
                        <div class="flex items-center gap-4 mb-4">
                            <h2 class="text-4xl font-bold" style="margin:0;" id="vp-rating-average">0.0</h2>
                            <div>
                                <div class="text-sm text-muted">out of 5 <span id="vp-rating-count">Based on 0 reviews</span></div>
                            </div>
                        </div>
                        <div id="ratings-feedback-list" style="max-height: 200px; overflow-y: auto;">
                            <p class="text-muted text-sm text-center">No reviews yet.</p>
                        </div>
                    </div>
                    
                    <!-- Stats (Right) -->
                    <div>
                        <h3 class="profile-block-heading mb-3">Platform Statistics</h3>
                        <div style="display: flex; gap: 2rem;">
                            <!-- Applicant Stats -->
                            <div>
                                <h4 class="font-bold text-xs text-muted mb-2 uppercase">As Applicant</h4>
                                <div style="display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.9rem;">
                                    <div style="color: var(--status-pending);"><span class="font-bold">Pending:</span> <span class="font-bold" id="vp-app-pending">0</span></div>
                                    <div style="color: var(--status-completed);"><span class="font-bold">Completed:</span> <span class="font-bold" id="vp-app-completed">0</span></div>
                                    <div style="color: var(--status-terminated);"><span class="font-bold">Terminated:</span> <span class="font-bold" id="vp-app-terminated">0</span></div>
                                </div>
                            </div>
                            <!-- Employer Stats -->
                            <div>
                                <h4 class="font-bold text-xs text-muted mb-2 uppercase">As Employer</h4>
                                <div style="display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.9rem;">
                                    <div style="color: var(--status-pending);"><span class="font-bold">Pending:</span> <span class="font-bold" id="vp-emp-pending">0</span></div>
                                    <div style="color: var(--status-completed);"><span class="font-bold">Completed:</span> <span class="font-bold" id="vp-emp-completed">0</span></div>
                                    <div style="color: var(--status-terminated);"><span class="font-bold">Terminated:</span> <span class="font-bold" id="vp-emp-terminated">0</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </dialog>"""
    html = html.replace(vp_body_old, vp_body_new)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("vp-body replaced")
else:
    print("Could not match vp-body")
