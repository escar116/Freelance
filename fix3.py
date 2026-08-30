with open('src/main.js', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace('comment: #review-comment.value.trim(),', "comment: document.getElementById('review-comment').value.trim(),")
with open('src/main.js', 'w', encoding='utf-8') as f:
    f.write(content)
