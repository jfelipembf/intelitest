// src/services/authStorage.js

import * as SecureStore from 'expo-secure-store';
import { REMEMBER_ME_KEY } from '../constants/auth';

const USER_KEY = 'authUser';
const USER_DATA_KEY = 'authUserData';

const saveUserToStorage = async (user, userData, rememberMe = true) => {
  if (!rememberMe) return;
  try {
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error('Erro ao salvar usuário no AsyncStorage:', error);
  }
};

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
    console.error('Erro ao carregar dados do usuário:', error);
    return { user: null, userData: null };
  }
};

const clearUserFromStorage = async () => {
  try {
    await Promise.all([
      SecureStore.deleteItemAsync(USER_KEY),
      SecureStore.deleteItemAsync(USER_DATA_KEY),
      SecureStore.deleteItemAsync(REMEMBER_ME_KEY)
    ]);
  } catch (error) {
    console.error('Erro ao limpar dados do usuário:', error);
  }
};

export default {
  saveUserToStorage,
  loadUserData,
  clearUserFromStorage,
};
