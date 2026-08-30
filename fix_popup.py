with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

# The fix: move showModal to the TOP of the function, before the data fetch
# and show a simple loader in the dialog content while waiting

old = """window.openViewProfileDialog = async function(userId) {

  try {
    const res = await getUserProfile(dc, { id: userId }, SERVER_ONLY);
    const user = res.data.user;
    if (!user) return;"""

new = """window.openViewProfileDialog = async function(userId) {
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

js = js.replace(old, new)

# Remove the old showModal at the bottom of try
js = js.replace("    document.getElementById('dialog-view-profile').showModal();\n  } catch (err) {\n    console.error('Error loading profile:', err);\n  }\n}", """    if (vpBody) { vpBody.style.opacity = '1'; }
    if (vpLoader) vpLoader.classList.add('hidden');
  } catch (err) {
    console.error('Error loading profile:', err);
    if (vpBody) { vpBody.style.opacity = '1'; }
    if (vpLoader) vpLoader.classList.add('hidden');
  }
}""")

with open('src/main.js', 'w', encoding='utf-8') as f:
    f.write(js)
print("done")
