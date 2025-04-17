// src/services/authStorage.js

import * as SecureStore from 'expo-secure-store';
import { REMEMBER_ME_KEY } from '../constants/auth';
import logService from '../utils/logService';

const USER_KEY = 'authUser';
const USER_DATA_KEY = 'authUserData';

/**
 * Salva os dados do usuário de forma segura no armazenamento do dispositivo
 * 
 * @param {Object} user - Objeto de usuário do Firebase Auth 
 * @param {Object} userData - Dados adicionais do usuário do Firestore
 * @param {boolean} rememberMe - Flag indicando se deve persistir os dados
 * @returns {Promise<void>}
 */
const saveUserToStorage = async (user, userData, rememberMe = true) => {
  if (!rememberMe) return;
  
  try {
    // Convertemos o objeto user para um formato serializável
    const serializedUser = {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
    
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(serializedUser));
    await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(userData));
  } catch (error) {
    logService.error('Erro ao salvar usuário no SecureStore:', error);
  }
};

/**
 * Carrega os dados do usuário do armazenamento seguro
 * 
 * @returns {Promise<{user: Object|null, userData: Object|null}>}
 */
const loadUserData = async () => {
  try {
    const rememberMe = await SecureStore.getItemAsync(REMEMBER_ME_KEY);
    if (rememberMe !== 'true') return { user: null, userData: null };

    const user = await SecureStore.getItemAsync(USER_KEY);
    const userData = await SecureStore.getItemAsync(USER_DATA_KEY);

    return {
      user: user ? JSON.parse(user) : null,
      userData: userData ? JSON.parse(userData) : null,
    };
  } catch (error) {
    logService.error('Erro ao carregar dados do usuário:', error);
    return { user: null, userData: null };
  }
};

/**
 * Remove os dados do usuário do armazenamento seguro
 * 
 * @returns {Promise<void>}
 */
const clearUserFromStorage = async () => {
  try {
    await Promise.all([
      SecureStore.deleteItemAsync(USER_KEY),
      SecureStore.deleteItemAsync(USER_DATA_KEY),
      SecureStore.deleteItemAsync(REMEMBER_ME_KEY)
    ]);
  } catch (error) {
    logService.error('Erro ao limpar dados do usuário:', error);
  }
};

export default {
  saveUserToStorage,
  loadUserData,
  clearUserFromStorage,
};
