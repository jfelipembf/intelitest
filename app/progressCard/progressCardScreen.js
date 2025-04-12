import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ScrollView, ImageBackground, Animated, FlatList } from 'react-native'
import React, { useState, useRef } from 'react'
import { Colors, Fonts, Sizes } from '../../constants/styles'
import { MaterialIcons } from '@expo/vector-icons';
import MyStatusBar from '../../components/myStatusBar';
import { useNavigation } from 'expo-router';
import { subjectsList, studentData, schoolData } from '../../constants/mockData';

const { width } = Dimensions.get('window');

// Função auxiliar para calcular média geral
const calculateOverallAverage = () => {
    let totalGrades = 0;
    let gradesSum = 0;
    
    // Percorre todas as disciplinas e suas unidades
    subjectsList.forEach(subject => {
        subject.units.forEach(unit => {
            unit.grades.forEach(grade => {
                gradesSum += grade.value;
                totalGrades++;
            });
        });
    });
    
    if (totalGrades === 0) return "0.0";
    const overallAverage = (gradesSum / totalGrades).toFixed(1);
    return overallAverage;
};

// Função auxiliar para obter o estilo de texto com base na cor
const textStyleForColor = (color) => {
    switch(color) {
        case Colors.purpleColor:
            return Fonts.purpleColor15SemiBold;
        case Colors.secondaryColor:
            return Fonts.secondaryColor15SemiBold;
        case Colors.greenColor:
            return Fonts.greenColor15SemiBold;
        case Colors.cyanColor:
            return Fonts.cyanColor15SemiBold;
        case Colors.redColor:
            return Fonts.redColor15SemiBold;
        default:
            return Fonts.primaryColor15SemiBold;
    }
};

