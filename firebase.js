import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { getDataConnect, connectDataConnectEmulator } from "firebase/data-connect";
import { connectorConfig } from "@work4abit/dataconnect";

const firebaseConfig = {
  apiKey: "AIzaSyAu53ZLxN_6p_BKZUWSE6R8aMbn_iKP91s",
  authDomain: "work4abit.firebaseapp.com",
  projectId: "work4abit",
  storageBucket: "work4abit.firebasestorage.app",
  messagingSenderId: "1019650332467",
  appId: "1:1019650332467:web:70a55093445cbf4689d046",
  measurementId: "G-3CD953WGTS"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const dataConnect = getDataConnect(app, connectorConfig);

let analytics = null;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}
export { analytics };
