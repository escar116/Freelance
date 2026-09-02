import re

with open('src/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Replace both template blocks in main.js
old_html = """        <div class="feedback-item mb-4 pb-4" style="border-bottom: 1px solid var(--border-card);">
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <div style="width: 32px; height: 32px; border-radius: 50%; background-color: var(--color-primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 12px; flex-shrink: 0;">${initial}</div>
                <strong style="color: var(--text-heading); font-size: 0.95rem;">${name}</strong>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <span style="color: #1a73e8; font-size: 0.85rem; letter-spacing: 1px;">${stars}</span>
                <span class="text-xs text-muted">${dateStr}</span>
            </div>
            <p class="text-sm" style="color: var(--text-heading); line-height: 1.5; margin: 0;">${r.comment || ''}</p>
        </div>"""

new_html = """        <div class="feedback-item mb-4 pb-4" style="border-bottom: 1px solid var(--border-card);">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                <div style="display: flex; align-items: center;">
                    <div style="width: 32px; height: 32px; border-radius: 50%; background-color: #1a73e8; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 12px; flex-shrink: 0; font-size: 1.1rem;">${initial}</div>
                    <strong style="color: var(--text-heading); font-size: 0.95rem;">${name}</strong>
                </div>
                <div style="color: var(--text-muted); cursor: pointer; padding: 4px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/></svg>
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                <span style="color: #1a73e8; font-size: 0.85rem; letter-spacing: 1px;">${stars}</span>
                <span class="text-xs text-muted">${dateStr}</span>
            </div>
            <p class="text-sm" style="color: var(--text-heading); line-height: 1.5; margin: 0; word-break: break-word;">${r.comment || ''}</p>
        </div>"""

# Replace all occurrences
js = js.replace(old_html, new_html)

old_html2 = """    <div class="feedback-item mb-4 pb-4" style="border-bottom: 1px solid var(--border-card);">
        <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background-color: var(--color-primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 12px; flex-shrink: 0;">${initial}</div>
            <strong style="color: var(--text-heading); font-size: 0.95rem;">${name}</strong>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <span style="color: #1a73e8; font-size: 0.85rem; letter-spacing: 1px;">${stars}</span>
            <span class="text-xs text-muted">${dateStr}</span>
        </div>
        <p class="text-sm" style="color: var(--text-heading); line-height: 1.5; margin: 0;">${r.comment || ''}</p>
    </div>"""

new_html2 = """    <div class="feedback-item mb-4 pb-4" style="border-bottom: 1px solid var(--border-card);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <div style="display: flex; align-items: center;">
                <div style="width: 32px; height: 32px; border-radius: 50%; background-color: #1a73e8; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 12px; flex-shrink: 0; font-size: 1.1rem;">${initial}</div>
                <strong style="color: var(--text-heading); font-size: 0.95rem;">${name}</strong>
            </div>
            <div style="color: var(--text-muted); cursor: pointer; padding: 4px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/></svg>
            </div>
        </div>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
            <span style="color: #1a73e8; font-size: 0.85rem; letter-spacing: 1px;">${stars}</span>
            <span class="text-xs text-muted">${dateStr}</span>
        </div>
        <p class="text-sm" style="color: var(--text-heading); line-height: 1.5; margin: 0; word-break: break-word;">${r.comment || ''}</p>
    </div>"""

js = js.replace(old_html2, new_html2)

with open('src/main.js', 'w', encoding='utf-8') as f:
    f.write(js)