const ProgressCardScreen = () => {

    const navigation = useNavigation();
    
    const [expandedSubjectId, setExpandedSubjectId] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState('1º Unidade');
    const animatedHeights = useRef(subjectsList.map(() => new Animated.Value(0))).current;
    const scrollViewRef = useRef(null);
    
    // Lista de períodos disponíveis
    const periods = ['1º Unidade', '2º Unidade', '3º Unidade', '4º Unidade'];

    // Função para obter o índice da unidade com base no período selecionado
    const getUnitIndexFromPeriod = (period) => {
        switch(period) {
            case '1º Unidade': return 0;
            case '2º Unidade': return 1;
            case '3º Unidade': return 2;
            case '4º Unidade': return 3;
            default: return 0;
        }
    };

    // Obter o índice da unidade atual com base no período selecionado
    const currentUnitIndex = getUnitIndexFromPeriod(selectedPeriod);

    // Função para expandir/contrair uma disciplina
    const toggleExpand = (index, subjectId) => {
        const isExpanding = expandedSubjectId !== subjectId;
        
        // Animar a contração da disciplina atualmente expandida (se houver)
        if (expandedSubjectId !== null) {
            const currentIndex = subjectsList.findIndex(item => item.id === expandedSubjectId);
            if (currentIndex !== -1) {
                Animated.timing(animatedHeights[currentIndex], {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: false
                }).start();
            }
        }
        
        // Se estamos expandindo uma nova disciplina
        if (isExpanding) {
            setExpandedSubjectId(subjectId);
            Animated.timing(animatedHeights[index], {
                toValue: 1,
                duration: 300,
                useNativeDriver: false
            }).start();
            
            // Rolar para a posição da disciplina expandida após a animação
            setTimeout(() => {
                if (scrollViewRef.current) {
                    // Calcular a posição aproximada da disciplina expandida
                    const yOffset = index * 60; // Altura aproximada de cada item
                    scrollViewRef.current.scrollTo({ y: yOffset, animated: true });
                }
            }, 300);
        } else {
            setExpandedSubjectId(null);
        }
    };
    
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
                    {studentNameAndPracticeText()}
                    {periodSelector()}
                    {subjectsListInfo()}
                </View>
            </ImageBackground>
        </View>
    )

    // Seletor de períodos (Unidades)
    function periodSelector() {
        return (
            <View style={styles.allPeriodsWrapStyle}>
                <FlatList
                    data={periods}
                    keyExtractor={(item) => item}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => setSelectedPeriod(item)}
                            style={{
                                backgroundColor: item === selectedPeriod ? Colors.secondaryColor : 'transparent',
                                marginHorizontal: index === 0 || index === periods.length - 1 ? 0.0 : Sizes.fixPadding - 5.0,
                                paddingHorizontal: item === selectedPeriod ? Sizes.fixPadding + 10.0 : Sizes.fixPadding + 2.0,
                                ...styles.periodWrapStyle,
                            }}
                        >
                            <Text style={item === selectedPeriod ? { ...Fonts.whiteColor13Medium } : { ...Fonts.blackColor13Medium }}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        )
    }

    function subjectsListInfo() {
        return (
            <View style={{ marginTop: Sizes.fixPadding }}>
                <Text style={styles.periodTitle}>
                    Notas do {selectedPeriod}
                </Text>
                <View style={styles.periodSummaryContainer}>
                    <Text style={{ ...Fonts.grayColor13Regular }}>
                        Total de disciplinas: <Text style={{ ...Fonts.primaryColor13Medium }}>{subjectsList.length}</Text>
                    </Text>
                </View>
                
                <FlatList
                    data={subjectsList}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => {
                        // Calcular a média final da disciplina
                        let totalGrades = 0;
                        let gradesSum = 0;
                        
                        item.units.forEach(unit => {
                            unit.grades.forEach(grade => {
                                gradesSum += grade.value;
                                totalGrades++;
                            });
                        });
                        
                        const subjectAverage = totalGrades > 0 ? (gradesSum / totalGrades).toFixed(1) : "0.0";
                        
                        // Determinar a cor com base na média
                        let indicatorColor = Colors.primaryColor;
                        if (subjectAverage >= 8.0) {
                            indicatorColor = Colors.greenColor;
                        } else if (subjectAverage >= 6.0) {
                            indicatorColor = Colors.secondaryColor;
                        } else if (subjectAverage < 6.0) {
                            indicatorColor = Colors.redColor;
                        }
                        
                        const isExpanded = expandedSubjectId === item.id;
                        
                        return (
                            <View key={`${item.id}`} style={styles.subjectContainer}>
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={() => toggleExpand(index, item.id)}
                                    style={styles.infoWrapStyle}
                                >
                                    <View>
                                        <View style={styles.subjectTitleContainer}>
                                            <Text style={{ ...Fonts.blackColor16SemiBold, flex: 1 }}>
                                                {item.subject}
                                            </Text>
                                            <View style={[
                                                styles.averageTag, 
                                                { 
                                                    borderColor: parseFloat(subjectAverage) >= 6 ? 
                                                        '#3498db' : Colors.redColor,
                                                    backgroundColor: parseFloat(subjectAverage) >= 6 ? 
                                                        '#3498db15' : Colors.redColor + '15'
                                                }
                                            ]}>
                                                <Text style={{ 
                                                    color: parseFloat(subjectAverage) >= 6 ? '#3498db' : Colors.redColor,
                                                    fontSize: 15,
                                                    fontFamily: 'Inter-SemiBold'
                                                }}>
                                                    {subjectAverage}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={styles.teacherInfoContainer}>
                                            <MaterialIcons name="person" size={16} color={Colors.secondaryColor} />
                                            <Text style={{ marginLeft: 4, ...Fonts.grayColor14Regular }}>
                                                {item.teacher || "Professor não informado"}
                                            </Text>
                                        </View>
                                        
                                        {/* Remover exibição da nota no card fechado */}
                                        {/*
                                        {!isExpanded && (
                                            <View style={styles.gradesPreviewContainer}>
                                                <View style={styles.unitAveragePreview}>
                                                    <Text style={{ ...Fonts.primaryColor16Bold }}>
                                                        {item.units.length > currentUnitIndex ? 
                                                            calculateUnitAverage(item.units[currentUnitIndex]) : 
                                                            "0.0"}
                                                    </Text>
                                                </View>
                                            </View>
                                        )}
                                        */}
                                        
                                        {isExpanded && (
                                            <View>
                                                {item.units.length > currentUnitIndex && (
                                                    <View style={styles.unitContainer}>
                                                        <Text style={styles.unitTitle}>
                                                            {selectedPeriod}
                                                        </Text>
                                                        
                                                        {item.units[currentUnitIndex].grades.map((grade, gradeIndex) => (
                                                            <View key={`grade-${gradeIndex}`} style={styles.gradeRow}>
                                                                <Text style={{ ...Fonts.blackColor14Regular, flex: 1 }}>
                                                                    {grade.title}
                                                                </Text>
                                                                <View style={[
                                                                    styles.gradeValueContainer,
                                                                    {
                                                                        borderColor: parseFloat(grade.value) >= 6 ? 
                                                                            '#3498db' : Colors.redColor,
                                                                        backgroundColor: parseFloat(grade.value) >= 6 ? 
                                                                            '#3498db15' : Colors.redColor + '15'
                                                                    }
                                                                ]}>
                                                                    <Text style={{ 
                                                                        color: parseFloat(grade.value) >= 6 ? '#3498db' : Colors.redColor,
                                                                        fontSize: 14,
                                                                        fontFamily: 'Inter-Medium'
                                                                    }}>
                                                                        {grade.value.toFixed(1)}
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                        ))}
                                                        
                                                        <View style={styles.unitAverageContainer}>
                                                            <Text style={{ ...Fonts.blackColor14Medium }}>
                                                                Média do {selectedPeriod}:
                                                            </Text>
                                                            <Text style={{ 
                                                                color: parseFloat(calculateUnitAverage(item.units[currentUnitIndex])) >= 6 ? 
                                                                    '#3498db' : Colors.redColor,
                                                                fontSize: 16,
                                                                fontFamily: 'Inter-Bold'
                                                            }}>
                                                                {calculateUnitAverage(item.units[currentUnitIndex])}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                )}
                                            </View>
                                        )}
                                    </View>
                                    <MaterialIcons
                                        name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                                        size={24}
                                        color={Colors.grayColor}
                                        style={{ alignSelf: 'center', marginTop: isExpanded ? 10 : 0 }}
                                    />
                                </TouchableOpacity>
                            </View>
                        );
                    }}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 20.0 }}
                />
            </View>
        );
    }

    function studentNameAndPracticeText() {
        return (
            <View style={styles.studentInfoContainer}>
                <Text style={styles.studentName}>
                    {studentData.name}
                </Text>
                <Text style={styles.semesterInfo}>
                    {studentData.grade} - {schoolData.currentSemester}
                </Text>
            </View>
        )
    }

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <MaterialIcons name="arrow-back" size={24} color={Colors.whiteColor} onPress={() => { navigation.pop() }} />
                <Text style={{ marginLeft: Sizes.fixPadding * 2.0, ...Fonts.whiteColor18SemiBold }}>
                    Boletim Escolar
                </Text>
            </View>
        )
    }
}

