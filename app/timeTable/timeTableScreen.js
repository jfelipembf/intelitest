import { StyleSheet, Text, View, ImageBackground, Image, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Colors, Fonts, Sizes } from '../../constants/styles'
import { MaterialIcons } from '@expo/vector-icons';
import MyStatusBar from '../../components/myStatusBar';
import { useNavigation } from 'expo-router';
import { useSchool } from '../../hooks/useSchool';
import { WEEK_DAYS_SHORT, DEFAULT_LESSON_VALUES } from '../../constants/dateTime';

const TimeTableScreen = () => {

    const navigation = useNavigation();
    const { lessons, loading, schoolData, classData } = useSchool();
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    const [timeTables, setTimeTables] = useState([]);
    const [selectedDayLessons, setSelectedDayLessons] = useState([]);

    // Função para criar a estrutura inicial dos dias da semana
    const createEmptyWeekDays = () => {
        // Usamos apenas os dias de segunda a sábado (índices 0-5)
        return WEEK_DAYS_SHORT.slice(0, 6).map(day => ({
            ...day,
            lectures: []
        }));
    };

    // Organizar as aulas por dia da semana
    useEffect(() => {
        if (lessons && lessons.length > 0) {
            // Criar uma estrutura de dados para os dias da semana
            const weekDays = createEmptyWeekDays();

            // Organizar as aulas por dia da semana
            lessons.forEach(lesson => {
                if (lesson.daysOfWeek && lesson.daysOfWeek.length > 0) {
                    lesson.daysOfWeek.forEach(day => {
                        const dayValue = day.value;
                        const dayIndex = weekDays.findIndex(d => d.value === dayValue);
                        
                        if (dayIndex !== -1) {
                            weekDays[dayIndex].lectures.push({
                                id: lesson.id,
                                subject: lesson.subject || DEFAULT_LESSON_VALUES.subject,
                                time: `${lesson.startTime || DEFAULT_LESSON_VALUES.startTime} - ${lesson.endTime || DEFAULT_LESSON_VALUES.endTime}`,
                                teacherName: lesson.teacher?.label || DEFAULT_LESSON_VALUES.teacher,
                                periodNo: lesson.period || "",
                                room: lesson.room?.label || DEFAULT_LESSON_VALUES.room,
                                duration: lesson.duration || DEFAULT_LESSON_VALUES.duration
                            });
                        }
                    });
                }
            });

            // Ordenar as aulas por horário de início
            weekDays.forEach(day => {
                day.lectures.sort((a, b) => {
                    const timeA = a.time.split(' - ')[0];
                    const timeB = b.time.split(' - ')[0];
                    return timeA.localeCompare(timeB);
                });
            });

            setTimeTables(weekDays);
            setSelectedDayLessons(weekDays[selectedDayIndex].lectures);
        } else {
            setTimeTables(createEmptyWeekDays());
            setSelectedDayLessons([]);
        }
    }, [lessons]);

    // Atualizar as aulas do dia selecionado quando ele mudar
    useEffect(() => {
        if (timeTables.length > 0) {
            setSelectedDayLessons(timeTables[selectedDayIndex].lectures);
        }
    }, [selectedDayIndex, timeTables]);

    // Função para renderizar informações sobre uma escola (a ser chamada se necessário)
    function schoolInfo() {
        if (!schoolData || !classData) return null;

        return (
            <View style={styles.schoolInfoContainer}>
                <Text style={{ ...Fonts.blackColor15Medium }}>
                    {schoolData.name || "Escola"}
                </Text>
                <Text style={{ ...Fonts.grayColor13Regular }}>
                    {classData.grade} - Turma {classData.name}
                </Text>
            </View>
        );
    }

    // Função para renderizar um separador de conteúdo
    function divider() {
        return (
            <View style={{ backgroundColor: Colors.lightGrayColor, height: 1.0, marginVertical: Sizes.fixPadding + 5.0, }} />
        )
    }

    // Função para renderizar o cabeçalho
    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <MaterialIcons 
                    name="arrow-back" 
                    size={24} 
                    color={Colors.whiteColor} 
                    onPress={() => navigation.pop()} 
                />
                <Text style={{ marginLeft: Sizes.fixPadding * 2.0, ...Fonts.whiteColor18SemiBold }}>
                    Horários
                </Text>
            </View>
        )
    }

    // Função para renderizar os dias da semana
    function days() {
        if (!timeTables || timeTables.length === 0) return null;

        const renderItem = ({ item, index }) => (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setSelectedDayIndex(index)}
                style={{
                    backgroundColor: index == selectedDayIndex ? Colors.secondaryColor : 'transparent',
                    marginHorizontal: index == 0 || index == timeTables.length - 1 ? 0.0 : Sizes.fixPadding - 5.0,
                    paddingHorizontal: index == selectedDayIndex ? Sizes.fixPadding + 10.0 : Sizes.fixPadding + 2.0,
                    ...styles.dayWrapStyle,
                }}
            >
                <Text style={index == selectedDayIndex ? { ...Fonts.whiteColor13Medium } : { ...Fonts.blackColor13Medium }}>
                    {item.day}
                </Text>
            </TouchableOpacity>
        )

        return (
            <View style={styles.allDaysWrapStyle}>
                <FlatList
                    data={timeTables}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={renderItem}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        )
    }

    // Função para renderizar as aulas do dia selecionado
    function periodsInfo() {
        if (selectedDayLessons.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <MaterialIcons name="event-busy" size={50} color={Colors.grayColor} />
                    <Text style={{ ...Fonts.grayColor14Medium, textAlign: 'center', marginTop: Sizes.fixPadding }}>
                        Nenhuma aula programada para este dia.
                    </Text>
                </View>
            );
        }

        const renderItem = ({ item }) => (
            <View style={styles.infoWrapStyle}>
                <View>
                    <View style={styles.subjectContainer}>
                        <Text style={{ ...Fonts.blackColor15Medium, flex: 1 }}>
                            {item.subject}
                        </Text>
                        <View style={styles.roomTag}>
                            <MaterialIcons name="location-on" size={14} color={Colors.primaryColor} />
                            <Text style={{ marginLeft: 2, ...Fonts.primaryColor13Medium }}>
                                {item.room}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.timeInfoContainer}>
                        <MaterialIcons name="access-time" size={16} color={Colors.secondaryColor} />
                        <Text style={{ marginLeft: 4, ...Fonts.grayColor13Regular }}>
                            {item.time} ({item.duration})
                        </Text>
                    </View>
                    {divider()}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1 }}>
                            <View style={styles.teacherInfoContainer}>
                                <MaterialIcons name="person" size={16} color={Colors.secondaryColor} />
                                <Text style={{ marginLeft: 4, ...Fonts.grayColor14Regular }}>
                                    {item.teacherName}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )

        // Obter o nome completo do dia atual
        const currentDayFullName = timeTables[selectedDayIndex]?.fullName || 'Dia não definido';

        return (
            <FlatList
                data={selectedDayLessons}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 2.0 }}
                ListHeaderComponent={
                    <>
                        <Text style={styles.dayTitle}>
                            {currentDayFullName}
                        </Text>
                        <View style={styles.daySummaryContainer}>
                            <Text style={{ ...Fonts.grayColor13Regular }}>
                                Total de aulas: <Text style={{ ...Fonts.primaryColor13Medium }}>{selectedDayLessons.length}</Text>
                            </Text>
                        </View>
                    </>
                }
            />
        )
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
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={Colors.primaryColor} />
                            <Text style={{ ...Fonts.grayColor14Medium, marginTop: Sizes.fixPadding }}>
                                Carregando horários...
                            </Text>
                        </View>
                    ) : (
                        <>
                            {days()}
                            {periodsInfo()}
                        </>
                    )}
                </View>
            </ImageBackground>
        </View>
    )
}

