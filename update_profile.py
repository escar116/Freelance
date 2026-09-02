import re
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

m = re.search(r'<!-- Hero Profile Card -->.*?(</section>)', html, re.DOTALL)
if m:
    profile_old = m.group(0)
    profile_new = """<!-- Hero Profile Card -->
                    <div class="profile-hero" style="display: flex; flex-wrap: wrap; gap: 2rem; position: relative;">
                        <div class="profile-avatar-circle" id="profile-avatar" style="flex-shrink: 0;">JD</div>
                        <div class="profile-hero-info" style="flex: 1; min-width: 250px;">
                            <div class="flex items-center gap-3 flex-wrap">
                                <h2 class="profile-user-name" id="profile-name">Juan Dela Cruz</h2>
                                <span class="badge badge-approved" id="profile-verification"> Verified Student</span>
                            </div>
                            <p class="profile-user-program text-muted" id="profile-program-sub">BS Computer Engineering  Cagayan State University</p>
                            <div class="profile-availability-pill mt-2" id="profile-availability-badge">Available</div>
                            
                            <!-- Credentials in Top Block -->
                            <div class="mt-4 pt-4 border-t" style="border-color: var(--border-light); display: flex; gap: 2rem; flex-wrap: wrap;">
                                <div>
                                    <span class="text-xs text-muted font-bold block uppercase mb-1">Faculty reference</span>
                                    <strong id="profile-faculty" style="font-size: 0.9rem;">Not provided</strong>
                                </div>
                                <div>
                                    <span class="text-xs text-muted font-bold block uppercase mb-1">Student ID</span>
                                    <strong id="profile-student-id" style="font-size: 0.9rem;">N/A</strong>
                                </div>
                            </div>
                        </div>
                        <button type="button" id="btn-edit-profile" class="edit-profile-pill-btn" style="align-self: flex-start;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-2">
                                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                            </svg> Edit Profile
                        </button>
                    </div>

                    <div class="profile-section-block mt-6">
                        <div class="credentials-card">
                            <!-- About Me -->
                            <div class="mb-5 pb-5 border-b" style="border-color: var(--border-card);">
                                <h3 class="profile-block-heading mb-2">About Me</h3>
                                <p class="text-muted text-sm" id="profile-bio">No bio provided yet.</p>
                            </div>

                            <!-- Skills -->
                            <div class="mb-5 pb-5 border-b" style="border-color: var(--border-card);">
                                <h3 class="profile-block-heading mb-2">Skills, Languages & Software</h3>
                                <div class="flex flex-wrap gap-2" id="profile-skills-list">
                                    <span class="text-muted text-sm">No skills listed.</span>
                                </div>
                            </div>

                            <!-- Compact Stats & Ratings -->
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
                                <!-- Ratings (Left) -->
                                <div>
                                    <h3 class="profile-block-heading mb-3">Feedback & Reviews</h3>
                                    <div class="flex items-center gap-4 mb-4">
                                        <h2 class="text-4xl font-bold" style="margin:0;" id="profile-rating-average">0.0</h2>
                                        <div>
                                            <div class="text-sm text-muted">out of 5 <span id="profile-rating-count">Based on 0 reviews</span></div>
                                        </div>
                                    </div>
                                    <div id="profile-ratings-list" style="max-height: 200px; overflow-y: auto;">
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
                                                <div style="color: var(--status-pending);"><span class="font-bold">Pending:</span> <span class="font-bold" id="stat-app-pending">0</span></div>
                                                <div style="color: var(--status-completed);"><span class="font-bold">Completed:</span> <span class="font-bold" id="stat-app-completed">0</span></div>
                                                <div style="color: var(--status-terminated);"><span class="font-bold">Terminated:</span> <span class="font-bold" id="stat-app-terminated">0</span></div>
                                            </div>
                                        </div>
                                        <!-- Employer Stats -->
                                        <div>
                                            <h4 class="font-bold text-xs text-muted mb-2 uppercase">As Employer</h4>
                                            <div style="display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.9rem;">
                                                <div style="color: var(--status-pending);"><span class="font-bold">Pending:</span> <span class="font-bold" id="stat-emp-pending">0</span></div>
                                                <div style="color: var(--status-completed);"><span class="font-bold">Completed:</span> <span class="font-bold" id="stat-emp-completed">0</span></div>
                                                <div style="color: var(--status-terminated);"><span class="font-bold">Terminated:</span> <span class="font-bold" id="stat-emp-terminated">0</span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>"""
    html = html.replace(profile_old, profile_new)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("section-profile replaced")
else:
    print("Could not match section-profile")
