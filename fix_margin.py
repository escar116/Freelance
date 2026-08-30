with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Add specific mentoring grid styling with smaller gap
mentoring_css = """
/* Mentoring grid - tighter spacing */
#mentoring-users-grid.requests-grid {
    gap: 0.75rem;
}
#mentoring-users-grid .job-card {
    padding: 1rem 1.25rem;
    display: flex;
    flex-direction: column;
}
"""
css += mentoring_css

with open('style.css', 'w', encoding='utf-8') as f:
    f.write(css)
print("done")
