import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native'
import React, { useState, useMemo, useEffect } from 'react'
import { Colors, Fonts, Sizes } from '../../constants/styles'
import { MaterialIcons } from '@expo/vector-icons';
import MyStatusBar from '../../components/myStatusBar';
import { useNavigation } from 'expo-router';
import { useSchool } from '../../hooks/useSchool';
import { useLessons } from '../../hooks/useLessons';
import logService from '../../utils/logService';

// Lista de imagens de professores padrão (para usar quando não há foto)
const DEFAULT_TEACHER_IMAGES = [
  require('../../assets/images/faculties/faculty1.png'),
  require('../../assets/images/faculties/faculty2.png'),
  require('../../assets/images/faculties/faculty3.png'),
  require('../../assets/images/faculties/faculty4.png'),
  require('../../assets/images/faculties/faculty5.png'),
  require('../../assets/images/faculties/faculty6.png'),
  require('../../assets/images/faculties/faculty7.png')
];

const FacultiesScreen = () => {
    const navigation = useNavigation();
    const { loading: schoolLoading } = useSchool();
    const { lessons, loading: lessonsLoading } = useLessons();

    const [selectedSubjectIndex, setSelectedSubjectIndex] = useState(0);
    const [subjectsList, setSubjectsList] = useState(['Todos']);
    const [teachersWithSubjects, setTeachersWithSubjects] = useState([]);

    // Extrair professores diretamente das aulas
    useEffect(() => {
        if (lessons && lessons.length > 0) {
            try {
                logService.debug('Extraindo professores das aulas', { 
                    lessonsCount: lessons.length
                });

                // Usar um Map para armazenar professores únicos por ID
                const teachersMap = new Map();
                
                // Para cada aula, extrair informações do professor
                lessons.forEach((lesson, index) => {
                    if (lesson.teacher && lesson.teacher.value && lesson.subject) {
                        const teacherId = lesson.teacher.value;
                        
                        // Se ainda não temos este professor, adicioná-lo ao Map
                        if (!teachersMap.has(teacherId)) {
                            // Escolher uma imagem padrão baseada no índice para variar as imagens
                            const defaultImageIndex = index % DEFAULT_TEACHER_IMAGES.length;
                            
                            teachersMap.set(teacherId, {
                                id: teacherId,
                                // Se teacher já tiver um nome definido, usar esse nome
                                name: lesson.teacher.label,
                                // Inicializar o conjunto de disciplinas que este professor leciona
                                subjects: new Set([lesson.subject])
                            });
                        } else {
                            // Adicionar a disciplina atual ao conjunto de disciplinas deste professor
                            teachersMap.get(teacherId).subjects.add(lesson.subject);
                        }
                    }
                });
                
                // Extrair lista única de todas as disciplinas
                const allSubjects = new Set(['Todos']);
                teachersMap.forEach(teacher => {
                    teacher.subjects.forEach(subject => allSubjects.add(subject));
                });
                
                // Converter o Map de professores para um array com o formato necessário
                const teachersData = Array.from(teachersMap.values()).map((teacher, index) => {
                    // Escolher uma imagem padrão baseada no índice para variar as imagens
                    const defaultImageIndex = index % DEFAULT_TEACHER_IMAGES.length;
                    
                    return {
                        id: teacher.id,
                        facultyName: teacher.name || 'Professor não identificado',
                        description: `Professor de ${Array.from(teacher.subjects).join(', ')}`,
                        subjectsKnown: Array.from(teacher.subjects),
                        facultyImage: DEFAULT_TEACHER_IMAGES[defaultImageIndex],
                        email: '', // Não temos email a partir das aulas
                        phone: '', // Não temos telefone a partir das aulas
                    };
                });
                
                // Atualizar estado com os dados processados
                setSubjectsList(['Todos', ...Array.from(allSubjects).filter(s => s !== 'Todos')]);
                setTeachersWithSubjects(teachersData);
                
                logService.debug('Professores e disciplinas processados', { 
                    teachersCount: teachersData.length,
                    uniqueSubjects: allSubjects.size 
                });
            } catch (error) {
                logService.error('Erro ao processar professores das aulas', error);
            }
        }
    }, [lessons]);

    // Filtrar professores pela disciplina selecionada
    const filteredTeachers = useMemo(() => {
        if (selectedSubjectIndex === 0) {
            // Caso "Todos" esteja selecionado
            return teachersWithSubjects;
        } else {
            const selectedSubject = subjectsList[selectedSubjectIndex];
            return teachersWithSubjects.filter(teacher => 
                teacher.subjectsKnown.includes(selectedSubject)
            );
        }
    }, [teachersWithSubjects, selectedSubjectIndex, subjectsList]);

    // Renderizar tela de carregamento se necessário
    if (lessonsLoading || schoolLoading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color={Colors.primaryColor} />
                <Text style={{ ...Fonts.grayColor16Medium, marginTop: Sizes.fixPadding }}>
                    Carregando professores...
                </Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors.primaryColor }}>
            <MyStatusBar />
            <ImageBackground
                source={require('../../assets/images/bgImage.png')}
                style={{ width: '100%', height: 250, flex: 1, }}
                resizeMode="stretch"
                tintColor={Colors.whiteColor}
            >
                {header()}
                <View style={styles.sheetStyle}>
                    {subjects()}
                    {facultiesInfo()}
                </View>
            </ImageBackground>
        </View>
    )

    function facultiesInfo() {
        // Verificar se não há professores para mostrar
        if (filteredTeachers.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <MaterialIcons name="person-outline" size={50} color={Colors.grayColor} />
                    <Text style={{ ...Fonts.grayColor16Medium, marginTop: Sizes.fixPadding, textAlign: 'center' }}>
                        Nenhum professor encontrado{"\n"}para esta disciplina
                    </Text>
                </View>
            );
        }
        
        const renderItem = ({ item }) => (
            <View style={styles.infoWrapStyle}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1, }}>
                        <Text numberOfLines={1} style={{ ...Fonts.blackColor15Medium }}>
                            {item.facultyName}
                        </Text>
                        <Text
                            numberOfLines={2}
                            style={{
                                marginTop: Sizes.fixPadding - 5.0,
                                ...Fonts.grayColor13Regular,
                            }}
                        >
                            {item.description}
                        </Text>
                        {item.email ? (
                            <Text style={{ ...Fonts.grayColor13Regular, marginTop: Sizes.fixPadding - 8.0 }}>
                                {item.email}
                            </Text>
                        ) : null}
                    </View>
                    <View style={{ marginLeft: Sizes.fixPadding }}>
                        <Image
                            source={item.facultyImage}
                            style={styles.teacherImageStyle}
                        />
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => { navigation.push('chatWithFaculty/chatWithFacultyScreen') }}
                            style={styles.chatBoxStyle}
                        >
                            <Text style={{ ...Fonts.whiteColor11Bold, color: Colors.whiteColor }}>
                                Conversar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ backgroundColor: Colors.lightGrayColor, height: 1.0, marginVertical: Sizes.fixPadding + 5.0 }} />
                <Text style={{ ...Fonts.blackColor14Medium }}>
                    {item.subjectsKnown.map(item => item).join(', ')}
                </Text>
            </View>
        )
        
        return (
            <FlatList
                data={filteredTeachers}
                keyExtractor={(item) => `${item.id}`}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 2.0 }}
            />
        )
    }

    function subjects() {
        // Se não temos disciplinas suficientes, não mostrar filtros
        if (subjectsList.length <= 1) {
            return null;
        }
        
        const renderItem = ({ item, index }) => (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setSelectedSubjectIndex(index)}
                style={{
                    backgroundColor: index == selectedSubjectIndex ? Colors.secondaryColor : 'transparent',
                    marginHorizontal: index == 0 || index == subjectsList.length - 1 ? 0.0 : Sizes.fixPadding - 5.0,
                    paddingHorizontal: index == selectedSubjectIndex ? Sizes.fixPadding + 10.0 : Sizes.fixPadding + 2.0,
                    ...styles.subjectWrapStyle,
                }}
            >
                <Text style={index == selectedSubjectIndex ? { ...Fonts.whiteColor13Medium } : { ...Fonts.blackColor13Medium }}>
                    {item}
                </Text>
            </TouchableOpacity>
        )
        
        return (
            <View style={{ ...styles.allSubjectsWrapStyle }}>
                <FlatList
                    data={subjectsList}
                    keyExtractor={(item, index) => `${item}${index}`}
                    renderItem={renderItem}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        )
    }

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <MaterialIcons name="arrow-back" size={24} color={Colors.whiteColor} onPress={() => { navigation.pop() }} />
                <Text style={{ marginLeft: Sizes.fixPadding * 2.0, ...Fonts.whiteColor18SemiBold }}>
                    Professores
                </Text>
            </View>
        )
    }
}

