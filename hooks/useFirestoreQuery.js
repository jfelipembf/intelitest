// hooks/useFirestoreQuery.js
import { useState, useEffect } from 'react';
import { onSnapshot } from 'firebase/firestore';

// Mapa em nível de módulo para reusar inscrições
const subscriptions = new Map();

export function useFirestoreQuery(query, deps = []) {
  // Chave única para este query (por exemplo, stringified path + filtros)
  const key = query._queryOptions
    ? JSON.stringify(query._queryOptions)
    : query.toString();

  // Se já existe uma inscrição, já temos dados em cache
  const entry = subscriptions.get(key);

  const [data, setData]     = useState(entry ? entry.cached : []);
  const [loading, setLoading] = useState(!entry);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let sub = subscriptions.get(key);

    if (sub) {
      // reutiliza inscrição existente
      sub.listeners.push(setData);
      if (sub.cached) setData(sub.cached);
      setLoading(false);
    } else {
      // cria nova inscrição
      const listeners = [setData];
      const unsub = onSnapshot(
        query,
        snap => {
          const arr = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          subscriptions.set(key, { unsub, listeners, cached: arr });
          listeners.forEach(cb => cb(arr));
          setLoading(false);
        },
        err => {
          setError(err);
          setLoading(false);
        }
      );
      subscriptions.set(key, { unsub, listeners, cached: null });
    }

    return () => {
      const current = subscriptions.get(key);
      if (!current) return;
      // remove este listener
      current.listeners = current.listeners.filter(cb => cb !== setData);
      // se não sobrou mais ninguém, desfaz a inscrição no Firebase
      if (current.listeners.length === 0) {
        current.unsub();
        subscriptions.delete(key);
      }
    };
  }, deps);  // re‑executa se mudar qualquer dependência

  return { data, loading, error };
}
