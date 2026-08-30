with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

skeleton_css = """
/* Skeleton Loader */
.skeleton-loader {
  background: var(--bg-card);
  background-image: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0) 100%), linear-gradient(var(--border-card) 100%, transparent 0);
  background-repeat: no-repeat;
  background-size: 200px 100%;
  background-position: -200px 0;
  animation: skeleton-sweep 1.4s ease-in-out infinite;
  border-radius: 6px;
  display: inline-block;
}
.skeleton-loader:empty::after { content: '\\00a0'; }
.skeleton-line { width: 100%; height: 14px; margin-bottom: 10px; }
.skeleton-line-short { width: 60%; height: 14px; margin-bottom: 10px; }
.skeleton-line-xs { width: 40%; height: 12px; margin-bottom: 8px; }
.skeleton-avatar { width: 64px; height: 64px; border-radius: 50%; }
.skeleton-badge { width: 80px; height: 24px; border-radius: 999px; }
.skeleton-title { width: 50%; height: 20px; margin-bottom: 12px; }
.skeleton-block { width: 100%; height: 60px; margin-bottom: 12px; }
@keyframes skeleton-sweep {
  to { background-position: 400px 0; }
}
"""

css += skeleton_css
with open('style.css', 'w', encoding='utf-8') as f:
    f.write(css)
print("CSS done")
