import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback
} from 'react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { useAuth } from './useAuth';
import { useSchool } from './useSchool';
import { useLessons } from './useLessons';

const ActivitiesContext = createContext(null);

export const ActivitiesProvider = ({ children }) => {
  const { userData } = useAuth();                           // conexão com autenticação :contentReference[oaicite:2]{index=2}&#8203;:contentReference[oaicite:3]{index=3}
  const { schoolData, classData } = useSchool();            // dados de escola/turma :contentReference[oaicite:4]{index=4}&#8203;:contentReference[oaicite:5]{index=5}
  const { lessons, loading: lessonsLoading } = useLessons(); // lista de aulas :contentReference[oaicite:6]{index=6}&#8203;:contentReference[oaicite:7]{index=7}

  const [activities, setActivities] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  // 1) Fetch de todas as atividades (um getDocs por lesson)
  const fetchActivities = useCallback(async () => {
    if (
      !userData ||
      !schoolData?.id ||
      !classData?.id ||
      lessonsLoading
    ) {
      // Nenhum dado ainda — limpa e sai
      setActivities([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const schoolId = schoolData.id;
      const classId  = classData.id;

      const arrays = await Promise.all(
        lessons.map(lesson => {
          const ref = collection(
            db,
            'schools',
            schoolId,
            'classes',
            classId,
            'lessons',
            lesson.id,
            'activities'
          );
          return getDocs(ref).then(snap =>
            snap.docs.map(docSnap => {
              const data = docSnap.data();
              return {
                id: docSnap.id,
                lessonId: lesson.id,
                // normaliza timestamps
                startDate: data.startDate?.toDate?.().toISOString() || null,
                endDate:   data.endDate?.toDate?.().toISOString()   || null,
                createdAt: data.createdAt?.toDate?.().toISOString() || null,
                score:     data.score ?? null,
                class:     data.class   || { id: classId, name: classData.name },
                subject:   data.subject || null,
                ...data
              };
            })
          );
        })
      );

      // 2) Achata e ordena apenas uma vez
      const allActs = arrays.flat();
      allActs.sort((a, b) =>
        new Date(b.startDate || 0) - new Date(a.startDate || 0)
      );

      setActivities(allActs);
    } catch (err) {
      setError(`Erro ao buscar atividades: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [
    userData,
    schoolData?.id,
    classData?.id,
    lessons,
    lessonsLoading
  ]);

  // 3) Chama sempre que dependencies mudarem
  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  // 4) Derivados memorizados
  const pendingActivities = useMemo(
    () => activities.filter(a => a.score == null),
    [activities]
  );
  const completedActivities = useMemo(
    () => activities.filter(a => a.score != null),
    [activities]
  );

  const isActivityLate = useCallback(
    activity =>
      activity.endDate &&
      new Date(activity.endDate) < new Date() &&
      activity.score == null,
    []
  );
  const getLateActivities = useCallback(
    () => pendingActivities.filter(isActivityLate),
    [pendingActivities, isActivityLate]
  );
  const getUpcomingActivities = useCallback(() => {
    const today = new Date();
    const in3   = new Date();
    in3.setDate(today.getDate() + 3);
    return pendingActivities.filter(a =>
      a.endDate &&
      new Date(a.endDate) > today &&
      new Date(a.endDate) <= in3
    );
  }, [pendingActivities]);

  // 5) Unifica marcar concluída/pendente
  const toggleActivity = useCallback(
    async (activity, defaultScore = 10) => {
      if (!activity?.id) {
        setError('Dados insuficientes para atualizar atividade');
        return false;
      }
      try {
        const ref = doc(
          db,
          'schools',
          activity.class.id,   // ou activity.schoolId, se existir
          'classes',
          activity.class.id,
          'lessons',
          activity.lessonId,
          'activities',
          activity.id
        );
        const newScore = activity.score == null ? defaultScore : null;
        await updateDoc(ref, { score: newScore });
        // Nota: onSnapshot não está ativo aqui, então refetch manual:
        await fetchActivities();
        return true;
      } catch (err) {
        setError(`Erro ao atualizar atividade: ${err.message}`);
        return false;
      }
    },
    [fetchActivities]
  );

  const value = useMemo(
    () => ({
      activities,
      pendingActivities,
      completedActivities,
      loading,
      error,
      getLateActivities,
      getUpcomingActivities,
      isActivityLate,
      toggleActivity,
      refreshActivities: fetchActivities
    }),
    [
      activities,
      pendingActivities,
      completedActivities,
      loading,
      error,
      getLateActivities,
      getUpcomingActivities,
      isActivityLate,
      toggleActivity,
      fetchActivities
    ]
  );

  return (
    <ActivitiesContext.Provider value={value}>
      {children}
    </ActivitiesContext.Provider>
  );
};

export const useActivities = () => {
  const ctx = useContext(ActivitiesContext);
  if (!ctx) throw new Error('useActivities deve estar dentro de ActivitiesProvider');
  return ctx;
};
