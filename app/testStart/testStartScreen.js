import { StyleSheet, Text, View, ImageBackground, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Colors, Fonts, Sizes } from '../../constants/styles'
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import MyStatusBar from '../../components/myStatusBar';
import { useNavigation } from 'expo-router';

const questionsList = [
    {
        id: '1',
        question: 'Which Economist divided Economics in two branches of micro and macro on the basis of economic activity?',
        options: [
            'Marshall',
            'Ricardo',
            'Ragnar Frish',
            'None of these'
        ],
        correctAnswer: 'None of these',
        userAnswer: '',
    },
    {
        id: '2',
        question: 'Which of the following is studied under Micro Economics?',
        options: [
            'Individual unit',
            'Economic Aggregate',
            'National Income',
            'None of these'
        ],
        correctAnswer: 'None of these',
        userAnswer: '',
    },
    {
        id: '3',
        question: '‘Micros’, which means ‘Small’ belongs to:',
        options: [
            'Arabian word',
            'Greek word',
            'German word',
            'English worde'
        ],
        correctAnswer: 'Greek word',
        userAnswer: '',
    },
    {
        id: '4',
        question: 'Which of the following statement is true?',
        options: [
            'Human wants are infinite',
            'Resources are limited',
            'Scarcity problem gives birth',
            'All of these'
        ],
        correctAnswer: 'Scarcity problem gives birth',
        userAnswer: '',
    },
    {
        id: '5',
        question: 'Which is a central problem of an economy?',
        options: [
            'Allocation of Resources',
            'Optimum Utilisation of Resources',
            'Economic Development',
            'All of these'
        ],
        correctAnswer: 'All of these',
        userAnswer: '',
    },
    {
        id: '6',
        question: 'Which of the following Is a type of economic activities?',
        options: [
            'Production',
            'Consumption',
            'Exchange and Investment',
            'All of these'
        ],
        correctAnswer: 'All of these',
        userAnswer: '',
    },
    {
        id: '7',
        question: 'To which factor, economic problem is basically related to:',
        options: [
            'Choice',
            'Consumer’s Selection',
            'Firm Selection',
            'None of these'
        ],
        correctAnswer: 'Choice',
        userAnswer: '',
    },
    {
        id: '8',
        question: 'Economy may be classified as:',
        options: [
            'Capitalist',
            'Socialist',
            'Mixed',
            'All of these'
        ],
        correctAnswer: 'All of these',
        userAnswer: '',
    },
    {
        id: '9',
        question: 'Which economy has a co-existence of private and public sectors?',
        options: [
            'Capitalist',
            'Socialist',
            'Mixed',
            'All of these'
        ],
        correctAnswer: 'Mixed',
        userAnswer: '',
    },
    {
        id: '10',
        question: 'The main objective of a socialist economy is…….',
        options: [
            'Maximum production',
            'Economic freedom',
            'Earning profit',
            'Maximum public welfare'
        ],
        correctAnswer: 'Maximum public welfare',
        userAnswer: '',
    },
    {
        id: '11',
        question: 'In which economy decisions are taken on the basis of price mechanism?',
        options: [
            'Socialist',
            'Capitalist',
            'Mixed',
            'All of these'
        ],
        correctAnswer: 'Capitalist',
        userAnswer: '',
    },
    {
        id: '12',
        question: 'Production Possibility Curve is:',
        options: [
            'Concave to the axis',
            'Convex to the axis',
            'Parallel to the axis',
            'Vertical to the axis'
        ],
        correctAnswer: 'Concave to the axis',
        userAnswer: '',
    },
    {
        id: '13',
        question: 'Mention the name of the curve which shows economic problem:',
        options: [
            'Production Curve',
            'Demand Curve',
            'Indifference Curve',
            'Production Possibility Curve'
        ],
        correctAnswer: 'Production Possibility Curve',
        userAnswer: '',
    },
    {
        id: '14',
        question: 'Which of the following is studied under Macro Economics?',
        options: [
            'National Income',
            'Full. Employment',
            'Total Production',
            'All of these'
        ],
        correctAnswer: 'All of these',
        userAnswer: '',
    },
    {
        id: '15',
        question: 'Which of the following Is a branch of Micro Economics?',
        options: [
            'Product Price Determination',
            'Factor Price Determination',
            'Economic Welfare',
            'All of these'
        ],
        correctAnswer: 'All of these',
        userAnswer: '',
    },
    {
        id: '16',
        question: 'Which of the following is a source of production?',
        options: [
            'Land',
            'Labour',
            'Capital',
            'All of these'
        ],
        correctAnswer: 'All of these',
        userAnswer: '',
    },
    {
        id: '17',
        question: 'Who said, “Economics is a science of wealth.”',
        options: [
            'Marshall',
            'Robbins',
            'Adam Smith',
            'J.K. Mehta'
        ],
        correctAnswer: 'Adam Smith',
        userAnswer: '',
    },
    {
        id: '18',
        question: '“Economics is a science of logic.’’ Who said it.',
        options: [
            'Hicks',
            'Keynes',
            'Robbins',
            'Marshall'
        ],
        correctAnswer: 'Robbins',
        userAnswer: '',
    },
    {
        id: '19',
        question: 'Micro Economics includes:',
        options: [
            'Individual unit',
            'Small units',
            'Individual price determination',
            'All of these'
        ],
        correctAnswer: 'All of these',
        userAnswer: '',
    },
    {
        id: '20',
        question: 'On which base structure of economic problems has been installed?',
        options: [
            'Unlimited Wants',
            'Limited Resources',
            'Both (a) and (b)',
            'None of the above'
        ],
        correctAnswer: 'Both (a) and (b)',
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
                                        {index == 0 ? 'A.' : index == 1 ? 'B.' : index == 2 ? 'C.' : 'D.'}
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
                            {selectedQuestionIndex == questions.length - 1 ? 'View Score' : 'Next'}
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
                    Question {selectedQuestionIndex + 1}
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
                    {displayMinute}:{displaySecond} {minute == 0 ? 'sec' : 'min'}
                </Text>
            </View>
        )
    }

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <MaterialIcons name="arrow-back" size={24} color={Colors.whiteColor} onPress={() => { navigation.pop() }} />
                <Text style={{ marginLeft: Sizes.fixPadding * 2.0, ...Fonts.whiteColor18SemiBold }}>
                    Economics Test
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
        transform: [{ rotate: '180deg' }],
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
        flexDirection: 'row',
        overflow: 'hidden',
        transform: [{ rotate: '-180deg' }]
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