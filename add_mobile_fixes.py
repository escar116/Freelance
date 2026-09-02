with open('style.css', 'a', encoding='utf-8') as f:
    f.write("""
/* Mentoring Page Mobile Fixes */
.job-card .flex-1 {
    min-width: 0;
}
.job-title {
    word-wrap: break-word;
    white-space: normal;
}
.search-icon {
    flex-shrink: 0;
}
@media (max-width: 768px) {
    .mentoring-search {
        width: 44px;
        height: 44px;
        padding: 0;
        justify-content: center;
        overflow: hidden;
        transition: width 0.3s ease, border-radius 0.3s ease;
        border-radius: 22px;
        cursor: pointer;
    }
    .mentoring-search:focus-within {
        width: 100%;
        max-width: 300px;
        justify-content: flex-start;
        padding: 0.5rem 1rem;
        border-radius: var(--radius-md);
        cursor: text;
    }
    .mentoring-search .search-input {
        display: none;
    }
    .mentoring-search:focus-within .search-input {
        display: block;
        width: 100%;
    }
}
@media (min-width: 769px) {
    .mentoring-search {
        max-width: 350px;
    }
}
""")
