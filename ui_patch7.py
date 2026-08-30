with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Update stats colors
old_stats = '''<div><span class="font-bold">Pending:</span> <span style="color: var(--status-pending); font-weight: bold;" id="vp-app-pending">0</span></div>
                                <div><span class="font-bold">Completed:</span> <span style="color: var(--status-completed); font-weight: bold;" id="vp-app-completed">0</span></div>
                                <div><span class="font-bold">Terminated:</span> <span style="color: var(--status-terminated); font-weight: bold;" id="vp-app-terminated">0</span></div>'''
new_stats = '''<div style="color: var(--status-pending);"><span class="font-bold">Pending:</span> <span class="font-bold" id="vp-app-pending">0</span></div>
                                <div style="color: var(--status-completed);"><span class="font-bold">Completed:</span> <span class="font-bold" id="vp-app-completed">0</span></div>
                                <div style="color: var(--status-terminated);"><span class="font-bold">Terminated:</span> <span class="font-bold" id="vp-app-terminated">0</span></div>'''
html = html.replace(old_stats, new_stats)

old_stats2 = '''<div><span class="font-bold">Pending:</span> <span style="color: var(--status-pending); font-weight: bold;" id="vp-emp-pending">0</span></div>
                                <div><span class="font-bold">Completed:</span> <span style="color: var(--status-completed); font-weight: bold;" id="vp-emp-completed">0</span></div>
                                <div><span class="font-bold">Terminated:</span> <span style="color: var(--status-terminated); font-weight: bold;" id="vp-emp-terminated">0</span></div>'''
new_stats2 = '''<div style="color: var(--status-pending);"><span class="font-bold">Pending:</span> <span class="font-bold" id="vp-emp-pending">0</span></div>
                                <div style="color: var(--status-completed);"><span class="font-bold">Completed:</span> <span class="font-bold" id="vp-emp-completed">0</span></div>
                                <div style="color: var(--status-terminated);"><span class="font-bold">Terminated:</span> <span class="font-bold" id="vp-emp-terminated">0</span></div>'''
html = html.replace(old_stats2, new_stats2)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
