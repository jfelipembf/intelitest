import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ScrollView, ImageBackground, Animated } from 'react-native'
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
    const animatedHeights = useRef(subjectsList.map(() => new Animated.Value(0))).current;
    const scrollViewRef = useRef(null);

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
                    <ScrollView 
                        ref={scrollViewRef}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 2.0 }}
                    >
                        {studentNameAndPracticeText()}
                        {subjectsListInfo()}
                    </ScrollView>
                </View>
            </ImageBackground>
        </View>
    )

    function subjectsListInfo() {
        return (
            <View style={{ marginBottom: Sizes.fixPadding * 2.0 }}>
                <Text style={{ marginBottom: Sizes.fixPadding * 2.0, marginHorizontal: Sizes.fixPadding * 2.0, ...Fonts.blackColor16Medium }}>
                    Disciplinas e Notas
                </Text>
                {
                    subjectsList.map((item, index) => {
                        // Calcula a média aritmética simples de todas as notas da disciplina
                        let totalGrades = 0;
                        let gradesSum = 0;
                        
                        // Percorre todas as unidades da disciplina
                        item.units.forEach(unit => {
                            unit.grades.forEach(grade => {
                                gradesSum += grade.value;
                                totalGrades++;
                            });
                        });
                        
                        const average = (gradesSum / totalGrades).toFixed(1);
                        const isExpanded = expandedSubjectId === item.id;
                        
                        return (
                            <View key={`${item.id}`} style={styles.subjectContainer}>
                                <TouchableOpacity
                                    style={[
                                        styles.subjectItemStyle, 
                                        isExpanded && styles.subjectItemExpanded,
                                        { borderColor: parseFloat(average) < 6 ? Colors.redColor : Colors.greenColor }
                                    ]}
                                    onPress={() => toggleExpand(index, item.id)}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.subjectOuterWrapStyle}>
                                        <View style={[styles.indicatorStyle, { backgroundColor: parseFloat(average) < 6 ? Colors.redColor : Colors.greenColor }]} />
                                        <View style={styles.infoWrapStyle}>
                                            <Text
                                                numberOfLines={1}
                                                style={{ flex: 1, ...Fonts.blackColor16Regular }}
                                            >
                                                {item.subject}
                                            </Text>
                                        </View>
                                        <View style={styles.averageContainer}>
                                            <View style={{ backgroundColor: parseFloat(average) < 6 ? Colors.lightRedColor : Colors.lightGreenColor, ...styles.countWrapStyle }}>
                                                <Text style={{ ...(parseFloat(average) < 6 ? Fonts.redColor15SemiBold : Fonts.greenColor15SemiBold) }}>
                                                    {average}
                                                </Text>
                                            </View>
                                            <MaterialIcons 
                                                name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                                                size={24} 
                                                color={Colors.grayColor} 
                                                style={{ marginRight: Sizes.fixPadding }}
                                            />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                
                                <Animated.View 
                                    style={[
                                        styles.expandableContent,
                                        {
                                            maxHeight: animatedHeights[index].interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0, 1500] // Valor alto para garantir que tudo seja exibido
                                            }),
                                            opacity: animatedHeights[index],
                                            borderLeftWidth: 1,
                                            borderRightWidth: 1,
                                            borderBottomWidth: 1,
                                            borderColor: parseFloat(average) < 6 ? Colors.redColor : Colors.greenColor,
                                            borderBottomLeftRadius: Sizes.fixPadding,
                                            borderBottomRightRadius: Sizes.fixPadding,
                                            paddingHorizontal: 0,
                                            position: 'relative'
                                        }
                                    ]}
                                >
                                    <View style={[styles.expandedIndicator, { backgroundColor: parseFloat(average) < 6 ? Colors.redColor : Colors.greenColor }]} />
                                    {/* Exibir notas por unidade */}
                                    {item.units.map((unit, unitIndex) => {
                                        // Calcula a média da unidade
                                        const unitGradesSum = unit.grades.reduce((sum, grade) => sum + grade.value, 0);
                                        const unitAverage = (unitGradesSum / unit.grades.length).toFixed(1);
                                        
                                        return (
                                            <View key={unitIndex} style={styles.unitContainer}>
                                                <Text style={styles.unitTitle}>{unit.name}</Text>
                                                
                                                {/* Cabeçalho da tabela de notas */}
                                                <View style={styles.gradeHeaderRow}>
                                                    <Text style={[styles.gradeHeaderText, { flex: 1 }]}>Avaliação</Text>
                                                    <Text style={[styles.gradeHeaderText, { flex: 1, textAlign: 'center' }]}>Nota</Text>
                                                </View>
                                                
                                                {/* Linhas de notas */}
                                                {unit.grades.map((grade, gradeIndex) => (
                                                    <View key={gradeIndex} style={styles.gradeRow}>
                                                        <Text style={[styles.gradeText, { flex: 1 }]}>{grade.title}</Text>
                                                        <Text style={[styles.gradeValueText, { flex: 1, textAlign: 'center' }]}>{grade.value.toFixed(1)}</Text>
                                                    </View>
                                                ))}
                                                
                                                {/* Média da unidade */}
                                                <View style={styles.unitAverageContainer}>
                                                    <Text style={styles.unitAverageLabel}>Média da Unidade:</Text>
                                                    <Text style={styles.unitAverageValue}>{unitAverage}</Text>
                                                </View>
                                            </View>
                                        );
                                    })}
                                    
                                    {/* Média final da disciplina */}
                                    <View style={[styles.finalAverageContainer, { marginLeft: 32 }]}>
                                        <Text style={styles.finalAverageLabel}>Média Final:</Text>
                                        <Text style={styles.finalAverageValue}>{average}</Text>
                                    </View>

                                </Animated.View>
                            </View>
                        )
                    })
                }
            </View>
        )
    }

    function studentNameAndPracticeText() {
        const overallAverage = calculateOverallAverage();
        const isLowAverage = parseFloat(overallAverage) < 6;
        
        return (
            <View style={styles.studentInfoContainer}>
                <Text style={styles.studentName}>
                    {studentData.name}
                </Text>
                <Text style={styles.semesterInfo}>
                    Boletim Escolar - {schoolData.currentSemester}
                </Text>
                <View style={styles.overallAverageContainer}>
                    <Text style={styles.overallAverageLabel}>Média Geral:</Text>
                    <View style={[styles.overallAverageValueContainer, { backgroundColor: isLowAverage ? Colors.lightRedColor : Colors.lightGreenColor }]}>
                        <Text style={[styles.overallAverageValue, isLowAverage ? Fonts.redColor16Bold : Fonts.greenColor16Bold]}>
                            {overallAverage}
                        </Text>
                    </View>
                </View>
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
        paddingBottom: Sizes.fixPadding * 5.0,
    },
    studentInfoContainer: {
        alignItems: 'center',
        margin: Sizes.fixPadding * 2.0,
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding,
        padding: Sizes.fixPadding * 1.5,
        borderWidth: 1,
        borderColor: Colors.lightGrayColor,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
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
    overallAverageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Sizes.fixPadding,
    },
    overallAverageLabel: {
        ...Fonts.blackColor16Medium,
        marginRight: Sizes.fixPadding,
    },
    overallAverageValueContainer: {
        width: 40.0,
        height: 40.0,
        borderRadius: 20.0,
        backgroundColor: Colors.lightGreenColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
    overallAverageValue: {
        ...Fonts.greenColor16Bold,
    },
    subjectContainer: {
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding / 2,
    },
    subjectItemStyle: {
        paddingVertical: 0,
        paddingHorizontal: 0,
        borderRadius: Sizes.fixPadding,
        backgroundColor: Colors.whiteColor,
        borderWidth: 1,
        borderColor: Colors.lightGrayColor,
        overflow: 'hidden',
    },
    subjectItemExpanded: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderBottomWidth: 0,
        borderColor: Colors.lightGrayColor,
        backgroundColor: Colors.whiteColor,
    },
    subjectTitleContainer: {
        flex: 1,
        padding: Sizes.fixPadding,
    },
    subjectTitle: {
        ...Fonts.blackColor16Medium,
    },
    indicatorStyle: {
        width: 32.0,
        borderTopLeftRadius: Sizes.fixPadding,
        borderBottomLeftRadius: 0,
        height: "100%",
        left: -1.0,
    },
    subjectOuterWrapStyle: {
        flexDirection: "row",
        justifyContent: "space-between",
        flex: 1,
    },
    infoWrapStyle: {
        flexDirection: "row",
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        padding: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding + 5,
    },
    averageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    averageText: {
        ...Fonts.blackColor16Medium,
        marginRight: Sizes.fixPadding,
    },
    countWrapStyle: {
        width: 32.0,
        height: 32.0,
        borderRadius: 16.0,
        alignItems: "center",
        justifyContent: "center",
        marginRight: Sizes.fixPadding,
    },
    expandableContent: {
        overflow: 'hidden',
        paddingHorizontal: 0,
        backgroundColor: Colors.whiteColor,
    },
    expandedIndicator: {
        width: 32.0,
        position: 'absolute',
        left: -1.0,
        top: 0,
        bottom: 0,
        zIndex: 0,
    },
    unitContainer: {
        marginBottom: Sizes.fixPadding,
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding,
        padding: Sizes.fixPadding,
        marginTop: Sizes.fixPadding / 2,
        marginLeft: 32,
        marginRight: Sizes.fixPadding,
        borderWidth: 1,
        borderColor: Colors.lightGrayColor,
    },
    unitTitle: {
        ...Fonts.blackColor16SemiBold,
        marginBottom: Sizes.fixPadding,
        color: Colors.primaryColor,
    },
    gradeHeaderRow: {
        flexDirection: 'row',
        paddingBottom: Sizes.fixPadding / 2,
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightGrayColor,
    },
    gradeHeaderText: {
        ...Fonts.blackColor14Medium,
    },
    gradeRow: {
        flexDirection: 'row',
        paddingVertical: Sizes.fixPadding / 2,
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightGrayColor,
    },
    gradeText: {
        ...Fonts.blackColor14Regular,
    },
    gradeValueText: {
        ...Fonts.blackColor14Medium,
    },
    unitAverageContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: Sizes.fixPadding,
        paddingTop: Sizes.fixPadding / 2,
    },
    unitAverageLabel: {
        ...Fonts.blackColor14Medium,
    },
    unitAverageValue: {
        ...Fonts.primaryColor16Bold,
    },
    finalAverageContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding / 2,
        paddingVertical: Sizes.fixPadding,
        paddingHorizontal: Sizes.fixPadding,
        borderTopWidth: 2,
        borderTopColor: Colors.primaryColor,
        backgroundColor: Colors.whiteColor,
    },
    finalAverageLabel: {
        ...Fonts.blackColor16Medium,
    },
    finalAverageValue: {
        ...Fonts.primaryColor18Bold,
    }
})