export default TimeTableScreen

const styles = StyleSheet.create({
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
    dayWrapStyle: {
        borderRadius: Sizes.fixPadding * 2.0,
        paddingVertical: Sizes.fixPadding - 5.0,
    },
    allDaysWrapStyle: {
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
        paddingVertical: Sizes.fixPadding * 2.0,
        paddingHorizontal: Sizes.fixPadding + 5.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding * 2.0,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Sizes.fixPadding * 2.0,
    },
    schoolInfoContainer: {
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginTop: Sizes.fixPadding * 2.0,
        padding: Sizes.fixPadding,
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding,
        borderColor: Colors.primaryColor,
        borderWidth: 1.0,
        marginBottom: Sizes.fixPadding,
    },
    roomInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    teacherInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    subjectContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    roomTag: {
        backgroundColor: Colors.primaryColor + '15',
        borderRadius: Sizes.fixPadding,
        paddingHorizontal: Sizes.fixPadding * 0.8,
        paddingVertical: Sizes.fixPadding * 0.3,
        marginLeft: Sizes.fixPadding,
        borderColor: Colors.primaryColor,
        borderWidth: 1,
    },
    dayTitle: {
        ...Fonts.blackColor15Medium,
        marginBottom: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding,
    },
    daySummaryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Sizes.fixPadding,
    },
});