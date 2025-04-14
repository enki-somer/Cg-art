import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

// Log Firebase config for debugging (masking sensitive values)
const logConfig = () => {
  console.log("Firebase Config Status:", {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "Set (masked)" : "Not set",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? "Set" : "Not set",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "Not set",
    environment: process.env.NODE_ENV || "unknown"
  });
};

// Get Firebase config from environment variables
const getFirebaseConfig = () => {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  };
  
  // Validate config
  if (!config.apiKey || !config.projectId) {
    console.error("Firebase configuration is incomplete", {
      apiKeyExists: !!config.apiKey,
      projectIdExists: !!config.projectId
    });
  }
  
  return config;
};

// Initialize Firebase
let firestore: Firestore;

try {
  logConfig();
  const firebaseConfig = getFirebaseConfig();
  
  // Initialize Firebase if not already initialized
  let app: FirebaseApp;
  if (!getApps().length) {
    console.log("Initializing new Firebase app");
    app = initializeApp(firebaseConfig);
  } else {
    console.log("Using existing Firebase app");
    app = getApps()[0];
  }
  
  // Initialize Firestore
  firestore = getFirestore(app);
  console.log("Firestore initialized successfully");
} catch (error) {
  console.error("Firebase initialization error:", error);
  
  // Create a dummy Firestore implementation that won't crash
  // @ts-expect-error - This is a workaround for serverless environments
  firestore = {
    collection: (collectionPath: string) => ({
      doc: (docPath: string) => ({
        get: async () => ({ 
          exists: false,
          data: () => null
        }),
        set: async () => null
      }),
      add: async () => ({ id: 'dummy-id' }),
      get: async () => ({
        empty: true,
        docs: [],
        forEach: () => {}
      })
    })
  } as Firestore;
  
  console.log("Using dummy Firestore implementation");
}

export { firestore }; 