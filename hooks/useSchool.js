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
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where
} from 'firebase/firestore';
import { useAuth } from './useAuth';

const SchoolContext = createContext(null);

export const SchoolProvider = ({ children }) => {
  const { user, userData } = useAuth();

  const [schoolData, setSchoolData] = useState(null);
  const [classData, setClassData] = useState(null);
  const [schoolSubjects, setSchoolSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleError = (message, err) => {
    console.error(message, err);
    setError(`${message}: ${err.message}`);
  };

  const createBasicClassData = (classId) => ({
    id: classId || 'unknown',
    name: userData?.academicInfo?.class || 'Turma não especificada',
    teacherIds: []
  });

  const fetchSchoolData = async (schoolId) => {
    const snap = await getDoc(doc(db, 'schools', schoolId));
    if (!snap.exists()) throw new Error('Escola não encontrada');
    return { id: snap.id, ...snap.data() };
  };

  const fetchClassData = async (schoolId, classId) => {
    const snap = await getDoc(doc(db, 'schools', schoolId, 'classes', classId));
    if (!snap.exists()) return createBasicClassData(classId);
    return { id: snap.id, ...snap.data() };
  };

  const fetchSubjects = async (schoolId, classId) => {
    const col = collection(db, 'schools', schoolId, 'classes', classId, 'subjects');
    const snap = await getDocs(col);
    return snap.empty
      ? []
      : snap.docs.map(d => ({ id: d.id, ...d.data() }));
  };

  const fetchTeachers = async (teacherIds) => {
    if (!teacherIds?.length) return [];
    const q = query(
      collection(db, 'teachers'),
      where('__name__', 'in', teacherIds)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  };

  const fetchSchoolAndClassData = useCallback(async () => {
    if (!userData?.schoolId) {
      setError('ID da escola não disponível');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const schoolId = userData.schoolId;
      const classId = userData.academicInfo?.classId;

      const [schoolInfo, classInfo] = await Promise.all([
        fetchSchoolData(schoolId),
        classId ? fetchClassData(schoolId, classId) : Promise.resolve(null)
      ]);

      let subjectsData = [];
      let teachersData = [];

      if (classInfo) {
        [subjectsData, teachersData] = await Promise.all([
          fetchSubjects(schoolId, classInfo.id),
          fetchTeachers(classInfo.teacherIds)
        ]);
      }

      setSchoolData(schoolInfo);
      setClassData(classInfo);
      setSchoolSubjects(subjectsData);
      setTeachers(teachersData);
    } catch (err) {
      handleError('Erro ao buscar dados da escola/turma', err);
    } finally {
      setLoading(false);
    }
  }, [userData]);

  useEffect(() => {
    if (user && userData) {
      fetchSchoolAndClassData();
    } else {
      setSchoolData(null);
      setClassData(null);
      setSchoolSubjects([]);
      setTeachers([]);
      setLoading(false);
      setError(null);
    }
  }, [user, userData, fetchSchoolAndClassData]);

  const refreshSchoolData = () => {
    fetchSchoolAndClassData();
  };

  const contextValue = useMemo(() => ({
    schoolData,
    classData,
    schoolSubjects,
    teachers,
    loading,
    error,
    refreshSchoolData
  }), [
    schoolData,
    classData,
    schoolSubjects,
    teachers,
    loading,
    error
  ]);

  return (
    <SchoolContext.Provider value={contextValue}>
      {children}
    </SchoolContext.Provider>
  );
};

SchoolProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useSchool = () => {
  const ctx = useContext(SchoolContext);
  if (!ctx) {
    throw new Error('useSchool deve ser usado dentro de <SchoolProvider>');
  }
  return ctx;
};
