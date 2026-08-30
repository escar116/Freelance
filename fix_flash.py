with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

# 1. Fix: Clear all profile fields BEFORE showing skeleton to prevent old data flash
old_open = """window.openViewProfileDialog = async function(userId) {
  const vpDialog = document.getElementById('dialog-view-profile');
  const vpBody = document.getElementById('vp-body');
  const vpSkeleton = document.getElementById('vp-skeleton');
  vpDialog.showModal();
  if (vpBody) vpBody.classList.add('hidden');
  if (vpSkeleton) vpSkeleton.classList.remove('hidden');"""

new_open = """window.openViewProfileDialog = async function(userId) {
  const vpDialog = document.getElementById('dialog-view-profile');
  const vpBody = document.getElementById('vp-body');
  const vpSkeleton = document.getElementById('vp-skeleton');
  // Clear old data so it never flashes
  document.getElementById('vp-avatar').textContent = '';
  document.getElementById('vp-name').textContent = '';
  document.getElementById('vp-student-id').textContent = '';
  if (document.getElementById('vp-faculty')) document.getElementById('vp-faculty').textContent = '';
  if (document.getElementById('vp-bio')) document.getElementById('vp-bio').textContent = '';
  if (document.getElementById('vp-skills')) document.getElementById('vp-skills').innerHTML = '';
  ['vp-app-pending','vp-app-completed','vp-app-terminated','vp-emp-pending','vp-emp-completed','vp-emp-terminated'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = '0'; });
  if (document.getElementById('profile-feedback-list')) document.getElementById('profile-feedback-list').innerHTML = '';
  if (document.getElementById('ratings-feedback-list')) document.getElementById('ratings-feedback-list').innerHTML = '';
  if (document.getElementById('ratings-avg-score')) document.getElementById('ratings-avg-score').textContent = '0.0';
  if (document.getElementById('ratings-total-count')) document.getElementById('ratings-total-count').textContent = '';
  vpDialog.showModal();
  if (vpBody) vpBody.classList.add('hidden');
  if (vpSkeleton) vpSkeleton.classList.remove('hidden');"""

js = js.replace(old_open, new_open)

# 2. Fix mentoring card: name + rating on same line, remove "Student" text
old_card = """      card.innerHTML = `
        <div class="flex items-center gap-3 mb-3">
          <div class="avatar cursor-pointer" onclick="openViewProfileDialog('${u.id}')">${initials(u.fullName)}</div>
          <div class="flex-1">
            <div class="flex justify-between items-center">
              <h3 class="job-title cursor-pointer hover:underline" style="margin:0;" onclick="openViewProfileDialog('${u.id}')">${u.fullName}</h3>
              <span class="flex items-center gap-1 text-sm font-bold" style="color: var(--color-amber);">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                ${u.rating || 'New'}
              </span>
            </div>
          </div>
        </div>"""

# Check if this exists
if old_card in js:
    print("FOUND mentoring card - already patched")
else:
    print("Mentoring card NOT found - checking original")
    # Check for the original unpatched version
    check = js.find("u.preferredRole || 'Student'")
    if check != -1:
        print("Found original at", check)
    else:
        print("Neither version found")

with open('src/main.js', 'w', encoding='utf-8') as f:
    f.write(js)
print("Clear-data patch applied")
