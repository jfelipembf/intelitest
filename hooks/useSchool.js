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
import { collection, query, where } from 'firebase/firestore';
import { useAuth } from './useAuth';
import { useFirestoreQuery } from './useFirestoreQuery';
import { schoolService } from '../services/firebaseService';
import logService from '../utils/logService';

const SchoolContext = createContext(null);

export const SchoolProvider = ({ children }) => {
  const { user, userData } = useAuth();

  // Estados
  const [schoolData, setSchoolData] = useState(null);
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Log de depuração para entender o fluxo
  useEffect(() => {
    logService.debug('useSchool - Estado atual:', { 
      'User Auth ID': user?.uid,
      'User Data': userData ? 'Disponível' : 'Não disponível',
      'SchoolID': userData?.schoolId,
      'ClassID': userData?.academicInfo?.classId,
      'School Data': schoolData ? 'Carregado' : 'Não carregado',
      'Class Data': classData ? 'Carregado' : 'Não carregado' 
    });
  }, [user, userData, schoolData, classData]);

  // Construir queries baseadas nos dados do usuário
  const subjectsQuery = useMemo(() => {
    if (!userData?.schoolId || !userData?.academicInfo?.classId) {
      logService.warn('Queries de disciplinas não podem ser criadas: dados insuficientes', {
        schoolId: userData?.schoolId,
        classId: userData?.academicInfo?.classId
      });
      return null;
    }
    
    logService.debug('Criando query de disciplinas', {
      schoolId: userData.schoolId,
      classId: userData.academicInfo.classId
    });
    
    return collection(
      db, 
      'schools', 
      userData.schoolId, 
      'classes', 
      userData.academicInfo.classId, 
      'subjects'
    );
  }, [userData?.schoolId, userData?.academicInfo?.classId]);

  const teachersQuery = useMemo(() => {
    if (!classData?.teacherIds?.length) {
      logService.debug('Query de professores não criada: sem IDs de professores');
      return null;
    }
    
    logService.debug('Criando query de professores', {
      teacherIds: classData.teacherIds.length
    });
    
    return query(
      collection(db, 'teachers'),
      where('__name__', 'in', classData.teacherIds)
    );
  }, [classData?.teacherIds]);

  // Usar useFirestoreQuery para obter dados com cache eficiente
  const { 
    data: schoolSubjects, 
    loading: subjectsLoading 
  } = useFirestoreQuery(subjectsQuery, [subjectsQuery]);
  
  const { 
    data: teachers, 
    loading: teachersLoading 
  } = useFirestoreQuery(teachersQuery, [teachersQuery]);

  // Função para tratamento de erros
  const handleError = useCallback((message, err) => {
    logService.error(message, err);
    setError(`${message}: ${err.message}`);
  }, []);

  // Função principal para buscar dados da escola e turma
  const fetchSchoolAndClassData = useCallback(async () => {
    // Verificar se temos os dados necessários
    if (!userData?.schoolId) {
      setError('ID da escola não disponível');
      setLoading(false);
      return;
    }

    const schoolId = userData.schoolId;
    const classId = userData.academicInfo?.classId;
    const userName = userData?.academicInfo?.class;

    // Iniciar loading
    setLoading(true);
    setError(null);
    
    logService.info('Iniciando busca de dados da escola/turma', { schoolId, classId });

    try {
      // Criar controller para gerenciar cancelamento
      const controller = new AbortController();
      const signal = controller.signal;

      // Buscar informações da escola e turma em paralelo
      const [schoolInfo, classInfo] = await Promise.all([
        schoolService.fetchSchoolData(schoolId),
        classId ? schoolService.fetchClassData(schoolId, classId, userName) : Promise.resolve(null)
      ]);

      if (signal.aborted) return;

      // Atualizar estados
      logService.debug('Dados recuperados com sucesso', { 
        schoolName: schoolInfo?.name,
        className: classInfo?.name 
      });
      
      setSchoolData(schoolInfo);
      setClassData(classInfo);
    } catch (err) {
      handleError('Erro ao buscar dados da escola/turma', err);
    } finally {
      setLoading(false);
    }
  }, [userData, handleError]);

  // Efeito para carregar dados quando o usuário estiver autenticado
  useEffect(() => {
    // Abortar se o componente for desmontado
    const controller = new AbortController();
    const signal = controller.signal;

    const loadData = async () => {
      if (signal.aborted) return;
      
      if (user && userData) {
        logService.info('Usuário autenticado, carregando dados', { 
          uid: user.uid, 
          role: userData.role 
        });
        await fetchSchoolAndClassData();
      } else {
        logService.info('Sem usuário autenticado, limpando dados');
        setSchoolData(null);
        setClassData(null);
        setLoading(false);
        setError(null);
      }
    };

    loadData();

    // Cleanup function
    return () => {
      controller.abort();
    };
  }, [user, userData, fetchSchoolAndClassData]);

  // Função para recarregar dados
  const refreshSchoolData = useCallback(() => {
    logService.info('Recarregando dados da escola');
    fetchSchoolAndClassData();
  }, [fetchSchoolAndClassData]);

  // Loading combinado para todos os dados
  const isLoading = loading || subjectsLoading || teachersLoading;

  // Memorizar o valor do contexto para evitar re-renderizações
  const contextValue = useMemo(() => ({
    schoolData,
    classData,
    schoolSubjects,
    teachers,
    loading: isLoading,
    error,
    refreshSchoolData
  }), [
    schoolData,
    classData,
    schoolSubjects,
    teachers,
    isLoading,
    error,
    refreshSchoolData
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
