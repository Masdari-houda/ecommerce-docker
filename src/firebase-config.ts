import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyAY4DAcO-EttqTreED6P219aXUBtt2S5Jc",
  authDomain: "ecommerce-14132.firebaseapp.com",
  projectId: "ecommerce-14132",
  storageBucket: "ecommerce-14132.firebasestorage.app",
  messagingSenderId: "172246755786",
  appId: "1:172246755786:web:e659f2b83d75344652c733",
  measurementId: "G-E5VWGKFETM"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };