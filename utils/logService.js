/**
 * logService.js
 * Serviço centralizado de logging com controle por ambiente
 */

// Determinar se estamos em modo de produção
// Em React Native, __DEV__ é uma variável global que o próprio React Native define
const isProduction = !__DEV__;

// Configuração para habilitar tipos específicos de log em produção
// Na produção, apenas erros são registrados por padrão
const config = {
  logErrorsInProduction: true,     // Mantém erros em produção para diagnosticar problemas
  logWarningsInProduction: false,  // Desativa warnings em produção
  logInfoInProduction: false,      // Desativa logs informativos em produção
  logDebugInProduction: false      // Desativa logs de debug em produção
};

/**
 * Função para log de erro - sempre deve ser usada para erros
 * Em produção, registra o erro, mas não mostra detalhes sensíveis
 */
const error = (message, errorObject = null) => {
  if (isProduction && !config.logErrorsInProduction) return;
  
  if (errorObject) {
    console.error(`[ERRO] ${message}`, isProduction ? 'Detalhes ocultados em produção' : errorObject);
  } else {
    console.error(`[ERRO] ${message}`);
  }

  // Aqui poderia adicionar integração com serviços de monitoramento de erros
  // como Sentry, Firebase Crashlytics, etc.
};

/**
 * Função para log de aviso - para problemas não críticos
 * Em produção, estes logs são omitidos por padrão
 */
const warn = (message, data = null) => {
  if (isProduction && !config.logWarningsInProduction) return;
  
  if (data) {
    console.warn(`[AVISO] ${message}`, data);
  } else {
    console.warn(`[AVISO] ${message}`);
  }
};

/**
 * Função para log informativo - ações importantes do sistema
 * Em produção, estes logs são omitidos por padrão
 */
const info = (message, data = null) => {
  if (isProduction && !config.logInfoInProduction) return;
  
  if (data) {
    console.info(`[INFO] ${message}`, data);
  } else {
    console.info(`[INFO] ${message}`);
  }
};

/**
 * Função para log de debug - detalhes técnicos para desenvolvimento
 * Em produção, estes logs são omitidos por padrão
 */
const debug = (message, data = null) => {
  if (isProduction && !config.logDebugInProduction) return;
  
  if (data) {
    console.log(`[DEBUG] ${message}`, data);
  } else {
    console.log(`[DEBUG] ${message}`);
  }
};

export default {
  error,
  warn,
  info,
  debug,
  isProduction
}; 