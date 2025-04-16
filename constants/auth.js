// Authentication constants
export const USER_AUTH_KEY = 'user_auth';
export const USER_DATA_KEY = 'user_data';
export const REMEMBER_ME_KEY = 'rememberMe';
export const LAST_LOGIN_TIME_KEY = 'lastLoginTime';
export const LOGIN_EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
export const REQUIRED_ROLE = 'aluno';

// Firebase error codes translation
export const ERROR_MESSAGES = {
  'auth/invalid-email': 'E-mail inválido.',
  'auth/user-not-found': 'Usuário não encontrado.',
  'auth/wrong-password': 'Senha incorreta.',
  'auth/too-many-requests': 'Muitas tentativas de login. Tente novamente mais tarde.',
  'auth/user-disabled': 'Conta desativada. Entre em contato com sua escola.',
  'auth/network-request-failed': 'Falha na conexão com a internet. Verifique sua rede e tente novamente.',
  'default': 'Erro ao fazer login. Verifique suas credenciais.'
};