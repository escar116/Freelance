import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Nav button text: Find Services -> Services
content = content.replace('<span class="nav-btn-label">Find Services</span>', '<span class="nav-btn-label">Services</span>')

# 2. Page Header Title: Find Services -> Services
# Let's find the header for section-services
import re
content = re.sub(r'(<section id="section-services".*?)(<h1 class="page-title">)Find Services(<\/h1>)', r'\1\2Services\3', content, flags=re.DOTALL)

# 3. Page Header Description: add/change to "Post and apply for quick services"
# Let's find the current paragraph under that h1
# It might say "Browse available freelance gigs or post your own."
# The user wants: "Post and apply for quick services" but "fix the sentence im not confident in it".
# How about: "Post service requests and apply for quick gigs around campus." or "Post and apply for quick, on-demand technical services."
desc = '<p class="text-muted">Post and apply for quick, on-demand technical services.</p>'
content = re.sub(r'(<section id="section-services".*?<h1 class="page-title">Services<\/h1>\s*)<p class="text-muted">.*?<\/p>', r'\1' + desc, content, flags=re.DOTALL)

# 4. "Post a job" -> "Post a Service"
content = content.replace('Post a Job', 'Post a Service')
content = content.replace('Post a job', 'Post a Service')

# 5. Add a margin to the mentoring page search bar
# Search bar is in mentoring hub, probably class="search-filter-panel mb-6" or similar.
# Let's add mb-4 or mt-4 to the search-input or search-bar.
# Currently: 
# <div class="search-bar">
#    <svg ...></svg>
#    <input type="text" id="mentoring-search-input" class="search-input" placeholder="...">
# </div>
# The search-bar might need margin-bottom. Let's do class="search-bar mb-4"
content = content.replace('<input type="text" id="mentoring-search-input" class="search-input"', '<input type="text" id="mentoring-search-input" class="search-input mt-2 mb-2"')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
