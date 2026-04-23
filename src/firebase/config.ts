import type { FirebaseOptions } from "firebase/app";

const embeddedFirebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyBCnaC7Q8EcASXbd3LYb5ycE7twOGVJeOI",
  authDomain: "krishna-e9c59.firebaseapp.com",
  projectId: "krishna-e9c59",
  storageBucket: "krishna-e9c59.firebasestorage.app",
  messagingSenderId: "1048468387337",
  appId: "1:1048468387337:web:614731f6b1a73b84b02ad8",
};

export const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || embeddedFirebaseConfig.apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || embeddedFirebaseConfig.authDomain,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || embeddedFirebaseConfig.projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || embeddedFirebaseConfig.storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || embeddedFirebaseConfig.messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || embeddedFirebaseConfig.appId,
};

export const hasFirebaseConfig = [
  firebaseConfig.apiKey,
  firebaseConfig.authDomain,
  firebaseConfig.projectId,
  firebaseConfig.storageBucket,
  firebaseConfig.messagingSenderId,
  firebaseConfig.appId,
].every(Boolean);
