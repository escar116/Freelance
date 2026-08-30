with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Extract the modal-header from vp-body
# Current structure:
# <div id="vp-skeleton" class="hidden" style="padding: 0.5rem 0;">...</div>
# <div id="vp-body">
#    <div class="modal-header border-b pb-4 mb-4" style="border-color: var(--border-light);">...</div>

import re

# Let's find vp-skeleton and replace it entirely
skel_start = html.find('<div id="vp-skeleton"')
skel_end = html.find('<div id="vp-body">', skel_start)
if skel_start != -1 and skel_end != -1:
    print("Found skeleton block")
else:
    print("Error finding skeleton block")

# Let's also find the modal-header inside vp-body
header_start = html.find('<div class="modal-header border-b pb-4 mb-4"', skel_end)
header_end = html.find('</div>', html.find('</button>', header_start)) + 6

# Reconstruct the middle part
new_skeleton = """
        <div id="vp-skeleton" class="hidden">
            <div class="profile-hero mb-6">
                <div class="skeleton-loader skeleton-avatar" style="width: 80px; height: 80px; border-radius: 50%; flex-shrink: 0;"></div>
                <div class="profile-hero-info" style="flex:1;">
                    <div class="flex items-center gap-3">
                        <div class="skeleton-loader skeleton-title" style="width: 150px;"></div>
                        <div class="skeleton-loader skeleton-badge" style="width: 70px;"></div>
                    </div>
                    <div class="skeleton-loader skeleton-badge mt-2" style="width: 80px;"></div>
                </div>
            </div>

            <div class="credentials-card" style="padding: 1.5rem; background: var(--bg-card); border: 1px solid var(--border-card); border-radius: var(--radius-card);">
                <!-- About Me -->
                <div class="mb-5 pb-5 border-b" style="border-color: var(--border-card);">
                    <div class="skeleton-loader skeleton-line-short" style="width: 120px; margin-bottom: 1rem;"></div>
                    <div class="skeleton-loader skeleton-line"></div>
                    <div class="skeleton-loader skeleton-line" style="width: 80%;"></div>
                </div>

                <!-- Skills -->
                <div class="mb-5 pb-5 border-b" style="border-color: var(--border-card);">
                    <div class="skeleton-loader skeleton-line-short" style="width: 180px; margin-bottom: 1rem;"></div>
                    <div class="flex gap-2">
                        <div class="skeleton-loader skeleton-badge" style="width: 60px;"></div>
                        <div class="skeleton-loader skeleton-badge" style="width: 80px;"></div>
                        <div class="skeleton-loader skeleton-badge" style="width: 70px;"></div>
                    </div>
                </div>

                <!-- Credentials -->
                <div class="mb-5 pb-5 border-b" style="border-color: var(--border-card);">
                    <div class="skeleton-loader skeleton-line-short" style="width: 200px; margin-bottom: 1rem;"></div>
                    <div class="flex gap-4">
                        <div style="flex: 1;">
                            <div class="skeleton-loader skeleton-line-xs" style="width: 100px; margin-bottom: 0.5rem;"></div>
                            <div class="skeleton-loader skeleton-line-short" style="width: 140px;"></div>
                        </div>
                        <div style="flex: 1;">
                            <div class="skeleton-loader skeleton-line-xs" style="width: 80px; margin-bottom: 0.5rem;"></div>
                            <div class="skeleton-loader skeleton-line-short" style="width: 100px;"></div>
                        </div>
                    </div>
                </div>

                <!-- Stats -->
                <div class="mb-5 pb-5 border-b" style="border-color: var(--border-card);">
                    <div class="skeleton-loader skeleton-line-short" style="width: 150px; margin-bottom: 1rem;"></div>
                    <div class="flex justify-between">
                        <div style="flex: 1;">
                            <div class="skeleton-loader skeleton-line-xs" style="width: 80px; margin-bottom: 0.5rem;"></div>
                            <div class="skeleton-loader skeleton-line-short" style="width: 100px; margin-bottom: 0.5rem;"></div>
                            <div class="skeleton-loader skeleton-line-short" style="width: 100px; margin-bottom: 0.5rem;"></div>
                            <div class="skeleton-loader skeleton-line-short" style="width: 100px;"></div>
                        </div>
                        <div style="flex: 1;">
                            <div class="skeleton-loader skeleton-line-xs" style="width: 80px; margin-bottom: 0.5rem;"></div>
                            <div class="skeleton-loader skeleton-line-short" style="width: 100px; margin-bottom: 0.5rem;"></div>
                            <div class="skeleton-loader skeleton-line-short" style="width: 100px; margin-bottom: 0.5rem;"></div>
                            <div class="skeleton-loader skeleton-line-short" style="width: 100px;"></div>
                        </div>
                    </div>
                </div>

                <!-- Feedback -->
                <div>
                    <div class="skeleton-loader skeleton-line-short" style="width: 160px; margin-bottom: 1rem;"></div>
                    <div class="flex items-center gap-4">
                        <div class="skeleton-loader skeleton-title" style="width: 60px; height: 40px; margin: 0;"></div>
                        <div class="skeleton-loader skeleton-line-xs" style="width: 150px;"></div>
                    </div>
                    <div class="mt-4 flex justify-center">
                        <div class="skeleton-loader skeleton-line-xs" style="width: 120px;"></div>
                    </div>
                </div>
            </div>
        </div>
"""

header_html = html[header_start:header_end]

# Reconstruction:
# ... html before skeleton ...
# header_html
# new_skeleton
# <div id="vp-body">
# ... html after header_html ...

new_html = html[:skel_start] + header_html + new_skeleton + '\n        <div id="vp-body">\n' + html[header_end:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_html)

print("Done restructuring layout")
