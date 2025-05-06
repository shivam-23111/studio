// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDoc, addDoc, serverTimestamp, onSnapshot, query, orderBy, deleteDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged, type User } from "firebase/auth";

// Your web app's Firebase configuration (REPLACED .env with actual values)
const firebaseConfig = {
  apiKey: "AIzaSyAz9c1vPGt99gWSiwHOW0Siy1ACXSwt51Y",
  authDomain: "collabedit-eh1m7.firebaseapp.com",
  projectId: "collabedit-eh1m7",
  storageBucket: "collabedit-eh1m7.firebasestorage.app",
  messagingSenderId: "715097536821",
  appId: "1:715097536821:web:019ad93524cebf1163b47c"
};

// Function to check if all required config values are present
const isFirebaseConfigValid = (config: typeof firebaseConfig): boolean => {
  return !!(config.apiKey && config.authDomain && config.projectId && config.storageBucket && config.messagingSenderId && config.appId);
};

// Initialize Firebase
let app: FirebaseApp | null = null;
let auth: ReturnType<typeof getAuth> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;
let firebaseInitializationError: Error | null = null;

try {
  if (!getApps().length) {
    if (isFirebaseConfigValid(firebaseConfig)) {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      db = getFirestore(app);
    } else {
      console.warn("Firebase configuration is incomplete.");
      throw new Error("Firebase configuration is incomplete.");
    }
  } else {
    app = getApp();
    if (isFirebaseConfigValid(firebaseConfig)) {
      auth = getAuth(app);
      db = getFirestore(app);
    } else {
      console.warn("Firebase configuration became invalid after initial load.");
      throw new Error("Firebase configuration is invalid.");
    }
  }
} catch (error) {
  console.error("Firebase initialization failed:", error);
  firebaseInitializationError = error instanceof Error ? error : new Error('Unknown Firebase initialization error');
  app = null;
  auth = null;
  db = null;
}

// Function to ensure user is signed in anonymously
const ensureAnonymousUser = (): Promise<User> => {
  return new Promise((resolve, reject) => {
    if (!auth || firebaseInitializationError) {
      return reject(firebaseInitializationError || new Error("Firebase Auth is not initialized."));
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (user) {
        resolve(user);
      } else {
        signInAnonymously(auth)
          .then((userCredential) => resolve(userCredential.user))
          .catch((error) => {
            console.error("Anonymous sign-in failed:", error);
            if (error.code === 'auth/invalid-api-key') {
              reject(new Error("Invalid API Key. Check Firebase config."));
            } else {
              reject(error);
            }
          });
      }
    }, (error) => {
      console.error("Auth state listener error:", error);
      reject(error);
    });
  });
};

// Export all Firebase tools and helpers
export {
  app,
  db,
  auth,
  firebaseInitializationError,
  ensureAnonymousUser,
  collection,
  doc,
  setDoc,
  getDoc,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onAuthStateChanged,
  User
};
