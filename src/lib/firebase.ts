// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDoc, addDoc, serverTimestamp, onSnapshot, query, orderBy, deleteDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged, type User } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Function to check if all required config values are present
const isFirebaseConfigValid = (config: typeof firebaseConfig): boolean => {
    return !!(config.apiKey && config.authDomain && config.projectId && config.storageBucket && config.messagingSenderId && config.appId);
};

// Initialize Firebase
let app: FirebaseApp | null = null; // Allow app to be null initially
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
      console.warn(
        "Firebase configuration is incomplete. Please check your .env file and ensure all NEXT_PUBLIC_FIREBASE_ variables are set correctly."
      );
      throw new Error("Firebase configuration is incomplete.");
    }
  } else {
    app = getApp();
    // Check validity again in case of HMR or similar scenarios where env vars might change
    if (isFirebaseConfigValid(firebaseConfig)) {
        auth = getAuth(app); // Ensure auth is initialized even if app exists
        db = getFirestore(app); // Ensure db is initialized even if app exists
    } else {
         console.warn(
            "Firebase configuration became invalid after initial load. Please check your .env file."
         );
         throw new Error("Firebase configuration is invalid.");
    }
  }
} catch (error) {
    console.error("Firebase initialization failed:", error);
    firebaseInitializationError = error instanceof Error ? error : new Error('Unknown Firebase initialization error');
    // Set app, auth, db to null if initialization fails
    app = null;
    auth = null;
    db = null;
}


// Function to ensure user is signed in anonymously
const ensureAnonymousUser = (): Promise<User> => {
  return new Promise((resolve, reject) => {
    // Check if Firebase initialized correctly
    if (!auth || firebaseInitializationError) {
        return reject(firebaseInitializationError || new Error("Firebase Auth is not initialized."));
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe(); // Unsubscribe after first check
      if (user) {
        resolve(user);
      } else {
        signInAnonymously(auth)
          .then((userCredential) => {
            resolve(userCredential.user);
          })
          .catch((error) => {
            console.error("Anonymous sign-in failed:", error);
            // Provide a more specific error message if possible
            if (error.code === 'auth/invalid-api-key') {
                reject(new Error("Firebase sign-in failed: Invalid API Key. Please check your Firebase configuration in .env."));
            } else {
                reject(error);
            }
          });
      }
    }, (error) => {
        console.error("Auth state listener error:", error);
        reject(error); // Reject on listener error
    });
  });
};


// Export potentially null values, components should handle this
export {
    app,
    db, // db can be null if initialization failed
    auth, // auth can be null if initialization failed
    firebaseInitializationError, // Export the error state
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
