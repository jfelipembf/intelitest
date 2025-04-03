import { StyleSheet, Text, View,   FlatList, ImageBackground } from 'react-native'
import React from 'react'
import { Colors, Fonts, Sizes } from '../../constants/styles'
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import MyStatusBar from '../../components/myStatusBar';
import { useNavigation } from 'expo-router';

const resultsList = [
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
        userAnswer: 'Ricardo',
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
        userAnswer: 'Greek word',
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
        userAnswer: 'Scarcity problem gives birth',
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
        userAnswer: 'All of these',
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
        userAnswer: 'All of these',
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
        userAnswer: 'Choice',
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
        userAnswer: 'All of these',
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
        userAnswer: 'Mixed',
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
        userAnswer: 'Earning profit',
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
        userAnswer: 'Capitalist',
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
        userAnswer: 'Production Possibility Curve',
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
        userAnswer: 'All of these',
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
        userAnswer: 'All of these',
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
        userAnswer: 'All of these',
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
        userAnswer: 'Adam Smith',
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
        userAnswer: 'Robbins',
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
        userAnswer: ' All of these',
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
        userAnswer: 'Unlimited Wants',
    },
];

const AnswerSheetScreen = () => {

    const navigation=useNavigation();
    
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
                    {answersWithResult()}
                </View>
            </ImageBackground>
        </View>
    )

    function stylingShort({ item, option }) {
        return item.userAnswer == item.correctAnswer
            ?
            item.userAnswer == option
                ?
                Colors.darkGreenColor
                :
                Colors.lightGrayColor
            :
            item.userAnswer == option
                ?
                Colors.redColor
                :
                item.correctAnswer == option
                    ?
                    Colors.darkGreenColor
                    :
                    Colors.lightGrayColor
    }

    function answersWithResult() {
        const renderItem = ({ item, index }) => (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, }}>
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flex: 1, flexDirection: 'row', }}>
                            <Text style={{ ...Fonts.blackColor15Medium }}>
                                {index + 1}. { }
                            </Text>
                            <Text style={{ flex: 1, ...Fonts.blackColor15Medium }}>
                                {item.question}
                                {
                                    item.userAnswer
                                        ?
                                        null
                                        :
                                        <Text style={{ ...Fonts.secondaryColor15SemiBold }}>
                                            { } (Skipped)
                                        </Text>
                                }
                            </Text>
                        </View>
                        <Text style={{ marginLeft: Sizes.fixPadding - 5.0, ...Fonts.grayColor15Medium }}>
                            {index + 1}/{resultsList.length}
                        </Text>
                    </View>
                    {item.options.map((option, innerIndex) => (
                        <View
                            key={`${innerIndex}`}
                            style={{
                                ...styles.optionsWrapStyle,
                                borderColor: stylingShort({ item: item, option: option }),
                                backgroundColor:
                                    stylingShort({ item: item, option: option }) == Colors.redColor
                                        ? '#E9202015' :
                                        stylingShort({ item: item, option: option }) == Colors.darkGreenColor
                                            ?
                                            '#6AC25915'
                                            :
                                            Colors.whiteColor
                            }}
                        >
                            <View style={{ flexDirection: 'row', flex: 1, }}>
                                <Text
                                    style={{
                                        fontSize: 15,
                                        fontFamily: stylingShort({ item: item, option: option }) == Colors.lightGrayColor ? 'Inter_Regular' : 'Inter_SemiBold',
                                        color: stylingShort({ item: item, option: option }) == Colors.lightGrayColor ? Colors.grayColor : stylingShort({ item: item, option: option })
                                    }}
                                >
                                    {innerIndex == 0 ? 'A' : innerIndex == 1 ? 'B' : innerIndex == 2 ? 'C' : 'D'}. { }
                                </Text>
                                <Text
                                    style={{
                                        flex: 1,
                                        fontSize: 15,
                                        fontFamily: stylingShort({ item: item, option: option }) == Colors.lightGrayColor ? 'Inter_Regular' : 'Inter_SemiBold',
                                        color: stylingShort({ item: item, option: option }) == Colors.lightGrayColor ? Colors.grayColor : stylingShort({ item: item, option: option })
                                    }}
                                >
                                    {option}
                                </Text>
                            </View>
                            {
                                stylingShort({ item: item, option: option }) == Colors.redColor
                                    ?
                                    <MaterialCommunityIcons name="close-circle" size={20} color={Colors.redColor} />
                                    :
                                    stylingShort({ item: item, option: option }) == Colors.darkGreenColor
                                        ?
                                        <MaterialCommunityIcons name="check-circle" size={20} color={Colors.darkGreenColor} />
                                        :
                                        <View style={styles.radioButtonStyle} />
                            }
                        </View>
                    ))}
                </View>
                {
                    index == resultsList.length - 1
                        ?
                        null
                        :
                        <View style={{ backgroundColor: Colors.lightGrayColor, height: 1.0, marginVertical: Sizes.fixPadding * 3.0, }} />
                }
            </View>
        )
        return (
            <FlatList
                data={resultsList}
                keyExtractor={(item) => `${item.id}`}
                renderItem={renderItem}
                contentContainerStyle={{ paddingVertical: Sizes.fixPadding * 2.0, }}
                ListFooterComponent={
                    <>
                        {markingInfo()}
                    </>
                }
                showsVerticalScrollIndicator={false}
            />
        )
    }

    function markingInfo() {
        return (
            <View style={styles.markingInfoWrapStyle}>
                <Text style={{ ...Fonts.blackColor40BebasRegular }}>
                    {resultsList.filter((item) => item.userAnswer == item.correctAnswer).length + 1}
                    <Text style={{ ...Fonts.grayColor40BebasRegular }}>/20</Text>
                </Text>
            </View>
        )
    }

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <MaterialIcons name="arrow-back" size={24} color={Colors.whiteColor} onPress={() => { navigation.pop() }} />
                <Text style={{ marginLeft: Sizes.fixPadding * 2.0, ...Fonts.whiteColor18SemiBold }}>
                    Answer Sheet
                </Text>
            </View>
        )
    }
}

export default AnswerSheetScreen

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
    optionsWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1.0,
        borderRadius: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginTop: Sizes.fixPadding + 5.0,
        paddingHorizontal: Sizes.fixPadding * 2.0,
        paddingVertical: Sizes.fixPadding + 7.0,
    },
    markingInfoWrapStyle: {
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginTop: Sizes.fixPadding * 3.0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    radioButtonStyle: {
        width: 20.0,
        height: 20.0,
        borderRadius: 10.0,
        borderColor: Colors.lightGrayColor,
        borderWidth: 1.0,
    }
})