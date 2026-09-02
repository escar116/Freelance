with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

utilities = """
.flex-wrap { flex-wrap: wrap; }
.truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.search-bar {
    display: flex;
    align-items: center;
    background: var(--bg-card);
    border: 1px solid var(--border-light);
    border-radius: var(--radius-md);
    padding: 0.5rem 1rem;
    gap: 0.5rem;
    width: 100%;
}
.search-input {
    border: none;
    background: transparent;
    outline: none;
    flex: 1;
    color: var(--text-heading);
    font-family: inherit;
    font-size: 14px;
}
"""

with open('style.css', 'a', encoding='utf-8') as f:
    f.write(utilities)
