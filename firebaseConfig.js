import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCfc7t7_dgfKji-9XJ1hNeNMHknm6toLvY",
  authDomain: "carepoint-cf55e.firebaseapp.com",
  projectId: "carepoint-cf55e",
  storageBucket: "carepoint-cf55e.firebasestorage.app",
  messagingSenderId: "296085325126",
  appId: "1:296085325126:web:8022b10feb890a395f1147",
  measurementId: "G-1Z3GY607LQ",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // No persistence needed for React Native

export { app, db, auth };
