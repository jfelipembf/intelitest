import { StyleSheet, Text, View, ImageBackground, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Colors, Fonts, Sizes } from '../../constants/styles'
import { MaterialIcons } from '@expo/vector-icons';
import MyStatusBar from '../../components/myStatusBar';
import { useNavigation } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { useSchool } from '../../hooks/useSchool';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';

const runningTestsList = [
    {
        id: '1',
        subject: 'Teste Semanal de Economia',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Porta elementum elementum nisl sagittis. Mauris commodo, netus mauris eu nullam phasellus ipsum sapien.',
        questionsCount: 20,
        totalMinutes: 30,
    },
];

const oldTestList = [
    {
        id: '1',
        subject: 'Teste de Inglês',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Porta elementum elementum nisl sagittis. Mauris commodo, netus mauris eu nullam phasellus ipsum sapien.',
        totalQuestions: 30,
        correctAnswers: 12,
        rank: 26,
        arrangeDate: '9 Dez 2020',
    },
    {
        id: '2',
        subject: 'Teste de Economia',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Porta elementum elementum nisl sagittis. Mauris commodo, netus mauris eu nullam phasellus ipsum sapien.',
        totalQuestions: 50,
        correctAnswers: 45,
        rank: 5,
        arrangeDate: '15 Dez 2020',
    },
    {
        id: '3',
        subject: 'Teste de Inglês',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Porta elementum elementum nisl sagittis. Mauris commodo, netus mauris eu nullam phasellus ipsum sapien.',
        totalQuestions: 50,
        correctAnswers: 45,
        rank: 3,
        arrangeDate: '20 Dez 2020',
    },
];

