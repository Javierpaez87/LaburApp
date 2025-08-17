// src/services/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDbphNhyINIcj0TwpT96tqeLcXnMXYRcm0",
  authDomain: "laburar-app-b1a11.firebaseapp.com",
  projectId: "laburar-app-b1a11",
  storageBucket: "laburar-app-b1a11.firebasestorage.app",
  messagingSenderId: "511558096886",
  appId: "1:511558096886:web:10b8b6d9ce01eeb21e59d7",
  measurementId: "G-E1VVV69GRE"
};

// Inicializar la app
const app = initializeApp(firebaseConfig);

// Exportar Auth y Google Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
