import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';

export const app = initializeApp(
  import.meta.env.VITE_USE_EMULATOR !== 'false'
    ? {
        apiKey: 'demo-key',
        authDomain: 'demo.local',
        projectId: 'demo-quiz-arena',
      }
    : {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
        appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
      },
);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

let emulatorConnected = false;

if (import.meta.env.VITE_USE_EMULATOR !== 'false' && !emulatorConnected) {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  connectFunctionsEmulator(functions, '127.0.0.1', 5001);
  emulatorConnected = true;
}
