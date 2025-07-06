// Firebase config for client-side auth
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA6PrF3aaxm9Rsg3qlG3_89PRo6h42IIm8",
  authDomain: "writingbuddiesai.firebaseapp.com",
  projectId: "writingbuddiesai",
  storageBucket: "writingbuddiesai.firebasestorage.app",
  messagingSenderId: "312607496869",
  appId: "1:312607496869:web:f63954779b3065cd410b4c",
  measurementId: "G-56FW8YFFFJ"
};

export function initFirebase() {
  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }
}

export function getFirebaseAuth() {
  initFirebase();
  return getAuth();
}
