import { getApps, initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import * as SecureStore from 'expo-secure-store';

// Configuração do Firebase diretamente no código
// Isso garante que tudo funcione corretamente, mesmo sem variáveis de ambiente
const firebaseConfig = {
  apiKey: "AIzaSyCDlgPjZGpQmbkrr3OKEhW95gkbs2Xsrko",
  authDomain: "inteligenciaapp-520e3.firebaseapp.com",
  databaseURL: "https://inteligenciaapp-520e3.firebaseio.com",
  projectId: "inteligenciaapp-520e3",
  storageBucket: "inteligenciaapp-520e3.appspot.com",
  messagingSenderId: "538089643335",
  appId: "1:538089643335:web:432d1f0a060c1889d68062",
  measurementId: "G-TZ1CVDF0ND"
};

// Inicialize o Firebase apenas se não existir uma instância
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(SecureStore)
});
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage }; 