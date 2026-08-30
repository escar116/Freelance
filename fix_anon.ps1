import base64
script = b'''
import re
with open('src/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

# In loadProfile, before renderReviewsProfile(reviews);
content = content.replace('renderReviewsProfile(reviews);', 
    'for(let r of reviews) { if(!r.reviewerName && r.reviewerId) { try { const res = await getUserProfile(dc, { id: r.reviewerId }); if(res.data.user) r.reviewerName = res.data.user.fullName; } catch(e){} } }\n    renderReviewsProfile(reviews);')

# In openViewProfileDialog, before calculate sum
content = content.replace('let sum = 0;\n    reviews.forEach(r => sum += r.rating);',
    'for(let r of reviews) { if(!r.reviewerName && r.reviewerId) { try { const res = await getUserProfile(dc, { id: r.reviewerId }); if(res.data.user) r.reviewerName = res.data.user.fullName; } catch(e){} } }\n    let sum = 0;\n    reviews.forEach(r => sum += r.rating);')

# Also, change 'Anonymous' fallback to 'Student' so we don't show Anonymous.
content = content.replace(\": 'Anonymous')\", \": 'Student')\")

with open('src/main.js', 'w', encoding='utf-8') as f:
    f.write(content)
'''
with open('fix_anon.py', 'wb') as f:
    f.write(script)
