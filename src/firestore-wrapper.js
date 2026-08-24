import { getFirestore, collection, addDoc, updateDoc, doc, getDocs, query, where, orderBy, deleteDoc, serverTimestamp } from 'firebase/firestore';

export async function listHelpRequestsWrapper(app) {
  const db = getFirestore(app);
  const q = query(collection(db, 'helpRequests'), where('status', '==', 'OPEN'));
  const snap = await getDocs(q);
  const helpRequests = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return { data: { helpRequests } };
}

export async function listApplicationsByApplicantWrapper(app, { userId }) {
  const db = getFirestore(app);
  const q = query(collection(db, 'applications'), where('applicantId', '==', userId));
  const snap = await getDocs(q);
  const applications = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return { data: { applications } };
}

export async function listConversationsWrapper(app, { userId }) {
  const db = getFirestore(app);
  // We need OR queries, which Firestore supports in v9+ using 'or()' but for simplicity:
  const qPoster = query(collection(db, 'conversations'), where('posterId', '==', userId));
  const qApp = query(collection(db, 'conversations'), where('applicantId', '==', userId));
  const [s1, s2] = await Promise.all([getDocs(qPoster), getDocs(qApp)]);
  
  const map = new Map();
  s1.forEach(d => map.set(d.id, { id: d.id, ...d.data() }));
  s2.forEach(d => map.set(d.id, { id: d.id, ...d.data() }));
  
  return { data: { conversations: Array.from(map.values()) } };
}

export async function listMyHelpRequestsWithApplicationsWrapper(app, { userId }) {
  const db = getFirestore(app);
  const qJobs = query(collection(db, 'helpRequests'), where('requesterId', '==', userId));
  const jobsSnap = await getDocs(qJobs);
  const helpRequests = jobsSnap.docs.map(d => ({ id: d.id, ...d.data(), applications_on_helpRequest: [] }));
  
  const jobIds = helpRequests.map(j => j.id);
  if (jobIds.length > 0) {
    // Firestore 'in' queries support max 10, so we chunk it or query all applications
    // For a dev environment, querying all apps and filtering is fine, or chunking.
    const qApps = query(collection(db, 'applications'));
    const appsSnap = await getDocs(qApps);
    const allApps = appsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    
    for (const req of helpRequests) {
      req.applications_on_helpRequest = allApps.filter(a => a.helpRequestId === req.id);
    }
  }
  
  return { data: { helpRequests } };
}

// ... more wrappers as needed
