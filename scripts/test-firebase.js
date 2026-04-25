require('dotenv').config({ path: '.env.local' });
const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, getDoc, setDoc } = require('firebase/firestore');

const firebaseConfig = {
apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function testAuth() {
  try {
    // Assuming the user has a test account, or we can create one
    // But since we can't create one, let's just create a dummy one
    const { createUserWithEmailAndPassword, deleteUser } = require('firebase/auth');
    const email = `test-${Date.now()}@example.com`;
    const cred = await createUserWithEmailAndPassword(auth, email, "password123");
    console.log("User created:", cred.user.uid);
    
    console.log("Testing user reading...");
    const userDoc = doc(db, 'users', cred.user.uid);
    await getDoc(userDoc);
    console.log("User read passed.");
    
    console.log("Testing user writing...");
    await setDoc(userDoc, { test: true });
    console.log("User write passed.");
    
    console.log("Testing org creation...");
    const { collection } = require('firebase/firestore');
    const orgDoc = doc(collection(db, 'orgs'));
    await setDoc(orgDoc, { ownerId: cred.user.uid, test: true });
    console.log("Org write passed.");
    
    // Clean up
    await deleteUser(cred.user);
    console.log("Success! No permissions errors.");
  } catch (e) {
    console.error("FAILED:", e.message);
  }
}
testAuth();
