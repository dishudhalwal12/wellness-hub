require('dotenv').config({ path: '.env.local' });
const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, getDoc, setDoc, Timestamp, collection } = require('firebase/firestore');

const app = initializeApp({
apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
});
const auth = getAuth(app);
const db = getFirestore(app);

async function testAuth() {
  try {
    const email = `test-${Date.now()}@example.com`;
    const cred = await createUserWithEmailAndPassword(auth, email, "password123");
    const uid = cred.user.uid;
    console.log("User created:", uid);
    
    const userDoc = doc(db, 'users', uid);
    
    console.log("Testing user writing full payload...");
    await setDoc(userDoc, {
            id: uid,
            name: "Test Name",
            email: email,
            phone: "+911234567890",
            role: "doctor",
            orgId: "some-org",
            orgType: "private",
            createdAt: Timestamp.now(),
        });
    console.log("User write passed.");

    console.log("Testing org creation...");
    const orgDocRef = doc(collection(db, 'orgs'));
    await setDoc(orgDocRef, {
        id: orgDocRef.id,
        name: 'test',
        address: '123',
        type: 'private',
        ownerId: uid,
        status: 'active',
        createdAt: Timestamp.now(),
    });
    console.log("Org creation passed.");

    const userActions = require('./.next/server/app/login/page.js');
    
    console.log("Success!");
    process.exit(0);
  } catch (e) {
    console.error("FAILED:", e.message);
    process.exit(1);
  }
}
testAuth();
