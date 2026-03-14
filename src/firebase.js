// Replace with your Firebase config
// Get this from the Firebase console (Web app config)
import { initializeApp } from 'firebase/app';
// import { getAnalytics } from "firebase/analytics";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc
} from 'firebase/firestore';

// const firebaseConfig = {
//   apiKey: 'YOUR_API_KEY',
//   authDomain: 'YOUR_AUTH_DOMAIN',
//   projectId: 'YOUR_PROJECT_ID',
//   storageBucket: 'YOUR_STORAGE_BUCKET',
//   messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
//   appId: 'YOUR_APP_ID'
// };

const firebaseConfig = {
  apiKey: "AIzaSyCsrr_lCz346sgCPpglnxFxComwyVtb7nc",
  authDomain: "dfc-repair-mgmt.firebaseapp.com",
  projectId: "dfc-repair-mgmt",
  storageBucket: "dfc-repair-mgmt.firebasestorage.app",
  messagingSenderId: "299885977591",
  appId: "1:299885977591:web:e78c6d071909c0e52118f2",
  measurementId: "G-LY6ZT6YPK5"
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const db = getFirestore(app);

export {
  db,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc
};

