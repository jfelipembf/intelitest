// hooks/useFirestoreQuery.js
import { useState, useEffect, useRef, useCallback } from 'react';
import { onSnapshot } from 'firebase/firestore';
import logService from '../utils/logService';

// Mapa em nível de módulo para reusar inscrições
const subscriptions = new Map();

/**
 * Hook para executar queries do Firestore com cache de resultados e reuso de inscrições
 * @param {Object} query - Query do Firestore
 * @param {Array} deps - Array de dependências para recalcular a query
 * @returns {Object} { data, loading, error }
 */
export function useFirestoreQuery(query, deps = []) {
  // Refs para manter referências estáveis e evitar re-renderizações
  const queryRef = useRef(query);
  const keyRef = useRef(null);
  
  // Estados
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gera uma chave única para este query
  const getQueryKey = useCallback((q) => {
    return q?._queryOptions
      ? JSON.stringify(q._queryOptions)
      : q?.toString() || 'null';
  }, []);

  // Normaliza os documentos retornados
  const normalizeDocuments = useCallback((docs) => {
    return docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }, []);

  // Efeito principal para gerenciar a inscrição no Firestore
  useEffect(() => {
    // Atualiza a referência da query se mudar
    queryRef.current = query;
    
    // Se a query for nula, retorna dados vazios
    if (!query) {
      logService.debug('useFirestoreQuery: Query nula, retornando dados vazios');
      setData([]);
      setLoading(false);
      return () => {};
    }

    // Criar controller para lidar com cancelamento
    const controller = new AbortController();
    const signal = controller.signal;

    // Gera chave única para este query
    const key = getQueryKey(query);
    keyRef.current = key;
    
    logService.debug(`useFirestoreQuery: Iniciando query com chave ${key.substring(0, 20)}...`);

    // Verifica se já existe inscrição ativa
    let existingSubscription = subscriptions.get(key);

    if (existingSubscription && !signal.aborted) {
      // Reutiliza inscrição existente
      logService.debug('useFirestoreQuery: Reutilizando inscrição existente');
      existingSubscription.listeners.push(setData);
      if (existingSubscription.cached) {
        logService.debug(`useFirestoreQuery: Usando cache com ${existingSubscription.cached.length} itens`);
        setData(existingSubscription.cached);
      }
      setLoading(false);
    } else if (!signal.aborted) {
      // Cria nova inscrição
      logService.debug('useFirestoreQuery: Criando nova inscrição no Firestore');
      const listeners = [setData];
      
      const unsubscribe = onSnapshot(
        query,
        (snapshot) => {
          if (signal.aborted) return;
          
          const normalizedData = normalizeDocuments(snapshot.docs);
          
          logService.debug(`useFirestoreQuery: Recebidos ${snapshot.docs.length} documentos do Firestore`);
          
          // Atualiza ou cria entrada no cache
          subscriptions.set(key, {
            unsubscribe,
            listeners,
            cached: normalizedData,
            timestamp: Date.now()
          });
          
          // Notifica todos os listeners
          listeners.forEach(listener => listener(normalizedData));
          setLoading(false);
        },
        (err) => {
          if (signal.aborted) return;
          
          logService.error("Erro na query do Firestore", err);
          setError(err);
          setLoading(false);
        }
      );

      // Registra a nova inscrição sem dados em cache ainda
      subscriptions.set(key, {
        unsubscribe,
        listeners,
        cached: null,
        timestamp: Date.now()
      });
    }

    // Cleanup function
    return () => {
      logService.debug('useFirestoreQuery: Executando cleanup');
      controller.abort();
      
      const currentKey = keyRef.current;
      if (!currentKey) return;

      const current = subscriptions.get(currentKey);
      if (!current) return;

      // Remove este listener da lista
      current.listeners = current.listeners.filter(listener => listener !== setData);

      // Se não há mais listeners, cancela a inscrição no Firestore
      if (current.listeners.length === 0) {
        logService.debug('useFirestoreQuery: Cancelando inscrição no Firestore - sem listeners ativos');
        current.unsubscribe();
        subscriptions.delete(currentKey);
      }
    };
  }, deps); // Re-executa se as dependências mudarem

  return { data, loading, error };
}

/**
 * Função utilitária para limpar o cache de queries não usadas
 * Atualmente não está sendo usada na aplicação, mas pode ser útil para:
 * - Limpar o cache periodicamente para evitar consumo de memória
 * - Limpar manualmente após operações como logout
 * - Implementar uma estratégia de limpeza de cache em momentos de baixa utilização
 * 
 * @param {number} olderThanMs - Limpar cache mais antigo que este valor (ms)
 */
export function clearQueryCache(olderThanMs = 1000 * 60 * 30) { // 30 minutos por padrão
  const now = Date.now();
  logService.info(`Limpando cache de queries mais antigas que ${olderThanMs/60000} minutos`);
  
  let countRemoved = 0;
  for (const [key, subscription] of subscriptions.entries()) {
    // Só limpa entradas que não têm listeners ativos
    if (subscription.listeners.length === 0 && 
        subscription.timestamp && 
        (now - subscription.timestamp > olderThanMs)) {
      
      if (subscription.unsubscribe) {
        subscription.unsubscribe();
      }
      subscriptions.delete(key);
      countRemoved++;
    }
  }
  
  logService.info(`${countRemoved} queries foram removidas do cache`);
}

// Adiciona função para imprimir estatísticas do cache - util para debugging
export function debugCache() {
  logService.debug('=== Estado atual do cache de queries ===');
  logService.debug(`Total de queries no cache: ${subscriptions.size}`);
  
  let activeListeners = 0;
  let withCache = 0;
  
  subscriptions.forEach((sub, key) => {
    activeListeners += sub.listeners.length;
    if (sub.cached) withCache++;
  });
  
  logService.debug(`Queries com listeners ativos: ${activeListeners}`);
  logService.debug(`Queries com dados em cache: ${withCache}`);
  
  return {
    totalQueries: subscriptions.size,
    activeListeners,
    withCache
  };
}

/**
 * Exporta o mapa de inscrições para uso em testes ou depuração
 * NÃO USE em código de produção - apenas para fins de teste/debug
 */
export const __subscriptions = subscriptions;
