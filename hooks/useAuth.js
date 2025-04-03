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
import { Alert } from 'react-native';

// Criar o contexto de autenticação
const AuthContext = createContext({});

// Provider do contexto de autenticação
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
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

  // Função para salvar dados do usuário de forma segura
  const saveUserToStorage = async (user, userData) => {
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
      await SecureStore.setItemAsync('user_auth', JSON.stringify(serializedUser));
      await SecureStore.setItemAsync('user_data', JSON.stringify(userData));
      
      // Salvar informações não sensíveis no AsyncStorage
      await AsyncStorage.setItem('rememberMe', 'true');
      await AsyncStorage.setItem('lastLoginTime', Date.now().toString());
    } catch (error) {
      console.error("Erro ao salvar dados do usuário:", error);
    }
  };

  // Função para limpar dados do usuário
  const clearUserFromStorage = async () => {
    try {
      await SecureStore.deleteItemAsync('user_auth');
      await SecureStore.deleteItemAsync('user_data');
      await AsyncStorage.removeItem('rememberMe');
      await AsyncStorage.removeItem('lastLoginTime');
    } catch (error) {
      console.error("Erro ao remover dados do usuário:", error);
    }
  };

  // Validar formato de email
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Efeito para verificar o estado de autenticação ao iniciar o app
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    // Verificar se há dados salvos no SecureStore
    const loadStoredUser = async () => {
      try {
        const storedUserJSON = await SecureStore.getItemAsync('user_auth');
        const storedUserDataJSON = await SecureStore.getItemAsync('user_data');
        const rememberMeFlag = await AsyncStorage.getItem('rememberMe');
        const lastLoginTime = await AsyncStorage.getItem('lastLoginTime');

        // Verificar se o login expirou (7 dias)
        const loginExpired = lastLoginTime && (Date.now() - parseInt(lastLoginTime)) > 7 * 24 * 60 * 60 * 1000;
        
        // Se o rememberMe não estiver ativo ou o login expirou, não restaurar
        if (rememberMeFlag !== 'true' || loginExpired) {
          await clearUserFromStorage();
          if (isMounted) setLoading(false);
          return;
        }

        if (storedUserJSON && storedUserDataJSON) {
          const storedUser = JSON.parse(storedUserJSON);
          const storedUserData = JSON.parse(storedUserDataJSON);
          
          // Verificar se os dados estão completos e o usuário é aluno
          if (storedUser && storedUserData && storedUserData.role === 'aluno') {
            if (isMounted) {
              setUser(storedUser);
              setUserData(storedUserData);
            }
          } else {
            await clearUserFromStorage();
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados do SecureStore:", error);
        await clearUserFromStorage();
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    // Carregar dados do SecureStore
    loadStoredUser();

    // Configurar listener do Firebase Auth
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!isMounted) return;
      
      try {
        if (firebaseUser) {
          // Usuário autenticado, buscar dados adicionais no Firestore
          const userData = await fetchUserData(firebaseUser.uid);
          
          if (userData) {
            // Verificar se o usuário tem role de aluno
            if (userData.role === 'aluno') {
              if (isMounted) {
                setUser(firebaseUser);
                setUserData(userData);
              }
              
              // Só salvar no storage se "rememberMe" estiver ativo
              const rememberMeFlag = await AsyncStorage.getItem('rememberMe');
              if (rememberMeFlag === 'true') {
                await saveUserToStorage(firebaseUser, userData);
              }
            } else {
              // Usuário não é aluno, fazer logout
              await signOut(auth);
              if (isMounted) {
                setUser(null);
                setUserData(null);
              }
              await clearUserFromStorage();
            }
          } else {
            // Dados do usuário não encontrados
            if (isMounted) {
              setUser(null);
              setUserData(null);
            }
            await clearUserFromStorage();
          }
        }
      } catch (error) {
        console.error("Erro ao processar autenticação do Firebase:", error);
        if (isMounted) {
          setUser(null);
          setUserData(null);
          setLoading(false);
        }
        await clearUserFromStorage();
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
    if (!isValidEmail(email)) {
      return { success: false, error: "Formato de e-mail inválido." };
    }

    setAuthError(null);
    setLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Buscar dados do usuário
      const userData = await fetchUserData(user.uid);
      
      if (userData) {
        // Verificar se o usuário tem role de aluno
        if (userData.role === 'aluno') {
          setUser(user);
          setUserData(userData);
          
          // Salvar estado do "rememberMe"
          await AsyncStorage.setItem('rememberMe', rememberMe ? 'true' : 'false');
          
          // Salvar dados do usuário se rememberMe estiver marcado
          if (rememberMe) {
            await saveUserToStorage(user, userData);
          } else {
            await clearUserFromStorage();
          }
          
          return { success: true, user, userData };
        } else {
          // Usuário não é aluno, fazer logout
          await signOut(auth);
          setAuthError("Esta aplicação é exclusiva para alunos. Entre em contato com sua escola para mais informações.");
          await clearUserFromStorage();
          return { 
            success: false, 
            error: "Esta aplicação é exclusiva para alunos. Entre em contato com sua escola para mais informações."
          };
        }
      } else {
        setAuthError("Dados do usuário não encontrados. Entre em contato com sua escola.");
        await clearUserFromStorage();
        return { success: false, error: "Dados do usuário não encontrados. Entre em contato com sua escola." };
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      let errorMessage = "Erro ao fazer login. Verifique suas credenciais.";
      
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = "E-mail inválido.";
          break;
        case 'auth/user-not-found':
          errorMessage = "Usuário não encontrado.";
          break;
        case 'auth/wrong-password':
          errorMessage = "Senha incorreta.";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Muitas tentativas de login. Tente novamente mais tarde.";
          break;
        case 'auth/user-disabled':
          errorMessage = "Conta desativada. Entre em contato com sua escola.";
          break;
        case 'auth/network-request-failed':
          errorMessage = "Falha na conexão com a internet. Verifique sua rede e tente novamente.";
          break;
      }
      
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
      await clearUserFromStorage();
      
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
      let errorMessage = "Erro ao enviar email de recuperação.";
      
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = "E-mail inválido.";
          break;
        case 'auth/user-not-found':
          errorMessage = "Usuário não encontrado.";
          break;
        case 'auth/network-request-failed':
          errorMessage = "Falha na conexão com a internet. Verifique sua rede e tente novamente.";
          break;
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Função para verificar se o usuário ainda está autenticado
  const isUserAuthenticated = () => {
    if (!user) return false;
    
    // Verificar se os dados do usuário estão completos
    if (!userData || !userData.role) return false;
    
    // Verificar se o usuário tem a role correta
    return userData.role === 'aluno';
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