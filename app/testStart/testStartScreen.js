import { StyleSheet, Text, View, ImageBackground, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Colors, Fonts, Sizes } from '../../constants/styles'
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import MyStatusBar from '../../components/myStatusBar';
import { useNavigation } from 'expo-router';

const questionsList = [
    {
        id: '1',
        question: 'Qual economista dividiu a Economia em dois ramos, micro e macro, com base na atividade econômica?',
        options: [
            'Marshall',
            'Ricardo',
            'Ragnar Frish',
            'Nenhuma das alternativas',
            'John Maynard Keynes'
        ],
        correctAnswer: 'Nenhuma das alternativas',
        userAnswer: '',
    },
    {
        id: '2',
        question: 'Qual das seguintes áreas é estudada na Microeconomia?',
        options: [
            'Unidade individual',
            'Agregado econômico',
            'Renda nacional',
            'Nenhuma das alternativas',
            'Todos os sistemas econômicos'
        ],
        correctAnswer: 'Nenhuma das alternativas',
        userAnswer: '',
    },
    {
        id: '3',
        question: 'O termo "Micros", que significa "Pequeno", pertence a qual idioma:',
        options: [
            'Palavra árabe',
            'Palavra grega',
            'Palavra alemã',
            'Palavra inglesa',
            'Palavra latina'
        ],
        correctAnswer: 'Palavra grega',
        userAnswer: '',
    },
    {
        id: '4',
        question: 'Qual das seguintes afirmações é verdadeira?',
        options: [
            'Os desejos humanos são infinitos',
            'Os recursos são limitados',
            'O problema da escassez dá origem',
            'Todas as alternativas',
            'Nenhuma das alternativas'
        ],
        correctAnswer: 'O problema da escassez dá origem',
        userAnswer: '',
    },
    {
        id: '5',
        question: 'Qual é um problema central de uma economia?',
        options: [
            'Alocação de recursos',
            'Utilização ótima de recursos',
            'Desenvolvimento econômico',
            'Todas as alternativas',
            'Nenhuma das alternativas'
        ],
        correctAnswer: 'Todas as alternativas',
        userAnswer: '',
    },
    {
        id: '6',
        question: 'Qual dos seguintes é um tipo de atividade econômica?',
        options: [
            'Produção',
            'Consumo',
            'Troca e Investimento',
            'Todas as alternativas',
            'Nenhuma das alternativas'
        ],
        correctAnswer: 'Todas as alternativas',
        userAnswer: '',
    },
    {
        id: '7',
        question: 'A qual fator o problema econômico está basicamente relacionado:',
        options: [
            'Escolha',
            'Seleção do consumidor',
            'Seleção da empresa',
            'Nenhuma das alternativas',
            'Todas as alternativas'
        ],
        correctAnswer: 'Escolha',
        userAnswer: '',
    },
    {
        id: '8',
        question: 'A economia pode ser classificada como:',
        options: [
            'Capitalista',
            'Socialista',
            'Mista',
            'Todas as alternativas',
            'Nenhuma das alternativas'
        ],
        correctAnswer: 'Todas as alternativas',
        userAnswer: '',
    },
    {
        id: '9',
        question: 'Qual economia tem coexistência de setores públicos e privados?',
        options: [
            'Capitalista',
            'Socialista',
            'Mista',
            'Todas as alternativas',
            'Tradicional'
        ],
        correctAnswer: 'Mista',
        userAnswer: '',
    },
    {
        id: '10',
        question: 'O principal objetivo de uma economia socialista é:',
        options: [
            'Produção máxima',
            'Liberdade econômica',
            'Obtenção de lucro',
            'Bem-estar público máximo',
            'Bem-estar público mínimo'
        ],
        correctAnswer: 'Bem-estar público máximo',
        userAnswer: '',
    },
    {
        id: '11',
        question: 'Em qual economia as decisões são tomadas com base no mecanismo de preços?',
        options: [
            'Socialista',
            'Capitalista',
            'Mista',
            'Todas as alternativas',
            'Economia de comando'
        ],
        correctAnswer: 'Capitalista',
        userAnswer: '',
    },
    {
        id: '12',
        question: 'A Curva de Possibilidade de Produção é:',
        options: [
            'Côncava ao eixo',
            'Convexa ao eixo',
            'Paralela ao eixo',
            'Vertical ao eixo',
            'Horizontal ao eixo'
        ],
        correctAnswer: 'Côncava ao eixo',
        userAnswer: '',
    },
    {
        id: '13',
        question: 'Mencione o nome da curva que mostra o problema econômico:',
        options: [
            'Curva de Produção',
            'Curva de Demanda',
            'Curva de Indiferença',
            'Curva de Possibilidade de Produção',
            'Curva de Oferta'
        ],
        correctAnswer: 'Curva de Possibilidade de Produção',
        userAnswer: '',
    },
    {
        id: '14',
        question: 'Qual dos seguintes é estudado em Macroeconomia?',
        options: [
            'Renda Nacional',
            'Pleno Emprego',
            'Produção Total',
            'Todas as alternativas',
            'Nenhuma das alternativas'
        ],
        correctAnswer: 'Todas as alternativas',
        userAnswer: '',
    },
    {
        id: '15',
        question: 'Qual das seguintes é uma área da Microeconomia?',
        options: [
            'Determinação de Preço de Produto',
            'Determinação de Preço de Fator',
            'Bem-estar Econômico',
            'Todas as alternativas',
            'Nenhuma das alternativas'
        ],
        correctAnswer: 'Todas as alternativas',
        userAnswer: '',
    },
    {
        id: '16',
        question: 'Qual das seguintes é uma fonte de produção?',
        options: [
            'Terra',
            'Trabalho',
            'Capital',
            'Todas as alternativas',
            'Empreendedor'
        ],
        correctAnswer: 'Todas as alternativas',
        userAnswer: '',
    },
    {
        id: '17',
        question: 'Quem disse: "A Economia é uma ciência da riqueza"?',
        options: [
            'Marshall',
            'Robbins',
            'Adam Smith',
            'J.K. Mehta',
            'David Ricardo'
        ],
        correctAnswer: 'Adam Smith',
        userAnswer: '',
    },
    {
        id: '18',
        question: 'A Economia é uma ciência da lógica. Quem disse isso?',
        options: [
            'Hicks',
            'Keynes',
            'Robbins',
            'Marshall',
            'Pigou'
        ],
        correctAnswer: 'Robbins',
        userAnswer: '',
    },
    {
        id: '19',
        question: 'A Microeconomia inclui:',
        options: [
            'Unidade individual',
            'Pequenas unidades',
            'Determinação individual de preços',
            'Todas as alternativas',
            'Nenhuma das alternativas'
        ],
        correctAnswer: 'Todas as alternativas',
        userAnswer: '',
    },
    {
        id: '20',
        question: 'Em qual base a estrutura dos problemas econômicos foi estabelecida?',
        options: [
            'Desejos ilimitados',
            'Recursos limitados',
            'Ambos (a) e (b)',
            'Nenhuma das alternativas',
            'Todos os fatores econômicos'
        ],
        correctAnswer: 'Ambos (a) e (b)',
        userAnswer: '',
    },
];

