import re

with open('src/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Add loadMentoring to navigateTo
content = content.replace("else if (section === 'services') loadServices();", "else if (section === 'services') loadServices();\n  else if (section === 'mentoring') loadMentoring();")

# We need a global variable to store the target mentor
globals_block = "let activeMentoringTarget = null;"
content = content.replace("let adminSearchQuery = '';", "let adminSearchQuery = '';\n" + globals_block)

# Add loadMentoring and setupMentoringDialog
mentoring_logic = '''
// ── Mentoring ────────────────────────────────────────────────────────────────
let allUsersData = [];

async function loadMentoring() {
  const grid = document.getElementById('mentoring-users-grid');
  if (grid.children.length === 0 || grid.querySelector('.loader')) {
    grid.innerHTML = '<div class="loader"></div>';
  }
  
  try {
    const res = await listAllUsers(dc);
    let users = res.data.users || [];
    // exclude self
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
    
    // Display skills as small badges
    const skills = u.skills || [];
    let skillsHtml = '';
    if (skills.length > 0) {
      skillsHtml = '<div class="mt-2 mb-3 flex flex-wrap gap-1">' + skills.slice(0, 5).map(s => <span class="badge" style="background: rgba(255,255,255,0.05);"></span>).join('') + (skills.length > 5 ? '<span class="text-xs text-muted">+' + (skills.length - 5) + '</span>' : '') + '</div>';
    } else {
      skillsHtml = '<div class="mt-2 mb-3 text-xs text-muted">No skills listed</div>';
    }

    card.innerHTML = 
      <div class="flex items-center gap-3 mb-3">
        <div class="avatar cursor-pointer" onclick="openViewProfileDialog('')"></div>
        <div>
          <h3 class="job-title cursor-pointer hover:underline" style="margin:0;" onclick="openViewProfileDialog('')"></h3>
          <p class="text-sm text-muted"></p>
        </div>
      </div>
      <p class="text-sm text-muted mb-2 line-clamp-2"></p>
      
      <div class="flex justify-between items-center mt-auto" style="padding-top: 1rem; border-top: 1px solid var(--border-card);">
        <button type="button" class="btn btn-outline btn-sm view-profile-btn">View Profile</button>
        <button type="button" class="btn btn-purple btn-sm apply-mentor-btn">Apply for Mentoring</button>
      </div>
    ;
    
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
        
        // Mentoring architectural workaround:
        // We create a HelpRequest assigned TO the Mentor (requesterId = mentor), with category = 'MENTORING'
        const reqRes = await createHelpRequest(dc, {
          title: "Mentoring: " + title,
          description: desc,
          budget: 0,
          requesterId: activeMentoringTarget.id,
          category: 'MENTORING'
        });
        
        const newReqId = reqRes.data.helpRequest_insert.id;
        
        // Then the Mentoree (current user) creates an Application to it
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

content = content.replace('// ── Admin Dashboard & Platform Intelligence', mentoring_logic + '\n// ── Admin Dashboard & Platform Intelligence')

content = content.replace('setupEditProfile();', 'setupEditProfile();\n  setupMentoringDialog();')


with open('src/main.js', 'w', encoding='utf-8') as f:
    f.write(content)
