import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Fix Profile Layout again in My Profile
m_profile = re.search(r'<!-- Middle Block: About & Skills -->.*?</section>', html, re.DOTALL)

new_profile = """<!-- Middle Block: About & Skills -->
                        <div class="credentials-card mb-6">
                            <!-- About Me -->
                            <div class="mb-5 pb-5 border-b" style="border-color: var(--border-card);">
                                <h3 class="profile-block-heading mb-2">About Me</h3>
                                <p class="text-muted text-sm" id="profile-bio-display">No bio provided yet.</p>
                            </div>
                            <!-- Skills -->
                            <div>
                                <h3 class="profile-block-heading mb-2">Skills, Languages & Software</h3>
                                <div class="flex flex-wrap gap-2" id="profile-skills-display">
                                    <span class="text-muted text-sm">No skills listed.</span>
                                </div>
                            </div>
                        </div>

                        <!-- Block 3: Ratings Breakdown & Stats -->
                        <div class="credentials-card mb-6">
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                                <!-- Ratings Breakdown (Left) -->
                                <div>
                                    <h3 class="profile-block-heading mb-3">Ratings</h3>
                                    <div style="display: flex; align-items: center; gap: 1.5rem;">
                                        <div style="text-align: center;">
                                            <h2 class="font-bold" style="font-size: 3.5rem; line-height: 1; margin: 0; color: var(--text-heading);" id="ratings-avg-score">0.0</h2>
                                            <div style="color: var(--color-amber); font-size: 1.25rem; margin-top: 0.25rem;" id="ratings-avg-stars">★★★★★</div>
                                            <div class="text-xs text-muted mt-1" id="ratings-total-count">0</div>
                                        </div>
                                        <div style="flex: 1; display: flex; flex-direction: column; gap: 0.4rem;">
                                            <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; font-weight: bold;">
                                                <span style="width: 10px;">5</span>
                                                <div style="flex: 1; background: var(--border-light); height: 8px; border-radius: 4px; overflow: hidden;"><div id="pb-5" style="background: var(--color-purple); width: 0%; height: 100%; border-radius: 4px; transition: width 0.3s;"></div></div>
                                            </div>
                                            <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; font-weight: bold;">
                                                <span style="width: 10px;">4</span>
                                                <div style="flex: 1; background: var(--border-light); height: 8px; border-radius: 4px; overflow: hidden;"><div id="pb-4" style="background: var(--color-purple); width: 0%; height: 100%; border-radius: 4px; transition: width 0.3s;"></div></div>
                                            </div>
                                            <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; font-weight: bold;">
                                                <span style="width: 10px;">3</span>
                                                <div style="flex: 1; background: var(--border-light); height: 8px; border-radius: 4px; overflow: hidden;"><div id="pb-3" style="background: var(--color-purple); width: 0%; height: 100%; border-radius: 4px; transition: width 0.3s;"></div></div>
                                            </div>
                                            <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; font-weight: bold;">
                                                <span style="width: 10px;">2</span>
                                                <div style="flex: 1; background: var(--border-light); height: 8px; border-radius: 4px; overflow: hidden;"><div id="pb-2" style="background: var(--color-purple); width: 0%; height: 100%; border-radius: 4px; transition: width 0.3s;"></div></div>
                                            </div>
                                            <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; font-weight: bold;">
                                                <span style="width: 10px;">1</span>
                                                <div style="flex: 1; background: var(--border-light); height: 8px; border-radius: 4px; overflow: hidden;"><div id="pb-1" style="background: var(--color-purple); width: 0%; height: 100%; border-radius: 4px; transition: width 0.3s;"></div></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Stats (Right) -->
                                <div>
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

                        <!-- Block 4: Feedback List -->
                        <div class="credentials-card">
                            <h3 class="profile-block-heading mb-3">Feedback & Reviews</h3>
                            <div id="profile-feedback-list" style="max-height: 250px; overflow-y: auto; padding-right: 0.5rem;">
                                <p class="text-muted text-sm text-center">No reviews yet.</p>
                            </div>
                        </div>
                    </div>
                </section>"""
