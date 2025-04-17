import { db } from '../firebase/config';
import { doc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';

// Funções utilitárias para manipulação de timestamps Firestore
export const timestampUtils = {
  // Converte timestamp do Firestore para ISO string ou valor padrão
  toISOString: (timestamp, defaultValue = null) => {
    return timestamp?.toDate?.().toISOString() || defaultValue;
  },
  
  // Converte ISO string para Date
  fromISOString: (isoString) => {
    return isoString ? new Date(isoString) : null;
  },
  
  // Converte timestamp do Firestore para Date ou valor padrão
  toDate: (timestamp, defaultValue = null) => {
    return timestamp?.toDate?.() || defaultValue;
  }
};

// Serviço para escola e turmas
export const schoolService = {
  // Recupera dados de uma escola
  fetchSchoolData: async (schoolId) => {
    const snap = await getDoc(doc(db, 'schools', schoolId));
    if (!snap.exists()) throw new Error('Escola não encontrada');
    return { id: snap.id, ...snap.data() };
  },

  // Recupera dados de uma turma
  fetchClassData: async (schoolId, classId, fallbackUserName) => {
    const snap = await getDoc(doc(db, 'schools', schoolId, 'classes', classId));
    if (!snap.exists()) {
      return {
        id: classId || 'unknown',
        name: fallbackUserName || 'Turma não especificada',
        teacherIds: []
      };
    }
    return { id: snap.id, ...snap.data() };
  },

  // Recupera disciplinas de uma turma
  fetchSubjects: async (schoolId, classId) => {
    const col = collection(db, 'schools', schoolId, 'classes', classId, 'subjects');
    const snap = await getDocs(col);
    return snap.empty
      ? []
      : snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },

  // Recupera dados de professores
  fetchTeachers: async (teacherIds) => {
    if (!teacherIds?.length) return [];
    const q = query(
      collection(db, 'teachers'),
      where('__name__', 'in', teacherIds)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
};

// Serviço para aulas
export const lessonService = {
  // Recupera referência de coleção para aulas
  getLessonsCollection: (schoolId, classId) => {
    return collection(db, 'schools', schoolId, 'classes', classId, 'lessons');
  },
  
  // Normaliza dados de uma aula
  normalizeLesson: (docSnap, defaultValues = {}) => {
    const id = docSnap.id;
    const d = docSnap.data();
    
    const defaults = {
      subject: 'Disciplina não informada',
      startTime: '00:00',
      endTime: '00:00',
      teacher: { label: 'Professor não informado', value: '' },
      room: { label: 'Sala não informada', value: '' },
      ...defaultValues
    };
    
    // Normaliza daysOfWeek
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
      id,
      subject: d.subject || defaults.subject,
      startTime: d.startTime || defaults.startTime,
      endTime: d.endTime || defaults.endTime,
      daysOfWeek,
      teacher: d.teacher || defaults.teacher,
      room: d.room || defaults.room,
      ...d
    };
  }
};

// Serviço para atividades
export const activityService = {
  // Recupera referência para coleção de atividades
  getActivitiesCollection: (schoolId, classId, lessonId) => {
    return collection(
      db,
      'schools',
      schoolId,
      'classes',
      classId,
      'lessons',
      lessonId,
      'activities'
    );
  },
  
  // Normaliza dados de uma atividade
  normalizeActivity: (docSnap, lessonId, classData) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      lessonId,
      // normaliza timestamps
      startDate: timestampUtils.toISOString(data.startDate),
      endDate: timestampUtils.toISOString(data.endDate),
      createdAt: timestampUtils.toISOString(data.createdAt),
      score: data.score ?? null,
      class: data.class || { id: classData.id, name: classData.name },
      subject: data.subject || null,
      ...data
    };
  },
  
  // Verifica se uma atividade está atrasada
  isActivityLate: (activity) => {
    return (
      activity.endDate &&
      new Date(activity.endDate) < new Date() &&
      activity.score == null
    );
  },
  
  // Filtra atividades que vencem nos próximos N dias
  getUpcomingActivities: (activities, days = 3) => {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);
    
    return activities.filter(a =>
      a.endDate &&
      new Date(a.endDate) > today &&
      new Date(a.endDate) <= futureDate
    );
  }
};

// Exporta todos os serviços juntos para facilitar importação
export default {
  timestampUtils,
  schoolService,
  lessonService,
  activityService
}; 