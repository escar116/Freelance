with open('style.css', 'a', encoding='utf-8') as f:
    f.write("""
/* Modal Form UI Fixes */
.modal-content .form-group {
    margin-bottom: 1rem;
}
.modal-content label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--text-heading);
}
.modal-content .input, .modal-content textarea {
    background: #ffffff;
    border: 1px solid var(--border-card);
    color: var(--text-heading);
    padding: 0.75rem 1rem;
    border-radius: var(--radius-md);
    width: 100%;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    transition: border-color 0.2s;
}
.modal-content .input:focus, .modal-content textarea:focus {
    border-color: var(--color-purple);
    outline: none;
    box-shadow: 0 0 0 3px rgba(124, 108, 248, 0.2);
}
.modal-content textarea {
    resize: vertical;
}

/* Ensure edit profile btn isn't huge on mobile */
@media (max-width: 768px) {
    .edit-profile-pill-btn {
        width: 100%;
        justify-content: center;
        margin-top: 1rem;
    }
}
""")
