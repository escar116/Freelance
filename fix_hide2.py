with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

import re

# Match the end we just created
pattern = r'renderReviewsProfile\(reviews\);\s*if \(vpBody\) vpBody\.classList\.remove\(\'hidden\'\);\s*if \(vpSkeleton\) vpSkeleton\.classList\.add\(\'hidden\'\);\s*\}\s*catch\s*\(err\)\s*\{\s*console\.error\(\'Error loading profile:\',\s*err\);\s*if \(vpBody\) vpBody\.classList\.remove\(\'hidden\'\);\s*if \(vpSkeleton\) vpSkeleton\.classList\.add\(\'hidden\'\);\s*\}'

match = re.search(pattern, js)
if match:
    new_end = """    renderReviewsProfile(reviews);
  } catch (err) {
    console.error('Error loading profile:', err);
  } finally {
    if (vpBody) vpBody.classList.remove('hidden');
    if (vpSkeleton) vpSkeleton.classList.add('hidden');
  }"""
    js = js[:match.start()] + new_end + js[match.end():]
    with open('src/main.js', 'w', encoding='utf-8') as f:
        f.write(js)
    print("Fixed hide logic to use finally!")
else:
    print("Could not find the block to upgrade to finally.")

