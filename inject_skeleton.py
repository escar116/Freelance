with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Remove the old blur overlay
old_blur = '''<div id="vp-loading-overlay" class="hidden" style="position: absolute; top:0; left:0; width:100%; height:100%; background: rgba(255,255,255,0.7); backdrop-filter: blur(5px); z-index: 100; display: flex; flex-direction: column; justify-content: center; align-items: center; border-radius: 12px;">
                <div class="loader mb-2"></div>
                <p class="text-sm font-bold" style="color: var(--primary);">Loading profile...</p>
            </div>'''

# Try with different indentation
if old_blur not in html:
    # find it with regex
    import re
    html = re.sub(r'<div id="vp-loading-overlay"[^>]*>.*?</div>\s*</div>', '', html, flags=re.DOTALL, count=1)
    # wait that might eat too many closing divs. Let me be more careful.
    # Reread
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()
    
    start = html.find('<div id="vp-loading-overlay"')
    if start != -1:
        # Find the closing </div> for the overlay - it has 2 child elements so 2 inner + 1 outer = find 3rd </div>
        pos = start
        depth = 0
        i = start
        while i < len(html):
            if html[i:i+4] == '<div':
                depth += 1
            elif html[i:i+6] == '</div>':
                depth -= 1
                if depth == 0:
                    end = i + 6
                    break
            i += 1
        overlay_html = html[start:end]
        html = html[:start] + html[end:]
        print("Removed overlay:", len(overlay_html), "chars")
    else:
        print("No overlay found")
else:
    html = html.replace(old_blur, '')
    print("Removed overlay exact match")

# Now add skeleton + vp-body wrapper
# Find the modal-header inside dialog-view-profile
target = '<div class="modal-header border-b pb-4 mb-4" style="border-color: var(--border-light);">'
idx = html.find('dialog-view-profile')
header_idx = html.find(target, idx)

skeleton_html = '''<div id="vp-skeleton" class="hidden" style="padding: 0.5rem 0;">
                <div style="display:flex; align-items:center; gap: 1rem; margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border-light);">
                  <div class="skeleton-loader skeleton-avatar"></div>
                  <div style="flex:1;">
                    <div class="skeleton-loader skeleton-title"></div>
                    <div class="skeleton-loader skeleton-badge"></div>
                  </div>
                </div>
                <div style="margin-bottom: 1.5rem;">
                  <div class="skeleton-loader skeleton-line-xs" style="width:30%; margin-bottom:12px;"></div>
                  <div class="skeleton-loader skeleton-line"></div>
                  <div class="skeleton-loader skeleton-line-short"></div>
                </div>
                <div style="margin-bottom: 1.5rem;">
                  <div class="skeleton-loader skeleton-line-xs" style="width:45%; margin-bottom:12px;"></div>
                  <div style="display:flex; gap:8px;">
                    <div class="skeleton-loader skeleton-badge"></div>
                    <div class="skeleton-loader skeleton-badge"></div>
                    <div class="skeleton-loader skeleton-badge"></div>
                  </div>
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.5rem;">
                  <div><div class="skeleton-loader skeleton-line-xs" style="width:60%;"></div><div class="skeleton-loader skeleton-line" style="width:80%;"></div></div>
                  <div><div class="skeleton-loader skeleton-line-xs" style="width:60%;"></div><div class="skeleton-loader skeleton-line" style="width:80%;"></div></div>
                </div>
                <div style="margin-bottom: 1.5rem;">
                  <div class="skeleton-loader skeleton-line-xs" style="width:35%; margin-bottom:12px;"></div>
                  <div class="skeleton-loader skeleton-block"></div>
                </div>
            </div>
            <div id="vp-body">
            '''

# Insert skeleton before modal-header, and wrap the rest with vp-body
html = html[:header_idx] + skeleton_html + html[header_idx:]

# Now close vp-body before the closing </div> of modal-content and </dialog>
# Find the </dialog> for dialog-view-profile
dialog_close = html.find('</dialog>', header_idx)
# The </div> right before </dialog> closes modal-content
last_div = html.rfind('</div>', header_idx, dialog_close)
html = html[:last_div] + '</div>\n            ' + html[last_div:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Skeleton + vp-body injected!")
