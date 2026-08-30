with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Add a simple centered loader and wrap the body content
old_header = '''<div class="modal-header border-b pb-4 mb-4" style="border-color: var(--border-light);">
                  <h2 style="font-size: 1.5rem;">User Profile</h2>'''

new_header = '''<div id="vp-simple-loader" class="hidden" style="text-align:center; padding: 3rem 0;">
                  <div class="loader"></div>
                  <p class="text-sm text-muted mt-3">Loading profile...</p>
              </div>
              <div id="vp-body" style="transition: opacity 0.2s ease;">
              <div class="modal-header border-b pb-4 mb-4" style="border-color: var(--border-light);">
                  <h2 style="font-size: 1.5rem;">User Profile</h2>'''

html = html.replace(old_header, new_header)

# Close the vp-body div before the dialog close
# Find the close button at the end of dialog-view-profile
old_close = '''<button type="button" class="dialog-close-btn" style'''
# Actually let me find the end of dialog-view-profile content
# The closing </div> for modal-content is what we need
# Let's add closing </div> for vp-body right before the last </div> of modal-content

# Find dialog-view-profile section end
idx = html.find('id="dialog-view-profile"')
# Find the </dialog> for it
dialog_end = html.find('</dialog>', idx)
# The </div> right before </dialog> closes modal-content
# We need to add </div> for vp-body before that
last_div = html.rfind('</div>', idx, dialog_end)
html = html[:last_div] + '</div>\n              ' + html[last_div:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("done")
