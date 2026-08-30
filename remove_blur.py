with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Remove the entire vp-loading-overlay div
old = '''<div id="vp-loading-overlay" class="hidden" style="position: absolute; top:0; left:0; width:100%; height:100%; background: rgba(255,255,255,0.7); backdrop-filter: blur(5px); z-index: 100; display: flex; flex-direction: column; justify-content: center; align-items: center; border-radius: 12px;">
                  <div class="loader mb-2"></div>
                  <p class="text-sm font-bold" style="color: var(--primary);">Loading profile...</p>
              </div>'''
html = html.replace(old, '')
print("HTML overlay removed" if old not in html else "FAILED to remove")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
