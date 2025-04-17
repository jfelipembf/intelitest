import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { 
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import * as SecureStore from 'expo-secure-store';
import authStorage from '../services/authStorage';
import logService from '../utils/logService';

// Importando constantes de autenticação
import { 
  USER_AUTH_KEY, 
  USER_DATA_KEY, 
  REMEMBER_ME_KEY, 
  LAST_LOGIN_TIME_KEY, 
  LOGIN_EXPIRATION_MS, 
  REQUIRED_ROLE,
  ERROR_MESSAGES 
} from '../constants/auth';

// Funções puras - extraídas para fora do componente para evitar recriações
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidUserRole = (userData) => {
  return userData && userData.role === REQUIRED_ROLE;
};

const getErrorMessage = (errorCode) => {
  return ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.default;
};

// Estender o authStorage com funções adicionais específicas para o useAuth
const authStorageExtended = {
  ...authStorage,
  
  // Verifica se um login salvo está expirado
  isLoginExpired: (lastLoginTime) => {
    return lastLoginTime && (Date.now() - parseInt(lastLoginTime)) > LOGIN_EXPIRATION_MS;
  },

  // Salva a configuração de "lembrar-me"
  saveRememberMePreference: async (rememberMe) => {
    await SecureStore.setItemAsync(REMEMBER_ME_KEY, rememberMe ? 'true' : 'false');
  },

  // Verifica se "lembrar-me" está ativo
  isRememberMeActive: async () => {
    return await SecureStore.getItemAsync(REMEMBER_ME_KEY) === 'true';
  },
  
  // Salva o tempo do último login
  saveLastLoginTime: async () => {
    await SecureStore.setItemAsync(LAST_LOGIN_TIME_KEY, Date.now().toString());
  },
  
  // Obtém o tempo do último login
  getLastLoginTime: async () => {
    return await SecureStore.getItemAsync(LAST_LOGIN_TIME_KEY);
  }
};

// Criar o contexto de autenticação
const AuthContext = createContext({});

// Provider do contexto de autenticação
export const AuthProvider = ({ children }) => {
  // Estados para gerenciamento de autenticação
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);        // Carregamento de autenticação
  const [operationLoading, setOperationLoading] = useState(false); // Carregamento de operações específicas
  const [authError, setAuthError] = useState(null);

  // Função para buscar dados do usuário no Firestore
  const fetchUserData = async (uid) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        return null;
      }
    } catch (error) {
      logService.error("Erro ao buscar dados do usuário:", error);
      return null;
    }
  };

  // Efeito para verificar o estado de autenticação ao iniciar o app
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    
    setAuthLoading(true);

    // Carregar dados salvos no storage
    const initializeAuth = async () => {
      if (signal.aborted) return;
      
      try {
        // Carregar dados do usuário salvos
        const { user: storedUser, userData: storedUserData } = await authStorage.loadUserData();
        
        // Verificar se o login expirou
        const lastLoginTime = await authStorageExtended.getLastLoginTime();
        const loginExpired = authStorageExtended.isLoginExpired(lastLoginTime);
        
        if (loginExpired) {
          await authStorage.clearUserFromStorage();
          if (!signal.aborted) {
            setUser(null);
            setUserData(null);
          }
        } else if (!signal.aborted && storedUser && storedUserData) {
          setUser(storedUser);
          setUserData(storedUserData);
        }
      } catch (error) {
        logService.error("Erro ao inicializar autenticação:", error);
      } finally {
        if (!signal.aborted) setAuthLoading(false);
      }
    };

    // Inicializar com dados salvos
    initializeAuth();

    // Configurar listener do Firebase Auth
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (signal.aborted) return;
      
      try {
        if (firebaseUser) {
          // Usuário autenticado, buscar dados adicionais no Firestore
          const userData = await fetchUserData(firebaseUser.uid);
          
          if (userData) {
            if (isValidUserRole(userData)) {
              if (!signal.aborted) {
                setUser(firebaseUser);
                setUserData(userData);
              }
              
              // Só salvar no storage se "rememberMe" estiver ativo
              const rememberMeActive = await authStorageExtended.isRememberMeActive();
              if (rememberMeActive && !signal.aborted) {
                await authStorage.saveUserToStorage(firebaseUser, userData);
                await authStorageExtended.saveLastLoginTime();
              }
            } else {
              // Usuário não é aluno, fazer logout
              await signOut(auth);
              if (!signal.aborted) {
                setUser(null);
                setUserData(null);
              }
              await authStorage.clearUserFromStorage();
            }
          } else {
            // Dados do usuário não encontrados
            if (!signal.aborted) {
              setUser(null);
              setUserData(null);
            }
            await authStorage.clearUserFromStorage();
          }
        }
      } catch (error) {
        logService.error("Erro ao processar autenticação do Firebase:", error);
        if (!signal.aborted) {
          setUser(null);
          setUserData(null);
          setAuthLoading(false);
        }
        await authStorage.clearUserFromStorage();
      }
    });

    // Cleanup function
    return () => {
      controller.abort();
      unsubscribe();
    };
  }, []);

  // Login com email e senha
  const login = async (email, password, rememberMe) => {
    setAuthError(null);
    setOperationLoading(true);
    
    try {
      // Validar email
      if (!isValidEmail(email)) {
        throw new Error("EMAIL_INVALID");
      }
      
      // Salvar preferência de "lembrar-me"
      await authStorageExtended.saveRememberMePreference(rememberMe);
      
      // Realizar login no Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Buscar dados adicionais
      const userData = await fetchUserData(firebaseUser.uid);
      
      if (!userData) {
        throw new Error("USER_DATA_NOT_FOUND");
      }
      
      if (!isValidUserRole(userData)) {
        await signOut(auth);
        throw new Error("INVALID_ROLE");
      }
      
      // Atualizar estados
      setUser(firebaseUser);
      setUserData(userData);
      
      // Salvar dados no storage se "lembrar-me" estiver ativo
      if (rememberMe) {
        await authStorage.saveUserToStorage(firebaseUser, userData, true);
        await authStorageExtended.saveLastLoginTime();
      }
      
      return { success: true };
    } catch (error) {
      // Tratar erros de autenticação
      const errorCode = error.code || error.message;
      const errorMessage = getErrorMessage(errorCode);
      
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setOperationLoading(false);
    }
  };

  // Logout do usuário
  const logout = async () => {
    setOperationLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setUserData(null);
      await authStorage.clearUserFromStorage();
      return { success: true };
    } catch (error) {
      const errorMessage = getErrorMessage(error.code);
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setOperationLoading(false);
    }
  };

  // Função para recuperação de senha
  const resetPassword = async (email) => {
    setAuthError(null);
    setOperationLoading(true);
    
    try {
      if (!isValidEmail(email)) {
        throw new Error("EMAIL_INVALID");
      }
      
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      const errorMessage = getErrorMessage(error.code);
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setOperationLoading(false);
    }
  };

  // Verificar se o usuário está autenticado
  const isUserAuthenticated = () => {
    return !!user && !!userData;
  };

  // Fornecer o contexto com os valores e funções necessárias
  const authContextValue = {
    user,
    userData,
    authLoading,
    operationLoading,
    authError,
    login,
    logout,
    resetPassword,
    isUserAuthenticated
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acessar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
};

export default useAuth;