import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuração do Firebase com valores diretos
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

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage }; 