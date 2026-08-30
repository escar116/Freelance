import re
with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

old_render = '''      card.innerHTML = 
        <div class="flex items-center gap-3 mb-3">
          <div class="avatar cursor-pointer" onclick="openViewProfileDialog('')"></div>
          <div>
            <h3 class="job-title cursor-pointer hover:underline" style="margin:0;" onclick="openViewProfileDialog('')"></h3>
            <p class="text-sm text-muted"></p>
          </div>
        </div>
        <p class="text-sm text-muted mb-2 line-clamp-2"></p>
        
        <div class="flex justify-between items-center mt-auto" style="padding-top: 1rem; border-top: 1px solid var(--border-card);">'''

new_render = '''      card.innerHTML = 
        <div class="flex items-center gap-3 mb-3">
          <div class="avatar cursor-pointer" onclick="openViewProfileDialog('')"></div>
          <div class="flex-1">
            <div class="flex justify-between items-center">
              <h3 class="job-title cursor-pointer hover:underline" style="margin:0;" onclick="openViewProfileDialog('')"></h3>
              <span class="flex items-center gap-1 text-sm font-bold" style="color: var(--color-amber);">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                
              </span>
            </div>
          </div>
        </div>
        <p class="text-sm text-muted mb-2 line-clamp-2"></p>
        
        <div class="flex justify-between items-center mt-auto" style="padding-top: 1rem; border-top: 1px solid var(--border-card);">'''

js = js.replace(old_render, new_render)
with open('src/main.js', 'w', encoding='utf-8') as f:
    f.write(js)
