import { db as firestoreDb } from "./firebase";
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit as limitQuery } from "firebase/firestore";

const parseSortAndLimit = (sortString, limitNum) => {
  const constraints = [];
  if (sortString) {
    const isDesc = sortString.startsWith('-');
    const field = isDesc ? sortString.substring(1) : sortString;
    constraints.push(orderBy(field, isDesc ? 'desc' : 'asc'));
  }
  if (limitNum) {
    constraints.push(limitQuery(limitNum));
  }
  return constraints;
};

export const db = {
  auth: {
    // Auth logic is now primarily in AuthContext.jsx
    me: async () => {
      // Return a dummy object if something still calls this directly
      return { id: "mock_user", email: "mock@example.com", full_name: "Mock User" };
    },
    logout: () => { window.location.href = "/login" },
    redirectToLogin: () => { window.location.href = "/login" },
  },
  entities: new Proxy({}, {
    get: (target, entityName) => ({
      list: async (sortStr, lim) => {
        try {
          const constraints = parseSortAndLimit(sortStr, lim);
          const q = query(collection(firestoreDb, entityName), ...constraints);
          const querySnapshot = await getDocs(q);
          return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (e) {
          console.warn(`Firestore list error on ${entityName}:`, e);
          return [];
        }
      },
      get: async (id) => {
        try {
          const docSnap = await getDoc(doc(firestoreDb, entityName, id));
          return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
        } catch (e) {
          console.warn(`Firestore get error on ${entityName}:`, e);
          return null;
        }
      },
      create: async (data) => {
        const docRef = await addDoc(collection(firestoreDb, entityName), data);
        return { id: docRef.id, ...data };
      },
      update: async (id, data) => {
        await updateDoc(doc(firestoreDb, entityName, id), data);
        return { id, ...data };
      },
      delete: async (id) => {
        await deleteDoc(doc(firestoreDb, entityName, id));
        return { id };
      },
      filter: async (conditions, sortStr, lim) => {
        try {
          const constraints = Object.entries(conditions).map(([key, val]) => where(key, '==', val));
          constraints.push(...parseSortAndLimit(sortStr, lim));
          
          const q = query(collection(firestoreDb, entityName), ...constraints);
          const querySnapshot = await getDocs(q);
          return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (e) {
          console.warn(`Firestore filter error on ${entityName}:`, e);
          return [];
        }
      }
    })
  }),
  integrations: {
    Core: {
      UploadFile: async () => ({ file_url: '' }),
      InvokeLLM: async () => ({}),
    }
  },
  functions: {
    invoke: async () => ({})
  },
};

export const base44 = db;
export default db;