const totalExamMinute = 30;

const TestStartScreen = () => {

    const navigation = useNavigation();

    const [second, setSecond] = useState(0);
    const [minute, setMinute] = useState(totalExamMinute);
    const [questions, setQuestions] = useState(questionsList);
    const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
    const [timeRunning, settimeRunning] = useState(false);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            settimeRunning(true);
        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            settimeRunning(false);
        });

        return unsubscribe;
    }, [navigation])

    useEffect(() => {
        if (timeRunning) {
            setTimeout(() => {
                if (second > 0) {
                    setSecond(second - 1)
                }
                else {
                    if (second == 0 && minute !== 0) {
                        setMinute(minute - 1)
                        minute - 1 !== 0 ? setSecond(59) : null;
                    }
                    else {
                        setMinute(0)
                    }
                }
            }, 1000);
        }
        else {
            clearTimeout()
        }
        return () => {
            clearTimeout()
        }
    }, [second, timeRunning]);

    return (
        <View style={{ flex: 1, backgroundColor: Colors.primaryColor }}>
            <MyStatusBar />
            <ImageBackground
                source={require('../../assets/images/bgImage.png')}
                style={{ width: '100%', height: 250, flex: 1, }}
                resizeMode="stretch"
                tintColor={Colors.whiteColor}
            >
                <View style={{ flex: 1, }}>
                    {header()}
                    {timingInfo()}
                    {questionNumberInfo()}
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: Sizes.fixPadding * 3.0, paddingBottom: Sizes.fixPadding * 6.0, }}>
                        {questionInfo()}
                    </ScrollView>
                </View>
            </ImageBackground>
        </View>
    )

    function updateQuestions({ id, userAnswer }) {
        const copyQuestions = questions;
        const newQuestions = copyQuestions.map((item) => {
            if (item.id == id) {
                return { ...item, userAnswer: userAnswer }
            }
            else {
                return item
            }
        });
        setQuestions(newQuestions);
    }

    function stylingSort({ item }) {
        return questions[selectedQuestionIndex].userAnswer
            ?
            (questions[selectedQuestionIndex].userAnswer == questions[selectedQuestionIndex].correctAnswer)
                ?
                questions[selectedQuestionIndex].userAnswer == item
                    ?
                    Colors.darkGreenColor
                    :
                    Colors.lightGrayColor
                :
                questions[selectedQuestionIndex].userAnswer == item
                    ?
                    Colors.redColor
                    :
                    questions[selectedQuestionIndex].correctAnswer == item
                        ?
                        Colors.darkGreenColor
                        :
                        Colors.lightGrayColor
            :
            Colors.lightGrayColor
    }

    function questionInfo() {
        return (
            <View>
                <View style={{ bottom: -40.0, marginHorizontal: Sizes.fixPadding * 6.0, ...styles.paperLayerStyle }} />
                <View style={{ marginHorizontal: Sizes.fixPadding * 4.0, bottom: -20.0, ...styles.paperLayerStyle, }} />
                <View style={styles.questionInfoWrapStyle}>
                    <Text style={{ marginBottom: Sizes.fixPadding * 2.0, ...Fonts.blackColor17Medium }}>
                        {questions[selectedQuestionIndex].question}
                    </Text>
                    {
                        questions[selectedQuestionIndex].options.map((item, index) => (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => {
                                    questions[selectedQuestionIndex].userAnswer
                                        ?
                                        null
                                        :
                                        updateQuestions({ id: questions[selectedQuestionIndex].id, userAnswer: item })
                                }}
                                key={`${index}`}
                                style={{
                                    borderColor: stylingSort({ item: item }),
                                    backgroundColor: stylingSort({ item: item }) == Colors.lightGrayColor ? Colors.whiteColor : stylingSort({ item: item }) == Colors.darkGreenColor ? '#6AC25915' : '#E9202015',
                                    borderWidth: stylingSort({ item: item }) !== Colors.lightGrayColor ? 1.5 : 1.0,
                                    ...styles.optionsWrapStyle,
                                }}
                            >
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Text
                                        style={{
                                            fontSize: 15.0,
                                            fontFamily: stylingSort({ item: item }) == Colors.lightGrayColor ? 'Inter_Regular' : 'Inter_SemiBold',
                                            color: stylingSort({ item: item }) == Colors.lightGrayColor ? Colors.grayColor : stylingSort({ item: item })
                                        }}
                                    >
                                        {index == 0 ? 'A.' : index == 1 ? 'B.' : index == 2 ? 'C.' : index == 3 ? 'D.' : 'E.'}
                                    </Text>
                                    <Text
                                        style={{
                                            flex: 1, fontSize: 15.0, marginLeft: Sizes.fixPadding - 5.0,
                                            fontFamily: stylingSort({ item: item }) == Colors.lightGrayColor ? 'Inter_Regular' : 'Inter_SemiBold',
                                            color: stylingSort({ item: item }) == Colors.lightGrayColor ? Colors.grayColor : stylingSort({ item: item })
                                        }}
                                    >
                                        {item}
                                    </Text>
                                </View>
                                {
                                    stylingSort({ item: item }) == Colors.lightGrayColor
                                        ?
                                        <View style={styles.notSelectedOptionIndicatorStyle} />
                                        :
                                        stylingSort({ item: item }) == Colors.redColor
                                            ?
                                            <MaterialCommunityIcons name="close-circle" size={20} color={Colors.redColor} />
                                            :
                                            <MaterialCommunityIcons name="check-circle" size={20} color={Colors.darkGreenColor} />
                                }
                            </TouchableOpacity>
                        ))
                    }
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => { selectedQuestionIndex == questions.length - 1 ? navigation.push('testResult/testResultScreen') : setSelectedQuestionIndex(selectedQuestionIndex + 1) }}
                        style={styles.nextAndViewScoreStyle}
                    >
                        <Text style={{ ...Fonts.secondaryColor16SemiBold }}>
                            {selectedQuestionIndex == questions.length - 1 ? 'Ver Resultado' : 'Próxima'}
                        </Text>
                        <MaterialIcons
                            name='arrow-forward'
                            color={Colors.secondaryColor}
                            size={22}
                            style={{ marginLeft: Sizes.fixPadding }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    function questionNumberInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginTop: Sizes.fixPadding * 3.0, }}>
                <Text style={{ marginBottom: Sizes.fixPadding + 3.0, ...Fonts.whiteColor20Medium }}>
                    Questão {selectedQuestionIndex + 1}
                    <Text style={{ ...Fonts.whiteColor13Regular }}>
                        { } /{questionsList.length}
                    </Text>
                </Text>
                <View style={{ borderColor: Colors.lightGrayColor, borderStyle: 'dashed', borderWidth: 1.0, }} />
            </View>
        )
    }

    function timingInfo() {
        var displayMinute = minute.toString().length == 1 ? `0${minute}` : minute;
        var displaySecond = second.toString().length == 1 ? `0${second}` : second
        return (
            <View style={styles.progressIndicatorWrapStyle}>
                <View style={{ flex: (minute / totalExamMinute), ...styles.timingIndicatorStyle, }} />
                <Text style={styles.timingTextStyle}>
                    {displayMinute}:{displaySecond} {minute == 0 ? 'seg' : 'min'}
                </Text>
            </View>
        )
    }

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <MaterialIcons name="arrow-back" size={24} color={Colors.whiteColor} onPress={() => { navigation.pop() }} />
                <Text style={{ marginLeft: Sizes.fixPadding * 2.0, ...Fonts.whiteColor18SemiBold }}>
                    Teste de Economia
                </Text>
            </View>
        )
    }
}

