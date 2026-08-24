import re

with open('src/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Add Firestore imports
content = content.replace(
    "import { getDatabase, ref, push, onChildAdded, serverTimestamp, off, get } from 'firebase/database';",
    "import { getDatabase, ref, push, onChildAdded, serverTimestamp, off, get } from 'firebase/database';\nimport { getFirestore, collection, addDoc, getDocs, query, where, serverTimestamp as firestoreTimestamp } from 'firebase/firestore';"
)

# Initialize firestore
content = content.replace(
    "const db = getDatabase(app);",
    "const db = getDatabase(app);\nconst firestore = getFirestore(app);"
)

# Replace createReview with Firestore
content = re.sub(
    r'await createReview\(dc,\s*\{\s*rating:\s*selectedRating,\s*comment:\s*\$\(\'#review-comment\'\)\.value\.trim\(\),\s*reviewerId:\s*userData\.id,\s*targetUserId:\s*reviewTarget\.otherUser\.id\s*\}\);',
    r'''const revData = {
        rating: selectedRating,
        comment: #review-comment.value.trim(),
        reviewerId: userData.id,
        targetUserId: reviewTarget.otherUser.id,
        createdAt: firestoreTimestamp()
      };
      await addDoc(collection(firestore, "reviews"), revData);''',
    content, flags=re.DOTALL
)

# Replace fetching reviews in loadProfile
content = re.sub(
    r'const reviews = userProfile\.reviews_on_targetUser \|\| \[\];',
    r'''const reviewsSnap = await getDocs(query(collection(firestore, "reviews"), where("targetUserId", "==", userData.id)));
    const reviews = reviewsSnap.docs.map(d => ({ id: d.id, ...d.data() }));''',
    content
)

with open('src/main.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated main.js for Reviews in Firestore")
