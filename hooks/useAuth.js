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
import AsyncStorage from '@react-native-async-storage/async-storage';

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

// Criar o contexto de autenticação
const AuthContext = createContext({});

// Provider do contexto de autenticação
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Validar formato de email
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

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

      return null;
    }
  };

  // Funções de storage
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
        
        // Usar SecureStore para informações sensíveis
        await SecureStore.setItemAsync(USER_AUTH_KEY, JSON.stringify(serializedUser));
        await SecureStore.setItemAsync(USER_DATA_KEY, JSON.stringify(userData));
        
        // Salvar informações não sensíveis no AsyncStorage
        await AsyncStorage.setItem(REMEMBER_ME_KEY, 'true');
        await AsyncStorage.setItem(LAST_LOGIN_TIME_KEY, Date.now().toString());
      } catch (error) {
        console.error("Erro ao salvar dados do usuário:", error);
      }
    },

    // Função para limpar dados do usuário
    clearUserFromStorage: async () => {
      try {
        await SecureStore.deleteItemAsync(USER_AUTH_KEY);
        await SecureStore.deleteItemAsync(USER_DATA_KEY);
        await AsyncStorage.removeItem(REMEMBER_ME_KEY);
        await AsyncStorage.removeItem(LAST_LOGIN_TIME_KEY);
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
        const storedUserJSON = await SecureStore.getItemAsync(USER_AUTH_KEY);
        const storedUserDataJSON = await SecureStore.getItemAsync(USER_DATA_KEY);
        const rememberMeFlag = await AsyncStorage.getItem(REMEMBER_ME_KEY);
        const lastLoginTime = await AsyncStorage.getItem(LAST_LOGIN_TIME_KEY);

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

      await AsyncStorage.setItem(REMEMBER_ME_KEY, rememberMe ? 'true' : 'false');
    },

    // Verifica se "lembrar-me" está ativo
    isRememberMeActive: async () => {
      return await AsyncStorage.getItem(REMEMBER_ME_KEY) === 'true';
    }
  };

  // Função para verificar se o usuário é válido
  const isValidUserRole = (userData) => {
    return userData && userData.role === REQUIRED_ROLE;
  };

  // Tradução de códigos de erro do Firebase
  // Tradução de códigos de erro do Firebase
  const getErrorMessage = (errorCode) => {
    return ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.default;
  };

  // Efeito para verificar o estado de autenticação ao iniciar o app
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    // Carregar dados salvos no storage
    const initializeAuth = async () => {
      const { user: storedUser, userData: storedUserData } = await storageService.loadUserData();
      
      if (isMounted && storedUser && storedUserData) {
        setUser(storedUser);
        setUserData(storedUserData);
      }
      
      if (isMounted) setLoading(false);
    };

    // Inicializar com dados salvos
    initializeAuth();

    // Configurar listener do Firebase Auth
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!isMounted) return;
      
      try {
        if (firebaseUser) {
          // Usuário autenticado, buscar dados adicionais no Firestore
          const userData = await fetchUserData(firebaseUser.uid);
          
          if (userData) {
            if (isValidUserRole(userData)) {
              if (isMounted) {
                setUser(firebaseUser);
                setUserData(userData);
              }
              
              // Só salvar no storage se "rememberMe" estiver ativo
              const rememberMeActive = await storageService.isRememberMeActive();
              if (rememberMeActive) {
                await storageService.saveUserToStorage(firebaseUser, userData);
              }
            } else {
              // Usuário não é aluno, fazer logout
              await signOut(auth);
              if (isMounted) {
                setUser(null);
                setUserData(null);
              }
              await storageService.clearUserFromStorage();
            }
          } else {
            // Dados do usuário não encontrados
            if (isMounted) {
              setUser(null);
              setUserData(null);
            }
            await storageService.clearUserFromStorage();
          }
        }
      } catch (error) {
        console.error("Erro ao processar autenticação do Firebase:", error);
        if (isMounted) {
          setUser(null);
          setUserData(null);
          setLoading(false);
        }
        await storageService.clearUserFromStorage();
      }
    });

    // Cleanup function
    return () => {
      isMounted = false;
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
    setLoading(true);
    
    try {
      // Autenticação no Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Buscar dados do usuário
      const userData = await fetchUserData(firebaseUser.uid);
      
      if (userData) {
        // Verificar se o usuário tem role de aluno
        if (isValidUserRole(userData)) {
          setUser(firebaseUser);
          setUserData(userData);
          
          // Salvar configuração de "lembrar-me"
          await storageService.saveRememberMePreference(rememberMe);
          
          // Salvar dados se rememberMe estiver ativo
          if (rememberMe) {
            await storageService.saveUserToStorage(firebaseUser, userData);
          } else {
            await storageService.clearUserFromStorage();
          }
          
          return { success: true, user: firebaseUser, userData };
        } else {
          // Usuário não é aluno, fazer logout
          await signOut(auth);
          const errorMessage = "Esta aplicação é exclusiva para alunos. Entre em contato com sua escola para mais informações.";
          setAuthError(errorMessage);
          await storageService.clearUserFromStorage();
          return { success: false, error: errorMessage };
        }
      } else {
        const errorMessage = "Dados do usuário não encontrados. Entre em contato com sua escola.";
        setAuthError(errorMessage);
        await storageService.clearUserFromStorage();
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      const errorMessage = getErrorMessage(error.code);
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    try {
      // Limpar armazenamento primeiro
      await storageService.clearUserFromStorage();
      
      // Desconectar do Firebase Auth
      try {
        await signOut(auth);
      } catch (signOutError) {
        console.error("Erro ao fazer signOut do Firebase:", signOutError);
        // Continua mesmo com erro no signOut, pois o importante é limpar os dados locais
      }
      
      // Limpar o estado
      setUser(null);
      setUserData(null);
      
      return { success: true };
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      return { success: false, error: "Erro ao fazer logout" };
    } finally {
      setLoading(false);
    }
  };

  // Recuperação de senha
  const resetPassword = async (email) => {
    if (!isValidEmail(email)) {
      return { success: false, error: "Formato de e-mail inválido." };
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      console.error("Erro ao enviar email de recuperação:", error);
      const errorMessage = getErrorMessage(error.code);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Função para verificar se o usuário ainda está autenticado
  const isUserAuthenticated = () => {
    if (!user) return false;
    if (!userData || !userData.role) return false;
    return userData.role === REQUIRED_ROLE;
  };

  return (
    <AuthContext.Provider value={{
      user,
      userData,
      loading,
      authError,
      login,
      logout,
      resetPassword,
      isUserAuthenticated,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para usar o contexto de autenticação
export const useAuth = () => {
  const auth = useContext(AuthContext);
  // Adicionando isConnected como true para evitar verificações de conexão
  return { ...auth, isConnected: true };
};

export default useAuth;