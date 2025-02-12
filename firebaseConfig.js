import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCfc7t7_dgfKji-9XJ1hNeNMHknm6toLvY",
  authDomain: "carepoint-cf55e.firebaseapp.com",
  projectId: "carepoint-cf55e",
  storageBucket: "carepoint-cf55e.firebasestorage.app",
  messagingSenderId: "296085325126",
  appId: "1:296085325126:web:0f45e8e526c622775f1147",
  measurementId: "G-7L56YGJY04",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
const db = getFirestore(app);
const auth = getAuth(app);

export { app, analytics, db, auth, firebaseConfig };