export default ProgressCardScreen

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
        paddingBottom: Sizes.fixPadding * 15.0,
    },
    studentInfoContainer: {
        alignItems: 'center',
        marginVertical: Sizes.fixPadding * 2.0,
    },
    studentName: {
        textAlign: 'center',
        ...Fonts.blackColor30BebasRegular
    },
    semesterInfo: {
        marginTop: Sizes.fixPadding - 5.0,
        textAlign: 'center',
        ...Fonts.blackColor15Regular
    },
    allPeriodsWrapStyle: {
        borderColor: Colors.secondaryColor,
        borderWidth: 1.0,
        borderRadius: Sizes.fixPadding * 2.0,
        margin: Sizes.fixPadding * 2.0,
        overflow: 'hidden'
    },
    periodWrapStyle: {
        borderRadius: Sizes.fixPadding * 2.0,
        paddingVertical: Sizes.fixPadding - 5.0,
    },
    periodTitle: {
        ...Fonts.blackColor15Medium,
        marginBottom: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding * 2.0,
    },
    periodSummaryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding,
    },
    subjectContainer: {
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding * 2.0,
    },
    infoWrapStyle: {
        borderColor: Colors.lightGrayColor,
        borderWidth: 1.0,
        borderRadius: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding * 2.0,
        paddingHorizontal: Sizes.fixPadding + 5.0,
        backgroundColor: Colors.whiteColor,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    subjectTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Sizes.fixPadding,
    },
    averageTag: {
        backgroundColor: Colors.primaryColor + '15',
        borderRadius: Sizes.fixPadding,
        paddingHorizontal: Sizes.fixPadding * 0.8,
        paddingVertical: Sizes.fixPadding * 0.3,
        marginLeft: Sizes.fixPadding,
        borderWidth: 1,
    },
    teacherInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Sizes.fixPadding,
    },
    unitContainer: {
        marginTop: Sizes.fixPadding,
        padding: Sizes.fixPadding,
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding,
        borderWidth: 1,
        borderColor: Colors.lightGrayColor,
    },
    unitTitle: {
        ...Fonts.blackColor16SemiBold,
        marginBottom: Sizes.fixPadding,
        color: Colors.primaryColor,
    },
    gradeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Sizes.fixPadding / 2,
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightGrayColor,
    },
    gradeValueContainer: {
        backgroundColor: Colors.primaryColor + '15',
        borderRadius: Sizes.fixPadding,
        paddingHorizontal: Sizes.fixPadding * 0.8,
        paddingVertical: Sizes.fixPadding * 0.3,
        borderColor: Colors.primaryColor,
        borderWidth: 1,
    },
    unitAverageContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: Sizes.fixPadding,
        paddingTop: Sizes.fixPadding / 2,
    },
    gradesPreviewContainer: {
        marginTop: Sizes.fixPadding,
        borderTopWidth: 1,
        borderTopColor: Colors.lightGrayColor,
        paddingTop: Sizes.fixPadding,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    unitAveragePreview: {
        backgroundColor: Colors.primaryColor + '15',
        paddingHorizontal: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding / 2,
        borderRadius: Sizes.fixPadding - 5,
        marginLeft: Sizes.fixPadding,
        borderColor: Colors.primaryColor,
        borderWidth: 1,
    },
})

// Função para calcular a média de uma unidade
const calculateUnitAverage = (unit) => {
    if (!unit || !unit.grades || unit.grades.length === 0) return "0.0";
    
    const unitGrades = unit.grades.map(g => g.value);
    return (unitGrades.reduce((a, b) => a + b, 0) / unitGrades.length).toFixed(1);
};
