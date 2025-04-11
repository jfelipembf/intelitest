import { useState, useEffect, useContext, createContext } from 'react';
import { db } from '../firebase/config';
import { collection, query, where, getDocs, orderBy, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from './useAuth';
import { useSchool } from './useSchool';

// Criar contexto para as atividades
const ActivitiesContext = createContext({});

// Provider para o contexto de atividades
export const ActivitiesProvider = ({ children }) => {
  const { user, userData } = useAuth();
  const { schoolData, classData } = useSchool();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activities, setActivities] = useState([]);
  const [pendingActivities, setPendingActivities] = useState([]);
  const [completedActivities, setCompletedActivities] = useState([]);
  const [updatingActivity, setUpdatingActivity] = useState(false);

  // Função auxiliar para tratamento de erros
  const handleError = (message, error) => {
    console.error(message, error);
    setError(`${message}: ${error.message}`);
    setLoading(false);
  };

  // Função para buscar atividades
  const fetchActivities = async () => {
    if (!userData || !schoolData?.id || !classData?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const schoolId = schoolData.id;
      const classId = classData.id;
      
      // Coleção de aulas
      const lessonsCollectionRef = collection(db, 'schools', schoolId, 'classes', classId, 'lessons');
      const lessonsSnapshot = await getDocs(lessonsCollectionRef);
      
      // Para cada aula, buscar suas atividades
      const activitiesPromises = lessonsSnapshot.docs.map(async (lessonDoc) => {
        const lessonId = lessonDoc.id;
        const activitiesCollectionRef = collection(
          db, 
          'schools', 
          schoolId, 
          'classes', 
          classId, 
          'lessons', 
          lessonId, 
          'activities'
        );
        
        const activitiesSnapshot = await getDocs(activitiesCollectionRef);
        
        // Mapear documentos para objetos com dados normalizados
        return activitiesSnapshot.docs.map(activityDoc => {
          const activityData = activityDoc.data();
          return {
            id: activityDoc.id,
            lessonId,
            ...activityData,
            // Garantir que datas sejam strings para facilitar manipulação
            startDate: activityData.startDate || null,
            endDate: activityData.endDate || null,
            createdAt: activityData.createdAt ? 
              (activityData.createdAt.toDate ? activityData.createdAt.toDate().toISOString() : activityData.createdAt) 
              : null,
            // Garantir que tenhamos referências para classe e disciplina
            class: activityData.class || {
              id: classId,
              name: classData.name
            },
            subject: activityData.subject || null
          };
        });
      });
      
      // Resolver todas as promessas e achatar o array
      const allActivitiesArrays = await Promise.all(activitiesPromises);
      const allActivities = allActivitiesArrays.flat();
      
      // Ordenar por data de início (mais recentes primeiro)
      const sortedActivities = allActivities.sort((a, b) => {
        // Se não tiver data, colocar no final
        if (!a.startDate) return 1;
        if (!b.startDate) return -1;
        
        // Comparar datas (mais recentes primeiro)
        return new Date(b.startDate) - new Date(a.startDate);
      });
      
      setActivities(sortedActivities);
      
      // Separar atividades pendentes e concluídas
      const pending = sortedActivities.filter(activity => !activity.score);
      const completed = sortedActivities.filter(activity => activity.score !== null);
      
      setPendingActivities(pending);
      setCompletedActivities(completed);
      
      setLoading(false);
    } catch (error) {
      handleError("Erro ao buscar atividades", error);
    }
  };

  // Função para buscar atividades por disciplina
  const getActivitiesBySubject = (subjectId) => {
    if (!subjectId) return [];
    return activities.filter(activity => activity.subject?.id === subjectId);
  };

  // Função para verificar se uma atividade está atrasada
  const isActivityLate = (activity) => {
    if (!activity.endDate) return false;
    const today = new Date();
    const endDate = new Date(activity.endDate);
    return today > endDate && !activity.score;
  };

  // Função para obter atividades atrasadas
  const getLateActivities = () => {
    return pendingActivities.filter(activity => isActivityLate(activity));
  };

  // Função para obter atividades próximas do prazo (3 dias)
  const getUpcomingActivities = () => {
    const today = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);
    
    return pendingActivities.filter(activity => {
      if (!activity.endDate) return false;
      const endDate = new Date(activity.endDate);
      return endDate > today && endDate <= threeDaysFromNow;
    });
  };

  // Função para marcar uma atividade como concluída
  const markActivityAsCompleted = async (activity, score = 10) => {
    if (!userData || !schoolData?.id || !classData?.id || !activity?.id || !activity?.lessonId) {
      setError("Dados insuficientes para atualizar a atividade");
      return false;
    }

    setUpdatingActivity(true);
    setError(null);

    try {
      const schoolId = schoolData.id;
      const classId = classData.id;
      const lessonId = activity.lessonId;
      const activityId = activity.id;
      
      // Referência ao documento da atividade
      const activityDocRef = doc(
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
      
      // Atualizar o documento com o score (nota padrão 10)
      await updateDoc(activityDocRef, {
        score: score
      });
      
      // Atualizar o estado local
      const updatedActivities = activities.map(act => 
        act.id === activityId ? { ...act, score } : act
      );
      
      setActivities(updatedActivities);
      
      // Atualizar listas de pendentes e concluídas
      const pending = updatedActivities.filter(act => !act.score);
      const completed = updatedActivities.filter(act => act.score !== null);
      
      setPendingActivities(pending);
      setCompletedActivities(completed);
      
      setUpdatingActivity(false);
      return true;
    } catch (error) {
      handleError("Erro ao marcar atividade como concluída", error);
      setUpdatingActivity(false);
      return false;
    }
  };

  // Função para marcar uma atividade como pendente novamente
  const markActivityAsPending = async (activity) => {
    if (!userData || !schoolData?.id || !classData?.id || !activity?.id || !activity?.lessonId) {
      setError("Dados insuficientes para atualizar a atividade");
      return false;
    }

    setUpdatingActivity(true);
    setError(null);

    try {
      const schoolId = schoolData.id;
      const classId = classData.id;
      const lessonId = activity.lessonId;
      const activityId = activity.id;
      
      // Referência ao documento da atividade
      const activityDocRef = doc(
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
      
      // Atualizar o documento removendo o score
      await updateDoc(activityDocRef, {
        score: null
      });
      
      // Atualizar o estado local
      const updatedActivities = activities.map(act => 
        act.id === activityId ? { ...act, score: null } : act
      );
      
      setActivities(updatedActivities);
      
      // Atualizar listas de pendentes e concluídas
      const pending = updatedActivities.filter(act => !act.score);
      const completed = updatedActivities.filter(act => act.score !== null);
      
      setPendingActivities(pending);
      setCompletedActivities(completed);
      
      setUpdatingActivity(false);
      return true;
    } catch (error) {
      handleError("Erro ao marcar atividade como pendente", error);
      setUpdatingActivity(false);
      return false;
    }
  };

  // Efeito para buscar atividades quando o usuário, escola ou turma mudam
  useEffect(() => {
    if (userData && schoolData?.id && classData?.id) {
      fetchActivities();
    } else {
      setActivities([]);
      setPendingActivities([]);
      setCompletedActivities([]);
      setLoading(false);
    }
  }, [userData, schoolData?.id, classData?.id]);

  // Função para atualizar os dados manualmente
  const refreshActivities = () => fetchActivities();

  return (
    <ActivitiesContext.Provider
      value={{
        activities,
        pendingActivities,
        completedActivities,
        loading,
        error,
        updatingActivity,
        refreshActivities,
        getActivitiesBySubject,
        isActivityLate,
        getLateActivities,
        getUpcomingActivities,
        markActivityAsCompleted,
        markActivityAsPending
      }}
    >
      {children}
    </ActivitiesContext.Provider>
  );
};

// Hook personalizado para usar o contexto de atividades
export const useActivities = () => {
  return useContext(ActivitiesContext);
};
