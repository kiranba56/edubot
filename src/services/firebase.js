import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if valid Firebase configuration is supplied
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== 'your_key' &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== 'your_project_id'
);

let app = null;
let auth = null;
let db = null;
let googleProvider = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
  } catch (err) {
    console.warn('Firebase initialization error:', err);
  }
}

/**
 * Handle Google Sign-In with popup
 */
export async function signInWithGoogle() {
  if (!isFirebaseConfigured || !auth || !googleProvider) {
    throw new Error('Firebase is not configured yet. Please supply VITE_FIREBASE_* environment variables in your .env file.');
  }

  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  // Sync user record to Firestore collection: users/{userId}
  if (db && user) {
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        email: user.email || '',
        displayName: user.displayName || 'Anonymous Student',
        photoURL: user.photoURL || '',
        lastLoginAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      }, { merge: true });
    } catch (firestoreErr) {
      console.warn('Could not write user profile to Firestore:', firestoreErr);
    }
  }

  return user;
}

/**
 * Handle Sign Out
 */
export async function logoutFirebase() {
  if (auth) {
    await signOut(auth);
  }
}

export { app, auth, db, googleProvider, onAuthStateChanged };
