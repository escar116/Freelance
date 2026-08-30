with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace the simple loader with a skeleton layout that mirrors the profile structure
old_loader = '''<div id="vp-simple-loader" class="hidden" style="text-align:center; padding: 3rem 0;">
                  <div class="loader"></div>
                  <p class="text-sm text-muted mt-3">Loading profile...</p>
              </div>'''

skeleton = '''<div id="vp-skeleton" class="hidden" style="padding: 0.5rem 0;">
                  <!-- Skeleton header -->
                  <div style="display:flex; align-items:center; gap: 1rem; margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border-light);">
                    <div class="skeleton-loader skeleton-avatar"></div>
                    <div style="flex:1;">
                      <div class="skeleton-loader skeleton-title"></div>
                      <div class="skeleton-loader skeleton-badge"></div>
                    </div>
                  </div>
                  <!-- Skeleton body -->
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
                    <div>
                      <div class="skeleton-loader skeleton-line-xs" style="width:60%;"></div>
                      <div class="skeleton-loader skeleton-line" style="width:80%;"></div>
                    </div>
                    <div>
                      <div class="skeleton-loader skeleton-line-xs" style="width:60%;"></div>
                      <div class="skeleton-loader skeleton-line" style="width:80%;"></div>
                    </div>
                  </div>
                  <div style="margin-bottom: 1.5rem;">
                    <div class="skeleton-loader skeleton-line-xs" style="width:35%; margin-bottom:12px;"></div>
                    <div class="skeleton-loader skeleton-block"></div>
                  </div>
              </div>'''

html = html.replace(old_loader, skeleton)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("HTML done")
