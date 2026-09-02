import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Search Bar Alignment
old_search = '<div class="page-header-flex" style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">'
new_search = '<div class="page-header-flex" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">'
html = html.replace(old_search, new_search)

# 2. Rebuild profile-hero (Top block) for My Profile
old_profile_hero = re.search(r'<!-- Hero Profile Card -->.*?</button>\s*</div>', html, re.DOTALL)
new_profile_hero = """<!-- Hero Profile Card -->
                    <div class="profile-hero" style="display: flex; flex-wrap: wrap; gap: 2rem; position: relative; align-items: center;">
                        <div class="profile-avatar-circle" id="profile-avatar" style="flex-shrink: 0;">JD</div>
                        <div class="profile-hero-info" style="flex: 1; min-width: 250px;">
                            <div class="flex items-center gap-3 flex-wrap mb-1">
                                <h2 class="profile-user-name" id="profile-name" style="margin: 0;">Juan Dela Cruz</h2>
                                <span class="badge badge-approved" id="profile-verification"> Verified Student</span>
                                <div class="profile-availability-pill" id="profile-availability-badge" style="margin: 0;">Available</div>
                            </div>
                            <div class="text-sm font-bold text-muted mb-1" id="profile-student-id" style="color: var(--text-heading);">N/A</div>
                            <p class="profile-user-program text-muted" id="profile-program-sub" style="margin-bottom: 0.25rem;">BS Computer Engineering<br>Cagayan State University</p>
                            <p class="text-xs text-muted mt-2">Faculty Reference: <strong id="profile-faculty">Not provided</strong></p>
                        </div>
                        <button type="button" id="btn-edit-profile" class="edit-profile-pill-btn" style="align-self: flex-start;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-2">
                                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                            </svg> Edit Profile
                        </button>
                    </div>"""
if old_profile_hero:
    html = html.replace(old_profile_hero.group(0), new_profile_hero)

# 3. Rebuild credentials-card (Middle & Bottom blocks) for My Profile
old_profile_blocks = re.search(r'<div class="profile-section-block mt-6">\s*<div class="credentials-card">.*?(</section>)', html, re.DOTALL)
new_profile_blocks = """<div class="profile-section-block mt-6">
                        <!-- Middle Block: About & Skills -->
                        <div class="credentials-card mb-6">
                            <!-- About Me -->
                            <div class="mb-5 pb-5 border-b" style="border-color: var(--border-card);">
                                <h3 class="profile-block-heading mb-2">About Me</h3>
                                <p class="text-muted text-sm" id="profile-bio">No bio provided yet.</p>
                            </div>
                            <!-- Skills -->
                            <div>
                                <h3 class="profile-block-heading mb-2">Skills, Languages & Software</h3>
                                <div class="flex flex-wrap gap-2" id="profile-skills-display">
                                    <span class="text-muted text-sm">No skills listed.</span>
                                </div>
                            </div>
                        </div>

                        <!-- Bottom Blocks: Ratings & Stats (Separated) -->
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
                            <!-- Block 1: Ratings -->
                            <div class="credentials-card">
                                <h3 class="profile-block-heading mb-3">Feedback & Reviews</h3>
                                <div class="flex items-center gap-4 mb-4">
                                    <h2 class="text-4xl font-bold" style="margin:0;" id="ratings-avg-score">0.0</h2>
                                    <div>
                                        <div class="text-sm text-muted">out of 5 <span id="ratings-total-count">Based on 0 reviews</span></div>
                                    </div>
                                </div>
                                <div id="profile-feedback-list" style="max-height: 200px; overflow-y: auto; padding-right: 0.5rem;">
                                    <p class="text-muted text-sm text-center">No reviews yet.</p>
                                </div>
                            </div>
                            
                            <!-- Block 2: Statistics -->
                            <div class="credentials-card">
                                <h3 class="profile-block-heading mb-3">Platform Statistics</h3>
                                <div style="display: flex; gap: 2.5rem; flex-wrap: wrap;">
                                    <!-- Applicant Stats -->
                                    <div style="flex: 1; min-width: 120px;">
                                        <h4 class="font-bold text-xs text-muted mb-3 uppercase border-b pb-2" style="border-color: var(--border-light);">As Applicant</h4>
                                        <div style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.95rem;">
                                            <div style="color: var(--color-amber); display: flex; justify-content: space-between;"><span class="font-bold">Pending</span> <span class="font-bold" id="stat-app-pending">0</span></div>
                                            <div style="color: var(--color-emerald); display: flex; justify-content: space-between;"><span class="font-bold">Completed</span> <span class="font-bold" id="stat-app-completed">0</span></div>
                                            <div style="color: var(--color-red); display: flex; justify-content: space-between;"><span class="font-bold">Terminated</span> <span class="font-bold" id="stat-app-terminated">0</span></div>
                                        </div>
                                    </div>
                                    <!-- Employer Stats -->
                                    <div style="flex: 1; min-width: 120px;">
                                        <h4 class="font-bold text-xs text-muted mb-3 uppercase border-b pb-2" style="border-color: var(--border-light);">As Employer</h4>
                                        <div style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.95rem;">
                                            <div style="color: var(--color-amber); display: flex; justify-content: space-between;"><span class="font-bold">Pending</span> <span class="font-bold" id="stat-emp-pending">0</span></div>
                                            <div style="color: var(--color-emerald); display: flex; justify-content: space-between;"><span class="font-bold">Completed</span> <span class="font-bold" id="stat-emp-completed">0</span></div>
                                            <div style="color: var(--color-red); display: flex; justify-content: space-between;"><span class="font-bold">Terminated</span> <span class="font-bold" id="stat-emp-terminated">0</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>"""
