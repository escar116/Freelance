with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Replace the current opener to show skeleton instead of opacity trick
old = """window.openViewProfileDialog = async function(userId) {
  const vpDialog = document.getElementById('dialog-view-profile');
  vpDialog.showModal();
  // Show a simple loader while data loads
  const vpBody = document.getElementById('vp-body');
  if (vpBody) { vpBody.style.opacity = '0.3'; }
  const vpLoader = document.getElementById('vp-simple-loader');
  if (vpLoader) vpLoader.classList.remove('hidden');

  try {
    const res = await getUserProfile(dc, { id: userId }, SERVER_ONLY);
    const user = res.data.user;
    if (!user) return;"""

new = """window.openViewProfileDialog = async function(userId) {
  const vpDialog = document.getElementById('dialog-view-profile');
  const vpBody = document.getElementById('vp-body');
  const vpSkeleton = document.getElementById('vp-skeleton');
  vpDialog.showModal();
  if (vpBody) vpBody.classList.add('hidden');
  if (vpSkeleton) vpSkeleton.classList.remove('hidden');

  try {
    const res = await getUserProfile(dc, { id: userId }, SERVER_ONLY);
    const user = res.data.user;
    if (!user) return;"""

js = js.replace(old, new)

# Replace the end where we restore opacity
old_end = """    if (vpBody) { vpBody.style.opacity = '1'; }
    if (vpLoader) vpLoader.classList.add('hidden');
  } catch (err) {
    console.error('Error loading profile:', err);
    if (vpBody) { vpBody.style.opacity = '1'; }
    if (vpLoader) vpLoader.classList.add('hidden');
  }
}"""

new_end = """    if (vpBody) vpBody.classList.remove('hidden');
    if (vpSkeleton) vpSkeleton.classList.add('hidden');
  } catch (err) {
    console.error('Error loading profile:', err);
    if (vpBody) vpBody.classList.remove('hidden');
    if (vpSkeleton) vpSkeleton.classList.add('hidden');
  }
}"""

js = js.replace(old_end, new_end)

with open('src/main.js', 'w', encoding='utf-8') as f:
    f.write(js)
print("JS done")