export default TestStartScreen

const styles = StyleSheet.create({
    headerWrapStyle: {
        marginVertical: Sizes.fixPadding * 3.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
        flexDirection: 'row',
        alignItems: 'center'
    },
    timingTextStyle: {
        position: 'absolute',
        padding: Sizes.fixPadding,
        ...Fonts.whiteColor14Medium,
        transform: [],
        alignSelf: 'center',
    },
    timingIndicatorStyle: {
        flexDirection: 'row',
        backgroundColor: Colors.darkPrimaryColor,
        alignItems: 'stretch',
    },
    progressIndicatorWrapStyle: {
        backgroundColor: Colors.secondaryColor,
        borderRadius: Sizes.fixPadding * 2.0,
        borderWidth: 2.0,
        borderColor: Colors.whiteColor,
        marginHorizontal: Sizes.fixPadding * 2.0,
        height: 38.0,
        flexDirection: 'row-reverse',
        overflow: 'hidden',
        transform: [],
    },
    paperLayerStyle: {
        position: 'absolute',
        left: 0.0,
        right: 0.0,
        height: '100%',
        borderRadius: Sizes.fixPadding * 3.4,
        backgroundColor: '#CED7D9',
        elevation: 3.0,
        shadowColor: Colors.blackColor,
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 10
    },
    nextAndViewScoreStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        alignSelf:'flex-end',
        marginTop: Sizes.fixPadding + 5.0,
    },
    questionInfoWrapStyle: {
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding * 3.4,
        marginHorizontal: Sizes.fixPadding * 2.0,
        paddingHorizontal: Sizes.fixPadding * 2.0,
        paddingVertical: Sizes.fixPadding * 2.5,
        elevation: 3.0,
    },
    optionsWrapStyle: {
        borderRadius: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding + 5.0,
        paddingVertical: Sizes.fixPadding + 7.0,
        paddingHorizontal: Sizes.fixPadding * 2.0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    notSelectedOptionIndicatorStyle: {
        width: 20.0,
        height: 20.0,
        borderRadius: 10.0,
        borderColor: Colors.lightGrayColor,
        borderWidth: 1.0,
    }
})