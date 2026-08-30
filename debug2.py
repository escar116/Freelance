with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

s1 = js.find('card.innerHTML = ')
s1 = js.find('card.innerHTML = ', s1 + 1) # wait, there are many. Let's find inside renderMentoringGrid

start = js.find('function renderMentoringGrid(users)')
s1 = js.find('card.innerHTML = ', start)
s2 = js.find(';', s1)

old_card = js[s1:s2]

new_card = '''card.innerHTML = 
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
        
        <div class="flex justify-between items-center mt-auto" style="padding-top: 1rem; border-top: 1px solid var(--border-card);">
          <button type="button" class="btn btn-outline btn-sm view-profile-btn">View Profile</button>
          <button type="button" class="btn btn-purple btn-sm apply-mentor-btn">Apply</button>
        </div>'''

js = js[:s1] + new_card + js[s2:]

with open('src/main.js', 'w', encoding='utf-8') as f:
    f.write(js)
print("Replaced!")
