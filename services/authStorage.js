// src/services/authStorage.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import { REMEMBER_ME_KEY } from '../constants/auth';

const USER_KEY = 'authUser';
const USER_DATA_KEY = 'authUserData';

const saveUserToStorage = async (user, userData, rememberMe = true) => {
  if (!rememberMe) return;
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error('Erro ao salvar usuário no AsyncStorage:', error);
  }
};

const loadUserData = async () => {
  try {
    const rememberMe = await AsyncStorage.getItem(REMEMBER_ME_KEY);
    if (rememberMe !== 'true') return { user: null, userData: null };

    const user = await AsyncStorage.getItem(USER_KEY);
    const userData = await AsyncStorage.getItem(USER_DATA_KEY);

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
    await AsyncStorage.multiRemove([USER_KEY, USER_DATA_KEY, REMEMBER_ME_KEY]);
  } catch (error) {
    console.error('Erro ao limpar dados do usuário:', error);
  }
};

export default {
  saveUserToStorage,
  loadUserData,
  clearUserFromStorage,
};