if old_profile_blocks:
    html = html.replace(old_profile_blocks.group(0), new_profile_blocks)

# 4. Rebuild vp-body (View Profile modal)
old_vp_body = re.search(r'<div id="vp-body">.*?(</dialog>)', html, re.DOTALL)
new_vp_body = """<div id="vp-body">
            <div class="profile-hero mb-6" style="display: flex; flex-wrap: wrap; gap: 2rem; position: relative; align-items: center;">
                <div class="profile-avatar-circle" id="vp-avatar" style="flex-shrink: 0;">JD</div>
                <div class="profile-hero-info" style="flex: 1; min-width: 250px;">
                    <div class="flex items-center gap-3 flex-wrap mb-1">
                        <h2 class="profile-user-name" id="vp-name" style="margin: 0;">Name</h2>
                        <span class="badge badge-approved" id="vp-verification">Verified</span>
                        <div class="profile-availability-pill" id="vp-availability" style="margin: 0;">Available</div>
                    </div>
                    <div class="text-sm font-bold text-muted mb-1" id="vp-student-id" style="color: var(--text-heading);">N/A</div>
                    <p class="profile-user-program text-muted" id="vp-program-sub" style="margin-bottom: 0.25rem;">BS Computer Engineering<br>Cagayan State University</p>
                    <p class="text-xs text-muted mt-2">Faculty Reference: <strong id="vp-faculty">Not provided</strong></p>
                </div>
            </div>

            <!-- Middle Block: About & Skills -->
            <div class="credentials-card mb-6" style="padding: 1.5rem;">
                <!-- About Me -->
                <div class="mb-5 pb-5 border-b" style="border-color: var(--border-card);">
                    <h3 class="profile-block-heading mb-2">About Me</h3>
                    <p class="text-muted text-sm" id="vp-bio">No bio provided yet.</p>
                </div>
                <!-- Skills -->
                <div>
                    <h3 class="profile-block-heading mb-2">Skills, Languages & Software</h3>
                    <div class="flex flex-wrap gap-2" id="vp-skills">
                        <span class="text-muted text-sm">No skills listed.</span>
                    </div>
                </div>
            </div>

            <!-- Bottom Blocks: Ratings & Stats (Separated) -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
                <!-- Block 1: Ratings -->
                <div class="credentials-card" style="padding: 1.5rem;">
                    <h3 class="profile-block-heading mb-3">Feedback & Reviews</h3>
                    <div class="flex items-center gap-4 mb-4">
                        <h2 class="text-4xl font-bold" style="margin:0;" id="vp-ratings-avg">0.0</h2>
                        <div>
                            <div class="text-sm text-muted">out of 5 <span id="vp-ratings-count">Based on 0 reviews</span></div>
                        </div>
                    </div>
                    <div id="vp-ratings-list" style="max-height: 200px; overflow-y: auto; padding-right: 0.5rem;">
                        <p class="text-muted text-sm text-center">No reviews yet.</p>
                    </div>
                </div>
                
                <!-- Block 2: Statistics -->
                <div class="credentials-card" style="padding: 1.5rem;">
                    <h3 class="profile-block-heading mb-3">Platform Statistics</h3>
                    <div style="display: flex; gap: 2.5rem; flex-wrap: wrap;">
                        <!-- Applicant Stats -->
                        <div style="flex: 1; min-width: 120px;">
                            <h4 class="font-bold text-xs text-muted mb-3 uppercase border-b pb-2" style="border-color: var(--border-light);">As Applicant</h4>
                            <div style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.95rem;">
                                <div style="color: var(--color-amber); display: flex; justify-content: space-between;"><span class="font-bold">Pending</span> <span class="font-bold" id="vp-app-pending">0</span></div>
                                <div style="color: var(--color-emerald); display: flex; justify-content: space-between;"><span class="font-bold">Completed</span> <span class="font-bold" id="vp-app-completed">0</span></div>
                                <div style="color: var(--color-red); display: flex; justify-content: space-between;"><span class="font-bold">Terminated</span> <span class="font-bold" id="vp-app-terminated">0</span></div>
                            </div>
                        </div>
                        <!-- Employer Stats -->
                        <div style="flex: 1; min-width: 120px;">
                            <h4 class="font-bold text-xs text-muted mb-3 uppercase border-b pb-2" style="border-color: var(--border-light);">As Employer</h4>
                            <div style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.95rem;">
                                <div style="color: var(--color-amber); display: flex; justify-content: space-between;"><span class="font-bold">Pending</span> <span class="font-bold" id="vp-emp-pending">0</span></div>
                                <div style="color: var(--color-emerald); display: flex; justify-content: space-between;"><span class="font-bold">Completed</span> <span class="font-bold" id="vp-emp-completed">0</span></div>
                                <div style="color: var(--color-red); display: flex; justify-content: space-between;"><span class="font-bold">Terminated</span> <span class="font-bold" id="vp-emp-terminated">0</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </dialog>"""
if old_vp_body:
    html = html.replace(old_vp_body.group(0), new_vp_body)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Profile sections updated")
