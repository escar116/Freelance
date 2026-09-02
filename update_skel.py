import re
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace vp-skeleton
m = re.search(r'<div id="vp-skeleton" class="hidden">.*?<div id="vp-body">', html, re.DOTALL)
if m:
    vp_skeleton_old = m.group(0)
    vp_skeleton_new = """<div id="vp-skeleton" class="hidden">
            <div class="profile-hero mb-6" style="display: flex; flex-wrap: wrap; gap: 2rem; position: relative;">
                <div class="skeleton-loader skeleton-avatar" style="width: 80px; height: 80px; border-radius: 50%; flex-shrink: 0;"></div>
                <div class="profile-hero-info" style="flex:1; min-width: 250px;">
                    <div class="flex items-center gap-3 flex-wrap">
                        <div class="skeleton-loader skeleton-title" style="width: 150px;"></div>
                        <div class="skeleton-loader skeleton-badge" style="width: 70px;"></div>
                    </div>
                    <div class="skeleton-loader skeleton-line-short mt-2" style="width: 200px;"></div>
                    <div class="skeleton-loader skeleton-badge mt-2" style="width: 80px;"></div>
                    
                    <div class="mt-4 pt-4 border-t" style="border-color: var(--border-light); display: flex; gap: 2rem; flex-wrap: wrap;">
                        <div>
                            <div class="skeleton-loader skeleton-line-xs" style="width: 100px; margin-bottom: 0.5rem;"></div>
                            <div class="skeleton-loader skeleton-line-short" style="width: 120px;"></div>
                        </div>
                        <div>
                            <div class="skeleton-loader skeleton-line-xs" style="width: 80px; margin-bottom: 0.5rem;"></div>
                            <div class="skeleton-loader skeleton-line-short" style="width: 100px;"></div>
                        </div>
                    </div>
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

                <!-- Stats & Feedback Compact -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
                    <div>
                        <div class="skeleton-loader skeleton-line-short" style="width: 150px; margin-bottom: 1rem;"></div>
                        <div class="flex items-center gap-4">
                            <div class="skeleton-loader skeleton-title" style="width: 60px; height: 40px; margin: 0;"></div>
                            <div class="skeleton-loader skeleton-line-xs" style="width: 100px;"></div>
                        </div>
                    </div>
                    <div>
                        <div class="skeleton-loader skeleton-line-short" style="width: 150px; margin-bottom: 1rem;"></div>
                        <div class="flex gap-4">
                            <div>
                                <div class="skeleton-loader skeleton-line-xs" style="width: 80px; margin-bottom: 0.5rem;"></div>
                                <div class="skeleton-loader skeleton-line-short" style="width: 80px; margin-bottom: 0.5rem;"></div>
                                <div class="skeleton-loader skeleton-line-short" style="width: 80px; margin-bottom: 0.5rem;"></div>
                                <div class="skeleton-loader skeleton-line-short" style="width: 80px;"></div>
                            </div>
                            <div>
                                <div class="skeleton-loader skeleton-line-xs" style="width: 80px; margin-bottom: 0.5rem;"></div>
                                <div class="skeleton-loader skeleton-line-short" style="width: 80px; margin-bottom: 0.5rem;"></div>
                                <div class="skeleton-loader skeleton-line-short" style="width: 80px; margin-bottom: 0.5rem;"></div>
                                <div class="skeleton-loader skeleton-line-short" style="width: 80px;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
<div id="vp-body">"""

    html = html.replace(vp_skeleton_old, vp_skeleton_new)
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("vp-skeleton replaced")
else:
    print("Could not match vp-skeleton")