if m_profile:
    html = html.replace(m_profile.group(0), new_profile)

# Now apply exactly the same logic to View Profile (vp-body)
m_vp = re.search(r'<!-- Middle Block: About & Skills -->.*?(</dialog>)', html, re.DOTALL)
new_vp = """<!-- Middle Block: About & Skills -->
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

            <!-- Block 3: Ratings Breakdown & Stats -->
            <div class="credentials-card mb-6" style="padding: 1.5rem;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
                    <!-- Ratings Breakdown (Left) -->
                    <div>
                        <h3 class="profile-block-heading mb-3">Ratings</h3>
                        <div style="display: flex; align-items: center; gap: 1.5rem;">
                            <div style="text-align: center;">
                                <h2 class="font-bold" style="font-size: 3.5rem; line-height: 1; margin: 0; color: var(--text-heading);" id="vp-ratings-avg">0.0</h2>
                                <div style="color: var(--color-amber); font-size: 1.25rem; margin-top: 0.25rem;" id="vp-ratings-avg-stars">★★★★★</div>
                                <div class="text-xs text-muted mt-1" id="vp-ratings-count">0</div>
                            </div>
                            <div style="flex: 1; display: flex; flex-direction: column; gap: 0.4rem;">
                                <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; font-weight: bold;">
                                    <span style="width: 10px;">5</span>
                                    <div style="flex: 1; background: var(--border-light); height: 8px; border-radius: 4px; overflow: hidden;"><div id="vp-pb-5" style="background: var(--color-purple); width: 0%; height: 100%; border-radius: 4px; transition: width 0.3s;"></div></div>
                                </div>
                                <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; font-weight: bold;">
                                    <span style="width: 10px;">4</span>
                                    <div style="flex: 1; background: var(--border-light); height: 8px; border-radius: 4px; overflow: hidden;"><div id="vp-pb-4" style="background: var(--color-purple); width: 0%; height: 100%; border-radius: 4px; transition: width 0.3s;"></div></div>
                                </div>
                                <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; font-weight: bold;">
                                    <span style="width: 10px;">3</span>
                                    <div style="flex: 1; background: var(--border-light); height: 8px; border-radius: 4px; overflow: hidden;"><div id="vp-pb-3" style="background: var(--color-purple); width: 0%; height: 100%; border-radius: 4px; transition: width 0.3s;"></div></div>
                                </div>
                                <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; font-weight: bold;">
                                    <span style="width: 10px;">2</span>
                                    <div style="flex: 1; background: var(--border-light); height: 8px; border-radius: 4px; overflow: hidden;"><div id="vp-pb-2" style="background: var(--color-purple); width: 0%; height: 100%; border-radius: 4px; transition: width 0.3s;"></div></div>
                                </div>
                                <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; font-weight: bold;">
                                    <span style="width: 10px;">1</span>
                                    <div style="flex: 1; background: var(--border-light); height: 8px; border-radius: 4px; overflow: hidden;"><div id="vp-pb-1" style="background: var(--color-purple); width: 0%; height: 100%; border-radius: 4px; transition: width 0.3s;"></div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Stats (Right) -->
                    <div>
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

            <!-- Block 4: Feedback List -->
            <div class="credentials-card" style="padding: 1.5rem;">
                <h3 class="profile-block-heading mb-3">Feedback & Reviews</h3>
                <div id="vp-ratings-list" style="max-height: 250px; overflow-y: auto; padding-right: 0.5rem;">
                    <p class="text-muted text-sm text-center">No reviews yet.</p>
                </div>
            </div>
        </div>
    </dialog>"""
if m_vp:
    html = html.replace(m_vp.group(0), new_vp)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
