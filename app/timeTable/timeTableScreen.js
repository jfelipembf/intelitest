import { StyleSheet, Text, View, ImageBackground, Image, FlatList, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Colors, Fonts, Sizes } from '../../constants/styles'
import { MaterialIcons } from '@expo/vector-icons';
import MyStatusBar from '../../components/myStatusBar';
import { useNavigation } from 'expo-router';

const dummyLectures = [
    {
        id: '1',
        subject: 'Mathematics',
        time: '08:15am - 09:00am',
        teacherName: 'Leslie Alexander',
        periodNo: 1,
    },
    {
        id: '2',
        subject: 'English',
        time: '09:00am - 09:45am',
        teacherName: 'Brooklyn Simmons',
        periodNo: 2,
    },
    {
        id: '3',
        subject: 'Economics',
        time: '09:45am  - 10:30am',
        teacherName: 'Jacob Jones',
        periodNo: 3,
    },
    {
        id: '4',
        lunchTitle: 'Lunch Break',
        time: '10:30am - 11:00am',
    },
    {
        id: '5',
        subject: 'Computer',
        time: '11:00am - 11:45am',
        teacherName: 'Wade Warren',
        periodNo: 4,
    },
    {
        id: '6',
        subject: 'Social Study',
        time: '11:45am - 12:30pm',
        teacherName: 'Marvin McKinney',
        periodNo: 5,
    },
];

const timeTables = [
    {
        id: '1',
        day: 'Mon',
        lectures: dummyLectures,
    },
    {
        id: '2',
        day: 'Tue',
        lectures: dummyLectures,
    },
    {
        id: '3',
        day: 'Wed',
        lectures: dummyLectures,
    },
    {
        id: '4',
        day: 'Thu',
        lectures: dummyLectures,
    },
    {
        id: '5',
        day: 'Fri',
        lectures: dummyLectures,
    },
    {
        id: '6',
        day: 'Sat',
        lectures: dummyLectures,
    },
];

const TimeTableScreen = () => {

    const navigation = useNavigation();

    const [selectedDayIndex, setSelectedDayIndex] = useState(0);

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
                    {days()}
                    {periodsInfo()}
                </View>
            </ImageBackground>
        </View>
    )

    function periodsInfo() {
        const renderItem = ({ item }) => (
            <View style={styles.infoWrapStyle}>
                {
                    item.lunchTitle ?
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ flex: 1, }}>
                                <Text style={{ ...Fonts.blackColor15Medium }}>
                                    {item.lunchTitle}
                                </Text>
                                <Text style={{ ...Fonts.grayColor13Regular }}>
                                    {item.time}
                                </Text>
                            </View>
                            <Image
                                source={require('../../assets/images/icons/lunchBox.png')}
                                style={{ width: 41.0, height: 41.0, resizeMode: 'contain' }}
                            />
                        </View>
                        :
                        <View>
                            <Text style={{ ...Fonts.blackColor15Medium }}>
                                {item.subject}
                            </Text>
                            <Text style={{ marginTop: Sizes.fixPadding - 5.0, ...Fonts.grayColor13Regular }}>
                                {item.time}
                            </Text>
                            {divider()}
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={{ flex: 1, ...Fonts.grayColor14Regular }}>
                                    {item.teacherName}
                                </Text>
                                <Text style={{ ...Fonts.blackColor14Medium }}>
                                    Period {item.periodNo}
                                </Text>
                            </View>
                        </View>
                }
            </View>
        )
        return (
            <FlatList
                data={timeTables[selectedDayIndex].lectures}
                keyExtractor={(item) => `${item.id}`}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
            />
        )
    }

    function divider() {
        return (
            <View style={{ backgroundColor: Colors.lightGrayColor, height: 1.0, marginVertical: Sizes.fixPadding + 5.0, }} />
        )
    }

    function days() {
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
            <View style={{ ...styles.allDaysWrapStyle }}>
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

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <MaterialIcons name="arrow-back" size={24} color={Colors.whiteColor} onPress={() => { navigation.pop() }} />
                <Text style={{ marginLeft: Sizes.fixPadding * 2.0, ...Fonts.whiteColor18SemiBold }}>
                    Time Table
                </Text>
            </View>
        )
    }
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
    }
})