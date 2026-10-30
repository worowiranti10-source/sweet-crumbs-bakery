/**
 * Firebase Client SDK Configuration & Fallback Detection
 * Compatible with Netlify, local Vite dev, and AI Studio environments.
 * If credentials are not supplied, the app gracefully falls back to local storage
 * with demo data so the app NEVER displays a blank screen or crashes.
 */
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Retrieve from environment variables
const envConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

// Check if user set custom config in localStorage (convenient for testing without redeploy)
function getSavedConfig(): FirebaseConfig | null {
  try {
    const saved = localStorage.getItem('sweet_crumbs_firebase_config');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.apiKey && parsed.projectId) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not read custom Firebase config from localStorage', e);
  }
  return null;
}

const activeConfig: FirebaseConfig = getSavedConfig() || envConfig;

export const isFirebaseConfigured = Boolean(
  activeConfig.apiKey &&
  activeConfig.apiKey !== 'MY_FIREBASE_API_KEY' &&
  activeConfig.projectId &&
  activeConfig.projectId !== 'my-project-id'
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApps()[0] : initializeApp(activeConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    console.info('✅ Firebase initialized successfully with project:', activeConfig.projectId);
  } catch (error) {
    console.error('❌ Failed to initialize Firebase:', error);
    // Keep them null, app will safely use demo data service
  }
} else {
  console.info('ℹ️ Firebase not yet configured. Sweet Crumbs Bakery running in Demo / LocalStorage Mode.');
}

export { app, auth, db, storage, activeConfig };
