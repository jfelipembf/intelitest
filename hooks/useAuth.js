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

// Service para armazenamento de dados do usuário
const storageService = {
  // Função para salvar dados do usuário de forma segura
  saveUserToStorage: async (user, userData) => {
    try {
      // Convertemos o objeto user para um formato serializável
      const serializedUser = {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };
      
      // Usar apenas SecureStore para todas as operações de armazenamento
      const operations = [
        SecureStore.setItemAsync(USER_AUTH_KEY, JSON.stringify(serializedUser)),
        SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(userData)),
        SecureStore.setItemAsync(REMEMBER_ME_KEY, 'true'),
        SecureStore.setItemAsync(LAST_LOGIN_TIME_KEY, Date.now().toString())
      ];
      
      await Promise.all(operations);
    } catch (error) {
      console.error("Erro ao salvar dados do usuário:", error);
    }
  },

  // Função para limpar dados do usuário
  clearUserFromStorage: async () => {
    try {
      const operations = [
        SecureStore.deleteItemAsync(USER_AUTH_KEY),
        SecureStore.deleteItemAsync(USER_DATA_KEY),
        SecureStore.deleteItemAsync(REMEMBER_ME_KEY),
        SecureStore.deleteItemAsync(LAST_LOGIN_TIME_KEY)
      ];
      
      await Promise.all(operations);
    } catch (error) {
      console.error("Erro ao remover dados do usuário:", error);
    }
  },

  // Verifica se um login salvo está expirado
  isLoginExpired: (lastLoginTime) => {
    return lastLoginTime && (Date.now() - parseInt(lastLoginTime)) > LOGIN_EXPIRATION_MS;
  },

  // Carrega dados do usuário do storage
  loadUserData: async () => {
    try {
      const [
        storedUserJSON, 
        storedUserDataJSON, 
        rememberMeFlag, 
        lastLoginTime
      ] = await Promise.all([
        SecureStore.getItemAsync(USER_AUTH_KEY),
        SecureStore.getItemAsync(USER_DATA_KEY),
        SecureStore.getItemAsync(REMEMBER_ME_KEY),
        SecureStore.getItemAsync(LAST_LOGIN_TIME_KEY)
      ]);

      // Verificar se o login expirou
      const loginExpired = storageService.isLoginExpired(lastLoginTime);
      
      // Se o rememberMe não estiver ativo ou o login expirou, não restaurar
      if (rememberMeFlag !== 'true' || loginExpired) {
        await storageService.clearUserFromStorage();
        return { user: null, userData: null };
      }

      if (storedUserJSON && storedUserDataJSON) {
        const storedUser = JSON.parse(storedUserJSON);
        const storedUserData = JSON.parse(storedUserDataJSON);
        
        // Verificar se os dados estão completos e o usuário é aluno
        if (storedUser && storedUserData && storedUserData.role === REQUIRED_ROLE) {
          return { user: storedUser, userData: storedUserData };
        } else {
          await storageService.clearUserFromStorage();
        }
      }
      return { user: null, userData: null };
    } catch (error) {
      console.error("Erro ao carregar dados do SecureStore:", error);
      await storageService.clearUserFromStorage();
      return { user: null, userData: null };
    }
  },

  // Salva a configuração de "lembrar-me"
  saveRememberMePreference: async (rememberMe) => {
    await SecureStore.setItemAsync(REMEMBER_ME_KEY, rememberMe ? 'true' : 'false');
  },

  // Verifica se "lembrar-me" está ativo
  isRememberMeActive: async () => {
    return await SecureStore.getItemAsync(REMEMBER_ME_KEY) === 'true';
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
      console.error("Erro ao buscar dados do usuário:", error);
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
      
      const { user: storedUser, userData: storedUserData } = await storageService.loadUserData();
      
      if (!signal.aborted && storedUser && storedUserData) {
        setUser(storedUser);
        setUserData(storedUserData);
      }
      
      if (!signal.aborted) setAuthLoading(false);
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
              const rememberMeActive = await storageService.isRememberMeActive();
              if (rememberMeActive && !signal.aborted) {
                await storageService.saveUserToStorage(firebaseUser, userData);
              }
            } else {
              // Usuário não é aluno, fazer logout
              await signOut(auth);
              if (!signal.aborted) {
                setUser(null);
                setUserData(null);
              }
              await storageService.clearUserFromStorage();
            }
          } else {
            // Dados do usuário não encontrados
            if (!signal.aborted) {
              setUser(null);
              setUserData(null);
            }
            await storageService.clearUserFromStorage();
          }
        }
      } catch (error) {
        console.error("Erro ao processar autenticação do Firebase:", error);
        if (!signal.aborted) {
          setUser(null);
          setUserData(null);
          setAuthLoading(false);
        }
        await storageService.clearUserFromStorage();
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
    // Validação de email
    if (!isValidEmail(email)) {
      return { success: false, error: "Formato de e-mail inválido." };
    }

    setAuthError(null);
    setOperationLoading(true);
    
    try {
      // Autenticação no Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Buscar dados do usuário
      const userDataFromDB = await fetchUserData(firebaseUser.uid);
      
      // Verificar se é um aluno
      if (!isValidUserRole(userDataFromDB)) {
        await signOut(auth);
        setOperationLoading(false);
        return { 
          success: false, 
          error: "Acesso negado. Este aplicativo é exclusivo para alunos." 
        };
      }
      
      // Salvar preferência de "lembrar-me"
      await storageService.saveRememberMePreference(rememberMe);
      
      // Se "lembrar-me" estiver ativo, salvar dados do usuário no storage
      if (rememberMe) {
        await storageService.saveUserToStorage(firebaseUser, userDataFromDB);
      }
      
      // Atualizar estado
      setUser(firebaseUser);
      setUserData(userDataFromDB);
      setOperationLoading(false);
      
      return { success: true };
    } catch (error) {
      console.error("Erro no login:", error);
      
      const errorMessage = getErrorMessage(error.code);
      setAuthError(errorMessage);
      setOperationLoading(false);
      
      return { success: false, error: errorMessage };
    }
  };

  // Logout
  const logout = async () => {
    setOperationLoading(true);
    
    try {
      // Fazer logout no Firebase
      await signOut(auth);
      
      // Limpar dados do storage
      await storageService.clearUserFromStorage();
      
      // Atualizar estado
      setUser(null);
      setUserData(null);
      setAuthError(null);
      
      return { success: true };
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      
      const errorMessage = getErrorMessage(error.code);
      setAuthError(errorMessage);
      
      return { success: false, error: errorMessage };
    } finally {
      setOperationLoading(false);
    }
  };

  // Redefinir senha
  const resetPassword = async (email) => {
    if (!isValidEmail(email)) {
      return { success: false, error: "Formato de e-mail inválido." };
    }
    
    setOperationLoading(true);
    
    try {
      await sendPasswordResetEmail(auth, email);
      setOperationLoading(false);
      return { success: true };
    } catch (error) {
      console.error("Erro ao enviar e-mail de redefinição:", error);
      
      const errorMessage = getErrorMessage(error.code);
      setOperationLoading(false);
      
      return { success: false, error: errorMessage };
    }
  };

  // Verificar se o usuário está autenticado
  const isUserAuthenticated = () => {
    return !!user && !!userData;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading: authLoading || operationLoading,
        authLoading,
        operationLoading,
        authError,
        login,
        logout,
        resetPassword,
        isUserAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  
  return context;
};

export default useAuth;