export default FacultiesScreen

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: Colors.whiteColor
    },
    loadingContainer: {
        justifyContent: 'center', 
        alignItems: 'center'
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: Sizes.fixPadding * 10,
    },
    headerWrapStyle: {
        marginVertical: Sizes.fixPadding * 3.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
        flexDirection: 'row',
        alignItems: 'center'
    },
    sheetStyle: {
        backgroundColor: Colors.whiteColor,
        borderTopLeftRadius: Sizes.fixPadding * 2.0,
        borderTopRightRadius: Sizes.fixPadding * 2.0,
        flex: 1,
        marginBottom: -(Sizes.fixPadding * 5.0),
        overflow: "hidden",
        paddingBottom: Sizes.fixPadding * 5.0,
    },
    subjectWrapStyle: {
        borderRadius: Sizes.fixPadding * 2.0,
        paddingVertical: Sizes.fixPadding - 5.0,
    },
    allSubjectsWrapStyle: {
        borderColor: Colors.secondaryColor,
        borderWidth: 1.0,
        borderRadius: Sizes.fixPadding * 2.0,
        margin: Sizes.fixPadding * 2.0,
        overflow: 'hidden'
    },
    infoWrapStyle: {
        borderColor: Colors.lightGrayColor,
        borderWidth: 1.0,
        borderRadius: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding * 2.0,
        paddingHorizontal: Sizes.fixPadding + 5.0,
        paddingVertical: Sizes.fixPadding * 2.0,
    },
    chatBoxStyle: {
        marginTop: -15.0,
        flexDirection: 'row',
        backgroundColor: Colors.secondaryColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Sizes.fixPadding,
        paddingHorizontal: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding - 7.0,
    },
    teacherImageStyle: {
        width: 60.0, 
        height: 60.0, 
        borderRadius: 30.0,
        backgroundColor: Colors.lightGrayColor
    }
})