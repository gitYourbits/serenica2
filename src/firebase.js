import { initializeApp } from "firebase/app"
import { getAuth, connectAuthEmulator } from "firebase/auth"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"

const firebaseConfig = {
    apiKey: import.meta.env.VITE_APP_API_KEY || "demo-api-key",
    authDomain: import.meta.env.VITE_APP_AUTH_DOMAIN || "localhost",
    projectId: import.meta.env.VITE_APP_PROJECT_ID || "demo-emotionx",
    storageBucket: import.meta.env.VITE_APP_STORAGE_BUCKET || "demo-emotionx.appspot.com",
    messagingSenderId: import.meta.env.VITE_APP_MESSAGING_SENDER_ID || "123456789",
    appId: import.meta.env.VITE_APP_APP_ID || "1:123456789:web:abc123",
}

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// Connect to Firebase Emulators for local development
const useEmulators = import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true';

if (useEmulators) {
    console.log('🔧 Running in LOCAL mode with Firebase Emulators');
    console.log('📍 Auth Emulator: http://localhost:9099');
    console.log('📍 Firestore Emulator: http://localhost:8080');
    
    // Connect to emulators
    connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
    connectFirestoreEmulator(db, "localhost", 8080);
} else {
    console.log('☁️ Running in CLOUD mode with Firebase');
}

export default app;