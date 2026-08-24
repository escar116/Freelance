import re

with open('src/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. createHelpRequest
content = re.sub(
    r'await createHelpRequest\(dc, (\{.*?\})\);',
    r'await addDoc(collection(firestore, "helpRequests"), \1);',
    content, flags=re.DOTALL
)

# 2. createApplication
content = re.sub(
    r'await createApplication\(dc, (\{.*?\})\);',
    r'''const appData = \1;
      appData.createdAt = serverTimestamp();
      await addDoc(collection(firestore, "applications"), appData);''',
    content, flags=re.DOTALL
)

# 3. createConversation
content = re.sub(
    r'await createConversation\(dc, (\{.*?\})\);',
    r'''const convData = \1;
      convData.createdAt = serverTimestamp();
      await addDoc(collection(firestore, "conversations"), convData);''',
    content, flags=re.DOTALL
)

# 4. createReview
content = re.sub(
    r'await createReview\(dc, (\{.*?\})\);',
    r'''const revData = \1;
      revData.createdAt = serverTimestamp();
      await addDoc(collection(firestore, "reviews"), revData);''',
    content, flags=re.DOTALL
)

# 5. updateApplicationStatus / updateHelpRequestStatus
content = re.sub(
    r'await updateApplicationStatus\(dc, \{ id: ([^,]+), status: ([^\}]+) \}\);',
    r'await updateDoc(doc(firestore, "applications", \1), { status: \2 });',
    content
)
content = re.sub(
    r'await updateHelpRequestStatus\(dc, \{ id: ([^,]+), status: ([^\}]+) \}\);',
    r'await updateDoc(doc(firestore, "helpRequests", \1), { status: \2 });',
    content
)

# 6. terminateJob / completeJob
content = re.sub(
    r'await terminateJob\(dc, \{ applicationId: ([^,]+), helpRequestId: ([^\}]+) \}\);',
    r'''await updateDoc(doc(firestore, "applications", \1), { status: 'TERMINATED' });
      await updateDoc(doc(firestore, "helpRequests", \2), { status: 'OPEN' });''',
    content
)
content = re.sub(
    r'await completeJob\(dc, \{ applicationId: ([^,]+), helpRequestId: ([^\}]+) \}\);',
    r'''await updateDoc(doc(firestore, "applications", \1), { status: 'COMPLETED' });
      await updateDoc(doc(firestore, "helpRequests", \2), { status: 'COMPLETED' });''',
    content
)

with open('src/main.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Regex replace completed for mutations.")
