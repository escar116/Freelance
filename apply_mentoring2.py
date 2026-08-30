import re
with open('src/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update loadApplications
content = content.replace(
'''async function loadApplications(isSilent = false) {
    if (appTab === 'posted') await loadPostedJobs(isSilent);
    else await loadMyApplications(isSilent);
  }''',
'''async function loadApplications(isSilent = false) {
    if (appTab === 'posted') await loadPostedJobs(isSilent);
    else if (appTab === 'mentoring') await loadMentoringRequests(isSilent);
    else await loadMyApplications(isSilent);
  }'''
)

# 2. In loadPostedJobs, filter out mentoring category
content = content.replace(
"const jobs = (res.data.helpRequests || []).filter(j => j.status === 'OPEN' || !j.status);",
"const jobs = (res.data.helpRequests || []).filter(j => (j.status === 'OPEN' || !j.status) && j.category !== 'MENTORING');"
)

# 3. Add loadMentoringRequests before loadMyApplications
mentoring_reqs = '''
  async function loadMentoringRequests(isSilent = false) {
    const container = document.getElementById('mentoring-requests-list');
    if (!container) return;
    if (!isSilent) container.innerHTML = '<div class="loader"></div>';
    try {
      const res = await listMyHelpRequestsWithApplications(dc, { userId: userData.id }, SERVER_ONLY);
      const jobs = (res.data.helpRequests || []).filter(j => j.category === 'MENTORING' && (j.status === 'OPEN' || !j.status));
      container.innerHTML = '';
      if (jobs.length === 0) {
        container.innerHTML = '<div class="empty-state text-center text-muted" style="padding: 2rem;">No pending mentoring requests received.</div>';
        return;
      }
      jobs.forEach(job => {
        const pending = (job.applications_on_helpRequest || []).filter(a => a.status === 'PENDING');
        
        const jobEl = document.createElement('div');
        jobEl.className = 'job-card';
        
        let appsHtml = '';
        if (pending.length === 0) {
          appsHtml = '<p class="text-xs text-muted mt-2">No pending applications for this request.</p>';
        } else {
          appsHtml = pending.map(app => `
            <div class="application-card">
              <div class="candidate-info">
                <strong class="cursor-pointer hover:underline" onclick="openViewProfileDialog('${app.applicant?.id || ''}')">${app.applicant?.fullName || 'Applicant'}</strong>
                <div class="candidate-message">"${app.message}"</div>
              </div>
              <div class="candidate-offer">
                <strong>${peso(app.priceOffer)}</strong>
                <div class="flex gap-1 mt-1">
                  <button type="button" class="btn btn-purple btn-sm" onclick="approveApplication('${app.id}', '${job.id}')">Accept</button>
                  <button type="button" class="btn btn-outline btn-sm" style="border-color:#ef4444; color:#ef4444;" onclick="rejectApplication('${app.id}')">Decline</button>
                </div>
              </div>
            </div>
          `).join('');
        }
        
        jobEl.innerHTML = `
          <div class="flex justify-between items-start mb-2">
            <div>
              <h3 class="job-title" style="margin: 0;">${job.title}</h3>
              <p class="text-sm text-muted mt-1">${job.description}</p>
            </div>
          </div>
          <div class="mt-4">
            <h4 class="text-sm font-bold mb-2">Mentoree Applications (${pending.length})</h4>
            ${appsHtml}
          </div>
        `;
        container.appendChild(jobEl);
      });
    } catch(e) {
      console.error(e);
      container.innerHTML = '<div class="empty-state">Error loading mentoring requests.</div>';
    }
  }
'''
content = content.replace("async function loadMyApplications(isSilent = false) {", mentoring_reqs + "\n  async function loadMyApplications(isSilent = false) {")

# 4. Update setupApplicationTabs
content = content.replace(
'''function setupApplicationTabs() {
    $$('#section-applications .tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        appTab = btn.dataset.tab;
        $$('#section-applications .tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        if (appTab === 'posted') {
          $('#posted-jobs-list').classList.remove('hidden');
          $('#my-applications-list').classList.add('hidden');
          loadPostedJobs();
        } else {
          $('#posted-jobs-list').classList.add('hidden');
          $('#my-applications-list').classList.remove('hidden');
          loadMyApplications();
        }
      });
    });
  }''',
'''function setupApplicationTabs() {
    $$('#section-applications .tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        appTab = btn.dataset.tab;
        $$('#section-applications .tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        $('#posted-jobs-list').classList.add('hidden');
        $('#my-applications-list').classList.add('hidden');
        if (document.getElementById('mentoring-requests-list')) document.getElementById('mentoring-requests-list').classList.add('hidden');
        
        if (appTab === 'posted') {
          $('#posted-jobs-list').classList.remove('hidden');
          loadPostedJobs();
        } else if (appTab === 'mentoring') {
          document.getElementById('mentoring-requests-list').classList.remove('hidden');
          loadMentoringRequests();
        } else {
          $('#my-applications-list').classList.remove('hidden');
          loadMyApplications();
        }
      });
    });
  }'''
)

# 5. Add loadMentoring to navigateTo
content = content.replace("else if (section === 'services') loadServices();", "else if (section === 'services') loadServices();\n    else if (section === 'mentoring') loadMentoring();")

# 6. Global variables
content = content.replace("let adminSearchQuery = '';", "let adminSearchQuery = '';\n  let activeMentoringTarget = null;\n  let allUsersData = [];")

# 7. Add Mentoring Logic before setupEditProfile
mentoring_logic = '''
  // ── Mentoring ────────────────────────────────────────────────────────────────
  async function loadMentoring() {
    const grid = document.getElementById('mentoring-users-grid');
    if (grid.children.length === 0 || grid.querySelector('.loader')) {
      grid.innerHTML = '<div class="loader"></div>';
    }
    
    try {
      const res = await listAllUsers(dc);
      let users = res.data.users || [];
      users = users.filter(u => u.id !== userData.id);
      allUsersData = users;
      renderMentoringGrid(users);
    } catch(e) {
      console.error(e);
      grid.innerHTML = '<div class="empty-state">Error loading users.</div>';
    }
  }

  function renderMentoringGrid(users) {
    const grid = document.getElementById('mentoring-users-grid');
    grid.innerHTML = '';
    if (users.length === 0) {
      grid.innerHTML = '<div class="empty-state">No users available for mentoring.</div>';
      return;
    }
    
    users.forEach(u => {
      const card = document.createElement('div');
      card.className = 'job-card';
      
      const skills = u.skills || [];
      let skillsHtml = '';
      if (skills.length > 0) {
        skillsHtml = '<div class="mt-2 mb-3 flex flex-wrap gap-1">' + skills.slice(0, 5).map(s => `<span class="badge" style="background: rgba(255,255,255,0.05);">${s}</span>`).join('') + (skills.length > 5 ? '<span class="text-xs text-muted">+' + (skills.length - 5) + '</span>' : '') + '</div>';
      } else {
        skillsHtml = '<div class="mt-2 mb-3 text-xs text-muted">No skills listed</div>';
      }

      card.innerHTML = `
        <div class="flex items-center gap-3 mb-3">
          <div class="avatar cursor-pointer" onclick="openViewProfileDialog('${u.id}')">${initials(u.fullName)}</div>
          <div>
            <h3 class="job-title cursor-pointer hover:underline" style="margin:0;" onclick="openViewProfileDialog('${u.id}')">${u.fullName}</h3>
            <p class="text-sm text-muted">${u.preferredRole || 'Student'}</p>
          </div>
        </div>
        <p class="text-sm text-muted mb-2 line-clamp-2">${u.bio || 'No bio provided.'}</p>
        ${skillsHtml}
        <div class="flex justify-between items-center mt-auto" style="padding-top: 1rem; border-top: 1px solid var(--border-card);">
          <button type="button" class="btn btn-outline btn-sm view-profile-btn">View Profile</button>
          <button type="button" class="btn btn-purple btn-sm apply-mentor-btn">Apply for Mentoring</button>
        </div>
      `;
      
      card.querySelector('.view-profile-btn').addEventListener('click', () => openViewProfileDialog(u.id));
      card.querySelector('.apply-mentor-btn').addEventListener('click', () => {
        activeMentoringTarget = u;
        document.getElementById('mentoring-target-name').textContent = u.fullName;
        document.getElementById('mentoring-apply-form').reset();
        document.getElementById('dialog-mentoring-apply').showModal();
      });
      
      grid.appendChild(card);
    });
  }

  function setupMentoringDialog() {
    const searchInput = document.getElementById('mentoring-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase();
        const filtered = allUsersData.filter(u => 
          (u.fullName || '').toLowerCase().includes(q) || 
          (u.preferredRole || '').toLowerCase().includes(q) ||
          (u.skills || []).some(s => s.toLowerCase().includes(q))
        );
        renderMentoringGrid(filtered);
      });
    }

    const form = document.getElementById('mentoring-apply-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!activeMentoringTarget) return;
        const btn = document.getElementById('btn-submit-mentoring');
        btn.disabled = true;
        btn.textContent = 'Submitting...';
        
        try {
          const title = document.getElementById('mentoring-title').value.trim();
          const desc = document.getElementById('mentoring-desc').value.trim();
          const time = document.getElementById('mentoring-time').value.trim();
          const amount = Number(document.getElementById('mentoring-amount').value);
          
          const reqRes = await createHelpRequest(dc, {
            title: "Mentoring: " + title,
            description: desc,
            budget: 0,
            requesterId: activeMentoringTarget.id,
            category: 'MENTORING'
          });
          
          const newReqId = reqRes.data.helpRequest_insert.id;
          
          await createApplication(dc, {
            helpRequestId: newReqId,
            applicantId: userData.id,
            priceOffer: amount,
            message: "Expected Time: " + time
          });
          
          showToast('Mentoring proposal sent!');
          document.getElementById('dialog-mentoring-apply').close();
        } catch (err) {
          console.error(err);
          showToast('Error sending proposal: ' + err.message, 'error');
        } finally {
          btn.disabled = false;
          btn.textContent = 'Submit Proposal';
        }
      });
    }
  }
'''
content = content.replace("function setupEditProfile() {", mentoring_logic + "\n  function setupEditProfile() {")

# 8. setupMentoringDialog initialization
content = content.replace("setupEditProfile();", "setupEditProfile();\n    setupMentoringDialog();")


with open('src/main.js', 'w', encoding='utf-8') as f:
    f.write(content)
