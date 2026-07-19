// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAIyc85UqzYeJdsyK65MZmtiJrQpBDN4_w",
  authDomain: "householdtypescript-f7ec5.firebaseapp.com",
  projectId: "householdtypescript-f7ec5",
  storageBucket: "householdtypescript-f7ec5.firebasestorage.app",
  messagingSenderId: "844307062380",
  appId: "1:844307062380:web:d73c391346afad495ac249"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };