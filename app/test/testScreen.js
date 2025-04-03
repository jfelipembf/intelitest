import { StyleSheet, Text, View, ImageBackground, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors, Fonts, Sizes } from '../../constants/styles'
import { MaterialIcons } from '@expo/vector-icons';
import MyStatusBar from '../../components/myStatusBar';
import { useNavigation } from 'expo-router';

const runningTestsList = [
    {
        id: '1',
        subject: 'Economics Weekly Test',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Porta elementum elementum nisl sagittis. Mauris commodo, netus mauris eu nullam phasellus ipsum sapien.',
        questionsCount: 20,
        totalMinutes: 30,
    },
];

const oldTestList = [
    {
        id: '1',
        subject: 'English Test',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Porta elementum elementum nisl sagittis. Mauris commodo, netus mauris eu nullam phasellus ipsum sapien.',
        totalQuestions: 30,
        correctAnswers: 12,
        rank: 26,
        arrangeDate: '9 Dec 2020',
    },
    {
        id: '2',
        subject: 'Economics Test',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Porta elementum elementum nisl sagittis. Mauris commodo, netus mauris eu nullam phasellus ipsum sapien.',
        totalQuestions: 50,
        correctAnswers: 45,
        rank: 5,
        arrangeDate: '15 Dec 2020',
    },
    {
        id: '3',
        subject: 'English Test',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Porta elementum elementum nisl sagittis. Mauris commodo, netus mauris eu nullam phasellus ipsum sapien.',
        totalQuestions: 50,
        correctAnswers: 45,
        rank: 3,
        arrangeDate: '20 Dec 2020',
    },
];

const TestScreen = () => {

    const navigation = useNavigation();

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
                    <FlatList
                        ListHeaderComponent={
                            <>
                                {runningTestInfo()}
                                {oldTestsInfo()}
                            </>
                        }
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingTop: Sizes.fixPadding * 2.0, }}
                    />
                </View>
            </ImageBackground>
        </View>
    )

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
                        {item.correctAnswers}/{item.totalQuestions} Correct • Rank #{item.rank}
                    </Text>
                    <Text style={{ ...Fonts.blackColor14Medium }}>
                        {item.arrangeDate}
                    </Text>
                </View>
            </View >
        )
        return (
            <View>
                <FlatList
                    listKey='old'
                    data={oldTestList}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={renderItem}
                    scrollEnabled={false}
                />
            </View>
        )
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
                                {item.questionsCount} Questions • {item.totalMinutes} mins
                            </Text>
                        </View>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => { navigation.push('testStart/testStartScreen') }}
                            style={styles.continueButtonStyle}
                        >
                            <Text style={{ ...Fonts.whiteColor16Bold }}>
                                Continue
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
        return (
            <View>
                <FlatList
                    listKey='running'
                    data={runningTestsList}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={renderItem}
                    scrollEnabled={false}
                />
            </View>
        )
    }

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <MaterialIcons name="arrow-back" size={24} color={Colors.whiteColor} onPress={() => { navigation.pop() }} />
                <Text style={{ marginLeft: Sizes.fixPadding * 2.0, ...Fonts.whiteColor18SemiBold }}>
                    Test
                </Text>
            </View>
        )
    }
}

export default TestScreen

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
})