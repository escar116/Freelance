with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

# 1. Add the setTimeout at the beginning
old_start = """  vpDialog.showModal();
  if (vpBody) vpBody.classList.add('hidden');
  if (vpSkeleton) vpSkeleton.classList.remove('hidden');"""

new_start = """  vpDialog.showModal();
  if (vpBody) vpBody.classList.add('hidden');
  if (vpSkeleton) vpSkeleton.classList.remove('hidden');

  // User requested: Always hide skeleton after 1 second
  setTimeout(() => {
    if (vpBody) vpBody.classList.remove('hidden');
    if (vpSkeleton) vpSkeleton.classList.add('hidden');
  }, 1000);"""

js = js.replace(old_start, new_start)

# 2. Remove the finally block that was supposed to hide it (since the timeout handles it now)
import re
pattern = r'\}\s*catch\s*\(err\)\s*\{\s*console\.error\(\'Error loading profile:\',\s*err\);\s*\}\s*finally\s*\{\s*if \(vpBody\) vpBody\.classList\.remove\(\'hidden\'\);\s*if \(vpSkeleton\) vpSkeleton\.classList\.add\(\'hidden\'\);\s*\}'
replacement = """} catch (err) {
    console.error('Error loading profile:', err);
  }"""
js = re.sub(pattern, replacement, js)

with open('src/main.js', 'w', encoding='utf-8') as f:
    f.write(js)
print("Timeout fallback applied.")
