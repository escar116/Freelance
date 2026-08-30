import re

with open('src/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Update loadApplications
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

# In loadPostedJobs, filter out mentoring category
content = content.replace("const jobs = (res.data.helpRequests || []).filter(j => j.status === 'OPEN' || !j.status);",
"const jobs = (res.data.helpRequests || []).filter(j => (j.status === 'OPEN' || !j.status) && j.category !== 'MENTORING');")

# Add loadMentoringRequests function
mentoring_requests_logic = '''
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
        appsHtml = pending.map(app => 
          <div class="application-card">
            <div class="candidate-info">
              <strong class="cursor-pointer hover:underline" onclick="openViewProfileDialog('')"></strong>
              <div class="candidate-message">""</div>
            </div>
            <div class="candidate-offer">
              <strong></strong>
              <div class="flex gap-1 mt-1">
                <button type="button" class="btn btn-purple btn-sm" onclick="approveApplication('', '')">Accept</button>
                <button type="button" class="btn btn-outline btn-sm" style="border-color:#ef4444; color:#ef4444;" onclick="rejectApplication('')">Decline</button>
              </div>
            </div>
          </div>
        ).join('');
      }
      
      jobEl.innerHTML = 
        <div class="flex justify-between items-start mb-2">
          <div>
            <h3 class="job-title" style="margin: 0;"></h3>
            <p class="text-sm text-muted mt-1"></p>
          </div>
        </div>
        <div class="mt-4">
          <h4 class="text-sm font-bold mb-2">Mentoree Applications ()</h4>
          
        </div>
      ;
      container.appendChild(jobEl);
    });
  } catch(e) {
    console.error(e);
    container.innerHTML = '<div class="empty-state">Error loading mentoring requests.</div>';
  }
}
'''
content = content.replace("async function loadMyApplications(isSilent = false) {", mentoring_requests_logic + "\nasync function loadMyApplications(isSilent = false) {")


# Update setupApplicationTabs
content = content.replace(
'''function setupApplicationTabs() {
  ('#section-applications .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      appTab = btn.dataset.tab;
      ('#section-applications .tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      if (appTab === 'posted') {
        #posted-jobs-list.classList.remove('hidden');
        #my-applications-list.classList.add('hidden');
        loadPostedJobs();
      } else {
        #posted-jobs-list.classList.add('hidden');
        #my-applications-list.classList.remove('hidden');
        loadMyApplications();
      }
    });
  });
}''',
'''function setupApplicationTabs() {
  ('#section-applications .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      appTab = btn.dataset.tab;
      ('#section-applications .tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      #posted-jobs-list.classList.add('hidden');
      #my-applications-list.classList.add('hidden');
      if (document.getElementById('mentoring-requests-list')) document.getElementById('mentoring-requests-list').classList.add('hidden');
      
      if (appTab === 'posted') {
        #posted-jobs-list.classList.remove('hidden');
        loadPostedJobs();
      } else if (appTab === 'mentoring') {
        document.getElementById('mentoring-requests-list').classList.remove('hidden');
        loadMentoringRequests();
      } else {
        #my-applications-list.classList.remove('hidden');
        loadMyApplications();
      }
    });
  });
}'''
)


with open('src/main.js', 'w', encoding='utf-8') as f:
    f.write(content)