const TestScreen = () => {

    const navigation = useNavigation();
    const { userData } = useAuth();
    const { schoolData, classData, loading: schoolLoading } = useSchool();
    const [tests, setTests] = useState([]);
    const [oldTests, setOldTests] = useState(oldTestList);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTests();
    }, [schoolData, classData]);

    const fetchTests = async () => {
        if (!schoolData || !classData) {
            setTests(runningTestsList);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            // Aqui seria uma chamada real ao Firestore para buscar os testes da escola e turma
            // Simulando uma chamada com um atraso de 1 segundo
            setTimeout(() => {
                // Exemplo de como seria a lógica com Firestore:
                // const q = query(
                //     collection(db, 'tests'), 
                //     where('schoolId', '==', schoolData.id),
                //     where('classId', '==', classData.id)
                // );
                // const querySnapshot = await getDocs(q);
                // const fetchedTests = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                
                // Por enquanto, vamos apenas adicionar informações da escola/turma nos testes mockados
                const testsWithSchoolInfo = runningTestsList.map(test => ({
                    ...test,
                    schoolName: schoolData.name || "Escola não identificada",
                    className: classData.name || "Turma não identificada"
                }));
                
                setTests(testsWithSchoolInfo);
                setLoading(false);
            }, 1000);
        } catch (error) {
            console.error('Erro ao buscar testes:', error);
            setTests(runningTestsList);
            setLoading(false);
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
                    {(loading || schoolLoading) ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={Colors.primaryColor} />
                            <Text style={{ ...Fonts.grayColor14Medium, marginTop: Sizes.fixPadding }}>
                                Carregando testes...
                            </Text>
                        </View>
                    ) : (
                        <FlatList
                            ListHeaderComponent={
                                <>
                                    {schoolInfo()}
                                    {runningTestInfo()}
                                    {oldTestsInfo()}
                                </>
                            }
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingTop: Sizes.fixPadding * 2.0, }}
                        />
                    )}
                </View>
            </ImageBackground>
        </View>
    );

    function schoolInfo() {
        if (!schoolData || !classData) return null;
        
        return (
            <View style={styles.schoolInfoContainer}>
                <Text style={{ ...Fonts.blackColor16SemiBold, marginBottom: Sizes.fixPadding }}>
                    Informações da Escola
                </Text>
                <Text style={{ ...Fonts.blackColor14Medium }}>
                    {schoolData.name || "Escola não identificada"}
                </Text>
                <Text style={{ ...Fonts.grayColor13Regular }}>
                    Turma: {classData.name || userData?.academicInfo?.class || "N/A"}
                </Text>
                <View style={styles.divider} />
            </View>
        );
    }

    function oldTestsInfo() {
        const renderItem = ({ item }) => (
            <View style={{ ...styles.infoWrapStyle, paddingVertical: Sizes.fixPadding * 2.0, paddingHorizontal: Sizes.fixPadding + 5.0, }}>
                <Text style={{ ...Fonts.blackColor15Medium }}>
                    {item.subject}
                </Text>
                <Text style={{ marginTop: Sizes.fixPadding, ...Fonts.grayColor13Regular }}>
                    {item.description}
                </Text>
                <View style={{ backgroundColor: Colors.lightGrayColor, height: 1.0, marginVertical: Sizes.fixPadding + 5.0, }} />
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ ...item.rank > 5 ? { ...Fonts.redColor14Medium } : { ...Fonts.secondaryColor14Medium }, flex: 1, }}>
                        {item.correctAnswers}/{item.totalQuestions} Corretas • Posição #{item.rank}
                    </Text>
                    <Text style={{ ...Fonts.blackColor14Medium }}>
                        {item.arrangeDate}
                    </Text>
                </View>
            </View>
        );
        return (
            <View>
                <FlatList
                    listKey='old'
                    data={oldTests}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={renderItem}
                    scrollEnabled={false}
                />
            </View>
        );
    }

    function runningTestInfo() {
        const renderItem = ({ item }) => (
            <View style={styles.infoWrapStyle}>
                <View style={{ padding: Sizes.fixPadding + 5.0, }}>
                    <Text style={{ marginVertical: Sizes.fixPadding - 5.0, ...Fonts.blackColor15Medium }}>
                        {item.subject}
                    </Text>
                    <Text style={{ ...Fonts.grayColor13Regular }}>
                        {item.description}
                    </Text>
                </View>
                <View style={{}}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={styles.totalQuestionsAndMinutesWrapStyle}>
                            <Text numberOfLines={1} style={{ ...Fonts.blackColor14Medium }}>
                                {item.questionsCount} Questões • {item.totalMinutes} minutos
                            </Text>
                        </View>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => { navigation.push('testStart/testStartScreen') }}
                            style={styles.continueButtonStyle}
                        >
                            <Text style={{ ...Fonts.whiteColor16Bold }}>
                                Continuar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
        return (
            <View>
                <FlatList
                    listKey='running'
                    data={tests}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={renderItem}
                    scrollEnabled={false}
                />
            </View>
        );
    }

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <MaterialIcons name="arrow-back" size={24} color={Colors.whiteColor} onPress={() => { navigation.pop() }} />
                <Text style={{ marginLeft: Sizes.fixPadding * 2.0, ...Fonts.whiteColor18SemiBold }}>
                    Testes
                </Text>
            </View>
        );
    }
};

export default TestScreen;

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
    totalQuestionsAndMinutesWrapStyle: {
        flex: 1,
        marginLeft: Sizes.fixPadding + 5.0,
        height: 48.0,
        justifyContent: 'center',
        borderTopColor: Colors.lightGrayColor,
        borderTopWidth: 1.0,
    },
    continueButtonStyle: {
        backgroundColor: Colors.secondaryColor,
        height: 48.0,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Sizes.fixPadding * 2.0,
        borderTopRightRadius: Sizes.fixPadding,
        borderBottomRightRadius: Sizes.fixPadding,
    },
    infoWrapStyle: {
        borderColor: Colors.lightGrayColor,
        borderWidth: 1.0,
        borderRadius: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding * 2.0,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: Sizes.fixPadding * 5.0,
    },
    schoolInfoContainer: {
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding * 2.0,
        padding: Sizes.fixPadding,
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding,
        borderColor: Colors.primaryColor,
        borderWidth: 1.0,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.lightGrayColor,
        marginTop: Sizes.fixPadding,
    }
});