import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  useMemo,
  useCallback
} from 'react';
import PropTypes from 'prop-types';
import { useAuth } from './useAuth';
import { useSchool } from './useSchool';
import { useFirestoreQuery } from './useFirestoreQuery';
import { lessonService } from '../services/firebaseService';
import logService from '../utils/logService';
import { getDocs } from 'firebase/firestore';

// Criar contexto
const LessonsContext = createContext();

// Valor padrão para dados de lição
const DEFAULT_VALUES = {
  subject: 'Disciplina não informada',
  startTime: '00:00',
  endTime: '00:00',
  teacher: { label: 'Professor não informado', value: '' },
  room: { label: 'Sala não informada', value: '' }
};

export const LessonsProvider = ({ children }) => {
  const { userData } = useAuth();
  const { schoolData, classData } = useSchool();

  // Estado para error (loading é gerenciado pelo useFirestoreQuery)
  const [error, setError] = useState(null);
  const [manualLessons, setManualLessons] = useState([]);
  const [forcedLoading, setForcedLoading] = useState(false);

  // Log de depuração para entender o fluxo
  useEffect(() => {
    logService.debug('useLessons - Estado atual:', { 
      'Tem userData': !!userData,
      'SchoolID': schoolData?.id,
      'ClassID': classData?.id,
      'Tem query': !!lessonsQuery,
      'Raw lessons': rawLessons?.length || 0,
      'Manual lessons': manualLessons.length
    });
  }, [userData, schoolData, classData, lessonsQuery, rawLessons, manualLessons]);

  // Criar query das aulas
  const lessonsQuery = useMemo(() => {
    if (!schoolData?.id || !classData?.id) {
      logService.warn('Query de aulas não pode ser criada: dados insuficientes', {
        schoolId: schoolData?.id, 
        classId: classData?.id
      });
      return null;
    }
    
    logService.debug('Criando query de aulas', {
      schoolId: schoolData.id,
      classId: classData.id
    });
    
    return lessonService.getLessonsCollection(schoolData.id, classData.id);
  }, [schoolData?.id, classData?.id]);

  // Fetch manual como backup caso o useFirestoreQuery tenha problemas
  useEffect(() => {
    // Se já temos aulas via useFirestoreQuery, não precisamos da busca manual
    if (rawLessons?.length > 0) {
      logService.debug('Já temos aulas via useFirestoreQuery, pulando busca manual');
      return;
    }

    // Se não temos query, não podemos buscar
    if (!lessonsQuery) {
      return;
    }

    const fetchManualLessons = async () => {
      try {
        logService.info('Buscando aulas manualmente como backup');
        setForcedLoading(true);
        
        const snapshot = await getDocs(lessonsQuery);
        
        if (snapshot.empty) {
          logService.warn('Nenhuma aula encontrada na busca manual');
          setManualLessons([]);
        } else {
          const lessons = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          logService.debug(`Busca manual encontrou ${lessons.length} aulas`);
          setManualLessons(lessons);
        }
      } catch (err) {
        logService.error('Erro na busca manual de aulas', err);
        setError(`Erro na busca manual: ${err.message}`);
      } finally {
        setForcedLoading(false);
      }
    };

    // Aguardar um pouco para ver se o useFirestoreQuery resolve
    const timer = setTimeout(() => {
      if (rawLessons?.length === 0) {
        fetchManualLessons();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [lessonsQuery, rawLessons]);

  // Usar useFirestoreQuery para obter e escutar aulas com cache
  const { 
    data: rawLessons, 
    loading: queryLoading, 
    error: queryError 
  } = useFirestoreQuery(lessonsQuery, [lessonsQuery]);

  // Processar e normalizar as aulas - usando tanto as aulas do useFirestoreQuery quanto as do backup manual
  const lessons = useMemo(() => {
    // Se temos aulas do useFirestoreQuery, usar essas
    if (rawLessons?.length > 0) {
      logService.debug(`Normalizando ${rawLessons.length} aulas do useFirestoreQuery`);
      return rawLessons.map(lesson => 
        lessonService.normalizeLesson({ id: lesson.id, data: () => lesson })
      );
    }
    
    // Se não temos do useFirestoreQuery, mas temos do backup manual, usar essas
    if (manualLessons.length > 0) {
      logService.debug(`Normalizando ${manualLessons.length} aulas da busca manual`);
      return manualLessons.map(lesson => 
        lessonService.normalizeLesson({ id: lesson.id, data: () => lesson })
      );
    }
    
    // Se não temos nenhuma, retornar array vazio
    return [];
  }, [rawLessons, manualLessons]);

  // Atualizar erro se houver erro na query
  useEffect(() => {
    if (queryError) {
      logService.error('Erro ao carregar aulas:', queryError);
      setError(`Erro ao carregar aulas: ${queryError.message}`);
    } else {
      setError(null);
    }
  }, [queryError]);

  // Função para recarregar dados
  const refreshLessons = useCallback(() => {
    logService.info('Solicitando recarga de aulas');
    
    // Se temos dados suficientes, fazer busca manual
    if (schoolData?.id && classData?.id) {
      setForcedLoading(true);
      
      // Primeiro limpa o erro
      setError(null);
      
      // Cria a collection reference
      const lessonsCollection = lessonService.getLessonsCollection(
        schoolData.id, 
        classData.id
      );
      
      // Busca os dados
      getDocs(lessonsCollection)
        .then(snapshot => {
          const lessons = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          logService.debug(`Recarga manual encontrou ${lessons.length} aulas`);
          setManualLessons(lessons);
        })
        .catch(err => {
          logService.error('Erro na recarga manual de aulas', err);
          setError(`Erro ao recarregar aulas: ${err.message}`);
        })
        .finally(() => {
          setForcedLoading(false);
        });
    }
  }, [schoolData?.id, classData?.id]);

  // Loading combinado
  const loading = queryLoading || forcedLoading;

  // Memorizar o valor do contexto para evitar re-renderizações desnecessárias
  const contextValue = useMemo(
    () => ({
      lessons,
      loading,
      error,
      refreshLessons
    }),
    [lessons, loading, error, refreshLessons]
  );

  return (
    <LessonsContext.Provider value={contextValue}>
      {children}
    </LessonsContext.Provider>
  );
};

LessonsProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useLessons = () => {
  const ctx = useContext(LessonsContext);
  if (!ctx) {
    throw new Error('useLessons deve ser usado dentro de <LessonsProvider>');
  }
  return ctx;
};
