import { getApps, initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import * as SecureStore from 'expo-secure-store';
import logService from '../utils/logService';
import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_DATABASE_URL,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID
} from '@env';

// Configuração do Firebase usando variáveis de ambiente do arquivo .env
// Isso reduz os riscos de segurança mantendo as chaves fora do código versionado
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  databaseURL: FIREBASE_DATABASE_URL,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID
};

// Verificação das configurações para ajudar no diagnóstico de problemas
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  logService.error('Firebase: Configurações incompletas. Verifique seu arquivo .env');
  throw new Error('Configuração do Firebase incompleta. Verifique o arquivo .env');
}

// Inicialize o Firebase apenas se não existir uma instância
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(SecureStore)
});
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage }; 