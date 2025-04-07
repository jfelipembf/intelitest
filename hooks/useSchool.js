import { useState, useEffect, useContext, createContext } from 'react';
import { db } from '../firebase/config';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { useAuth } from './useAuth';

// Criar contexto para as informações da escola
const SchoolContext = createContext({});

// Provider para o contexto de escola
export const SchoolProvider = ({ children }) => {
  const { user, userData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [schoolData, setSchoolData] = useState(null);
  const [classData, setClassData] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [schoolSubjects, setSchoolSubjects] = useState([]);
  const [lessons, setLessons] = useState([]);

  // Função auxiliar para tratamento de erros
  const handleError = (message, error) => {
    console.error(message, error);
    setError(`${message}: ${error.message}`);
    setLoading(false);
  };

  // Função auxiliar para criar dados básicos da classe quando não disponíveis completamente
  const createBasicClassData = (classId) => {
    return {
      id: classId,
      name: userData?.academicInfo?.class || "Turma não identificada",
      grade: userData?.academicInfo?.grade || "Série não identificada"
    };
  };

  // Função para buscar dados da escola
  const fetchSchoolData = async (schoolId) => {
    try {
      const schoolDocRef = doc(db, 'schools', schoolId);
      const schoolDoc = await getDoc(schoolDocRef);

      if (!schoolDoc.exists()) {
        setError("Escola não encontrada");
        setLoading(false);
        return null;
      }

      return {
        id: schoolDoc.id,
        ...schoolDoc.data()
      };
    } catch (error) {
      handleError("Erro ao buscar escola", error);
      return null;
    }
  };

  // Função para buscar dados da classe
  const fetchClassData = async (schoolId, classId) => {
    try {
      const classDocRef = doc(db, 'schools', schoolId, 'classes', classId);
      const classDoc = await getDoc(classDocRef);

      if (!classDoc.exists()) {
        return createBasicClassData(classId);
      }

      return {
        id: classDoc.id,
        ...classDoc.data()
      };
    } catch (error) {
      handleError("Erro ao buscar dados da classe", error);
      return createBasicClassData(classId);
    }
  };

  // Função para buscar disciplinas da turma
  const fetchSubjects = async (schoolId, classId) => {
    try {
      const subjectsCollectionRef = collection(db, 'schools', schoolId, 'classes', classId, 'subjects');
      const subjectsSnapshot = await getDocs(subjectsCollectionRef);
      return subjectsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.warn("Erro ao buscar disciplinas da turma:", error);
      return [];
    }
  };

  // Função para buscar aulas da turma
  const fetchLessons = async (schoolId, classId) => {
    try {
      const lessonsCollectionRef = collection(db, 'schools', schoolId, 'classes', classId, 'lessons');
      const lessonsSnapshot = await getDocs(lessonsCollectionRef);
      return lessonsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.warn("Erro ao buscar aulas da turma:", error);
      return [];
    }
  };

  // Função para buscar professores da turma
  const fetchTeachers = async (teacherIds) => {
    try {
      if (!teacherIds || teacherIds.length === 0) {
        return [];
      }
      
      const teachersPromises = teacherIds.map(teacherId => 
        getDoc(doc(db, 'users', teacherId))
      );
      const teachersDocs = await Promise.all(teachersPromises);
      return teachersDocs
        .filter(doc => doc.exists())
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
    } catch (error) {
      console.warn("Erro ao buscar professores da turma:", error);
      return [];
    }
  };

  // Função principal para buscar dados da escola e da turma
  const fetchSchoolAndClassData = async () => {
    if (!userData) {
      setLoading(false);
      setError("Usuário não autenticado ou dados não disponíveis");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Extrair IDs da escola e da turma dos dados do usuário
      const schoolId = userData.schoolId;
      const classId = userData.academicInfo?.classId;
      
      if (!schoolId) {
        setError("ID da escola não encontrado nos dados do usuário");
        setLoading(false);
        return;
      }

      // Buscar dados da escola
      const schoolInfo = await fetchSchoolData(schoolId);
      if (!schoolInfo) return;
      setSchoolData(schoolInfo);

      // Se classId disponível, buscar dados da turma
      if (classId) {
        // Buscar dados da classe
        const classInfo = await fetchClassData(schoolId, classId);
        setClassData(classInfo);

        // Buscar disciplinas da turma
        const subjectsData = await fetchSubjects(schoolId, classId);
        setSchoolSubjects(subjectsData);

        // Buscar aulas da turma
        const lessonsData = await fetchLessons(schoolId, classId);
        setLessons(lessonsData);

        // Buscar professores da turma
        if (classInfo.teacherIds && classInfo.teacherIds.length > 0) {
          const teachersData = await fetchTeachers(classInfo.teacherIds);
          setTeachers(teachersData);
        }
      } else {
        if (userData.academicInfo?.class) {
          setClassData(createBasicClassData(null));
        } else {
          setClassData(null);
        }
      }

      setLoading(false);
    } catch (error) {
      handleError("Erro ao buscar dados da escola e turma", error);
    }
  };

  // Efeito para buscar dados quando o usuário muda
  useEffect(() => {
    if (userData) {
      fetchSchoolAndClassData();
    } else {
      setSchoolData(null);
      setClassData(null);
      setTeachers([]);
      setSchoolSubjects([]);
      setLessons([]);
      setLoading(false);
    }
  }, [userData]);

  // Função para listar todas as classes disponíveis na escola
  const listAvailableClasses = async () => {
    if (!schoolData?.id) return [];
    
    try {
      const classesCollectionRef = collection(db, 'schools', schoolData.id, 'classes');
      const classesSnapshot = await getDocs(classesCollectionRef);
      
      return classesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Erro ao listar classes:", error);
      return [];
    }
  };

  // Função para atualizar os dados da escola e turma manualmente
  const refreshSchoolData = () => fetchSchoolAndClassData();

  return (
    <SchoolContext.Provider
      value={{
        schoolData,
        classData,
        teachers,
        schoolSubjects,
        lessons,
        loading,
        error,
        refreshSchoolData
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

// Hook personalizado para usar o contexto de escola
export const useSchool = () => {
  return useContext(SchoolContext);
};