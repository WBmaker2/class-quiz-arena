import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';

const app = initializeApp({
  apiKey: 'demo-key',
  authDomain: 'demo.local',
  projectId: 'demo-quiz-arena',
});

export const auth = getAuth(app);
export const db = getFirestore(app);

let emulatorConnected = false;

if (import.meta.env.VITE_USE_EMULATOR !== 'false' && !emulatorConnected) {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  emulatorConnected = true;
}
