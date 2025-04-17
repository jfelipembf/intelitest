import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback
} from 'react';
import PropTypes from 'prop-types';
import { useAuth } from './useAuth';
import { useSchool } from './useSchool';
import { useLessons } from './useLessons';
import { updateDoc, doc, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { activityService } from '../services/firebaseService';
import logService from '../utils/logService';

// Constantes para valores padrão e configurações
const UPCOMING_DAYS_WINDOW = 3; // Dias para considerar "próximas atividades"

// Contexto para atividades
const ActivitiesContext = createContext(null);

export const ActivitiesProvider = ({ children }) => {
  const { userData } = useAuth();
  const { schoolData, classData } = useSchool();
  const { lessons, loading: lessonsLoading } = useLessons();

  // Estados
  const [allActivities, setAllActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Logging para depuração do estado atual
  useEffect(() => {
    logService.debug('useActivities - Estado atual:', {
      'Tem userData': !!userData,
      'Tem schoolData': !!schoolData?.id,
      'Tem classData': !!classData?.id,
      'Lessons carregadas': lessons.length,
      'Lessons carregando': lessonsLoading,
      'Total atividades': allActivities.length
    });
  }, [userData, schoolData, classData, lessons, lessonsLoading, allActivities]);

  // Efeito para buscar atividades para cada aula
  useEffect(() => {
    // Verificar dados necessários
    if (
      !userData ||
      !schoolData?.id ||
      !classData?.id ||
      lessonsLoading ||
      !lessons.length
    ) {
      logService.debug('useActivities: Dados insuficientes para buscar atividades', {
        'userData': !!userData,
        'schoolId': schoolData?.id,
        'classId': classData?.id,
        'lessonsLoading': lessonsLoading,
        'lessonsCount': lessons.length
      });
      setAllActivities([]);
      setLoading(false);
      return;
    }

    // Iniciar loading
    setLoading(true);
    setError(null);
    
    logService.info('useActivities: Iniciando busca de atividades para aulas');

    // Criar controller para abortar operações se o componente for desmontado
    const controller = new AbortController();
    const signal = controller.signal;

    // Array para armazenar listeners/unsubscribes
    const unsubscribes = [];

    // Função para combinar e ordenar atividades de todas as aulas
    const updateActivitiesList = (lessonActivitiesMap) => {
      // Converter o mapa em um array plano
      let allActs = [];
      lessonActivitiesMap.forEach(activities => {
        allActs = [...allActs, ...activities];
      });

      // Ordenar - mais recentes primeiro
      allActs.sort((a, b) => new Date(b.startDate || 0) - new Date(a.startDate || 0));
      
      logService.debug(`useActivities: Lista atualizada com ${allActs.length} atividades`);
      
      // Atualizar estado
      setAllActivities(allActs);
      setLoading(false);
    };

    // Map para armazenar atividades de cada aula
    const activitiesByLesson = new Map();
    
    // Configurar listeners para cada aula
    logService.debug(`useActivities: Configurando listeners para ${lessons.length} aulas`);
    
    lessons.forEach(lesson => {
      // Se já estiver abortado, não criar mais listeners
      if (signal.aborted) return;

      const schoolId = schoolData.id;
      const classId = classData.id;
      const lessonId = lesson.id;

      // Inicializar a entrada do mapa para esta aula
      activitiesByLesson.set(lessonId, []);

      // Referência da coleção de atividades
      const activitiesCollection = activityService.getActivitiesCollection(
        schoolId,
        classId,
        lessonId
      );

      logService.debug(`useActivities: Criando listener para aula ${lessonId}`);

      // Criar listener para esta coleção de atividades
      const unsubscribe = onSnapshot(
        activitiesCollection,
        snapshot => {
          // Se abortado, não processar
          if (signal.aborted) return;

          // Processar os documentos
          logService.debug(`useActivities: Recebidos ${snapshot.docs.length} documentos para aula ${lessonId}`);
          
          const activities = snapshot.docs.map(docSnap => 
            activityService.normalizeActivity(docSnap, lessonId, classData)
          );

          // Atualizar o mapa
          activitiesByLesson.set(lessonId, activities);

          // Atualizar a lista completa
          updateActivitiesList(activitiesByLesson);
        },
        error => {
          // Se abortado, não processar
          if (signal.aborted) return;

          logService.error(`Erro ao buscar atividades para aula ${lessonId}:`, error);
          // Em caso de erro, manter as atividades anteriores para esta aula
          updateActivitiesList(activitiesByLesson);
        }
      );

      // Armazenar o unsubscribe para limpeza posterior
      unsubscribes.push(unsubscribe);
    });

    // Cleanup - remover todos os listeners quando o componente desmontar
    return () => {
      logService.debug(`useActivities: Limpando ${unsubscribes.length} listeners`);
      controller.abort();
      unsubscribes.forEach(unsubscribe => unsubscribe());
    };
  }, [userData, schoolData?.id, classData?.id, lessons, lessonsLoading]);

  // Derivados memorizados - listas filtradas de atividades
  const pendingActivities = useMemo(
    () => allActivities.filter(a => a.score == null),
    [allActivities]
  );

  const completedActivities = useMemo(
    () => allActivities.filter(a => a.score != null),
    [allActivities]
  );

  // Função para verificar se uma atividade está atrasada - usando serviço
  const isActivityLate = useCallback(
    activity => activityService.isActivityLate(activity),
    []
  );

  // Função para obter atividades atrasadas
  const getLateActivities = useCallback(
    () => pendingActivities.filter(isActivityLate),
    [pendingActivities, isActivityLate]
  );

  // Função para obter atividades próximas
  const getUpcomingActivities = useCallback(
    () => activityService.getUpcomingActivities(pendingActivities),
    [pendingActivities]
  );

  // Função para recarregar todas as atividades
  const refreshActivities = useCallback(() => {
    if (
      !userData ||
      !schoolData?.id ||
      !classData?.id ||
      lessonsLoading ||
      !lessons.length
    ) {
      logService.warn('Não é possível recarregar atividades: dados insuficientes');
      return;
    }

    logService.info('Recarregando atividades...');
    setLoading(true);
    // O efeito será executado novamente automaticamente
  }, [userData, schoolData?.id, classData?.id, lessons, lessonsLoading]);

  // Função para marcar atividade como concluída/pendente
  const toggleActivity = useCallback(
    async (activity, defaultScore = 10) => {
      if (!activity?.id || !activity?.lessonId) {
        setError('Dados insuficientes para atualizar atividade');
        return false;
      }

      try {
        // Obter IDs necessários
        const schoolId = activity.class?.id || schoolData?.id;
        const classId = activity.class?.id || classData?.id;
        const lessonId = activity.lessonId;
        const activityId = activity.id;

        if (!schoolId || !classId || !lessonId || !activityId) {
          setError('IDs incompletos para atualizar atividade');
          return false;
        }
        
        logService.info(`Alterando status da atividade ${activityId}`);

        // Referenciar o documento
        const ref = doc(
          db,
          'schools',
          schoolId,
          'classes',
          classId,
          'lessons',
          lessonId,
          'activities',
          activityId
        );

        // Definir novo score (alterna entre valor ou null)
        const newScore = activity.score == null ? defaultScore : null;
        await updateDoc(ref, { score: newScore });
        
        logService.debug(`Atividade ${activityId} atualizada com sucesso. Score: ${newScore}`);

        // Não precisamos fazer refresh manual pois os listeners detectarão a mudança
        return true;
      } catch (err) {
        logService.error("Erro ao atualizar atividade:", err);
        setError(`Erro ao atualizar atividade: ${err.message}`);
        return false;
      }
    },
    [schoolData?.id, classData?.id]
  );

  // Memorizar o valor do contexto para evitar re-renderizações
  const contextValue = useMemo(
    () => ({
      activities: allActivities,
      pendingActivities,
      completedActivities,
      loading,
      error,
      getLateActivities,
      getUpcomingActivities,
      isActivityLate,
      toggleActivity,
      refreshActivities
    }),
    [
      allActivities,
      pendingActivities,
      completedActivities,
      loading,
      error,
      getLateActivities,
      getUpcomingActivities,
      isActivityLate,
      toggleActivity,
      refreshActivities
    ]
  );

  return (
    <ActivitiesContext.Provider value={contextValue}>
      {children}
    </ActivitiesContext.Provider>
  );
};

ActivitiesProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useActivities = () => {
  const ctx = useContext(ActivitiesContext);
  if (!ctx) throw new Error('useActivities deve estar dentro de ActivitiesProvider');
  return ctx;
};
