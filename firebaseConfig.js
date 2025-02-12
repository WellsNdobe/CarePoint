import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { GOOGLE_API_KEY } from "@env"; // Import from @env

const firebaseConfig = {
  apiKey: GOOGLE_API_KEY, // Use the imported API key
  authDomain: "carepoint-cf55e.firebaseapp.com",
  projectId: "carepoint-cf55e",
  storageBucket: "carepoint-cf55e.firebasestorage.app",
  messagingSenderId: "296085325126",
  appId: "1:296085325126:web:8022b10feb890a395f1147",
  measurementId: "G-1Z3GY607LQ",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db, firebaseConfig };
// Now the GOOGLE_API_KEY is imported from the .env file and used in the firebaseConfig.js file.
