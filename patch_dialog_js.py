import re

with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

# 1. Show the dialog and loading overlay immediately inside window.openViewProfileDialog
target_start = """window.openViewProfileDialog = async function(userId) {
  try {"""
replacement_start = """window.openViewProfileDialog = async function(userId) {
  const dialog = document.getElementById('dialog-view-profile');
  const overlay = document.getElementById('vp-loading-overlay');
  if (dialog) dialog.showModal();
  if (overlay) overlay.style.display = 'flex';
  
  try {"""
js = js.replace(target_start, replacement_start)

# 2. Hide loading overlay at the end
# Since we have a try-catch block without a finally, let's inject a finally block.
# Wait, let's just add it at the end of the try block, and inside the catch block.
# Let's search for "console.error('Error loading profile:', err);"
target_end = """    } catch (err) {
    console.error('Error loading profile:', err);
  }
}"""
replacement_end = """    } catch (err) {
    console.error('Error loading profile:', err);
  } finally {
    const overlay = document.getElementById('vp-loading-overlay');
    if (overlay) overlay.style.display = 'none';
  }
}"""
js = js.replace(target_end, replacement_end)

# Also remove the original dialog.showModal() which is probably at the end of 	ry block.
# document.getElementById('dialog-view-profile').showModal();
js = js.replace("document.getElementById('dialog-view-profile').showModal();", "")

# 3. Remove document.getElementById('vp-program').textContent = ...
# The user wants "remove the student below it". The html no longer has p-program, but let's remove it from JS too to avoid null reference if it wasn't optional.
# actually, getElementById('vp-program') might throw error if we set .textContent on null. Let's see:
js = re.sub(r"document\.getElementById\('vp-program'\)\.textContent = [^;]+;", "", js)


with open('src/main.js', 'w', encoding='utf-8') as f:
    f.write(js)
