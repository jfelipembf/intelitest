import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  useMemo,
  useCallback
} from 'react';
import PropTypes from 'prop-types';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { useAuth } from './useAuth';
import { useSchool } from './useSchool';

const LessonsContext = createContext();

export const LessonsProvider = ({ children }) => {
  const { userData } = useAuth();
  const { schoolData, classData } = useSchool();

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadLessons = useCallback(async () => {
    // Se faltar qualquer ID, limpa e termina
    if (!userData || !schoolData?.id || !classData?.id) {
      setLessons([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const lessonsRef = collection(
        db,
        'schools',
        schoolData.id,
        'classes',
        classData.id,
        'lessons'
      );
      const snapshot = await getDocs(lessonsRef);

      const data = snapshot.docs.map(docSnap => {
        const d = docSnap.data();

        // Processa daysOfWeek garantindo formato correto
        const daysOfWeek = Array.isArray(d.daysOfWeek)
          ? d.daysOfWeek.reduce((acc, day) => {
              if (day && day.value) {
                acc.push({
                  label: day.label || '',
                  value: day.value
                });
              }
              return acc;
            }, [])
          : [];

        return {
          id: docSnap.id,
          subject: d.subject || 'Disciplina não informada',
          startTime: d.startTime || '00:00',
          endTime: d.endTime || '00:00',
          daysOfWeek,
          teacher: d.teacher || { label: 'Professor não informado', value: '' },
          room: d.room || { label: 'Sala não informada', value: '' },
          ...d
        };
      });

      setLessons(data);
    } catch (err) {
      console.error('Erro ao carregar aulas', err);
      setError(`Erro ao carregar aulas: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [userData, schoolData, classData]);

  // Carrega ao montar e sempre que schoolData/classData mudarem
  useEffect(() => {
    loadLessons();
  }, [loadLessons]);

  const contextValue = useMemo(
    () => ({
      lessons,
      loading,
      error,
      refreshLessons: loadLessons
    }),
    [lessons, loading, error, loadLessons]
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
