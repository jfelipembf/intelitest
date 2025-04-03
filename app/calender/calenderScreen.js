import { StyleSheet, Text, View, Dimensions, ScrollView, ImageBackground } from 'react-native'
import React, { useState } from 'react'
import { Colors, Fonts, Sizes } from '../../constants/styles'
import { MaterialIcons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import MyStatusBar from '../../components/myStatusBar';
import { useNavigation } from 'expo-router';

const { width } = Dimensions.get('window');

const markedDates = [
    {
        '2025-01-24': {
            selected: true,
            selectedColor: Colors.secondaryColor,
            accessibilityLabel: [{
                title: 'Mathematics Weekly Test',
                subTitles: ['Sets and Functions', 'Algebra'],
                date: '24 Jan 2025'
            }]
        },
    },
    {
        '2025-02-14': {
            selected: true,
            selectedColor: Colors.secondaryColor,
            accessibilityLabel: [{
                title: 'Account Weekly Test',
                subTitles: ['Sets and Functions', 'Algebra'],
                date: '14 Feb 2025'
            }]
        },
    },
    {
        '2025-03-19': {
            selected: true,
            selectedColor: Colors.secondaryColor,
            accessibilityLabel: [{
                title: 'English Weekly Test',
                subTitles: ['Sets and Functions', 'Algebra'],
                date: '19 Mar 2025'
            }]
        },
    },
    {
        '2025-04-16': {
            selected: true,
            selectedColor: Colors.secondaryColor,
            accessibilityLabel: [{
                title: 'Eco Weekly Test',
                subTitles: ['Sets and Functions', 'Algebra'],
                date: '16 Apr 2025'
            }]
        },
    },
    {
        '2025-05-12': {
            selected: true,
            selectedColor: Colors.secondaryColor,
            accessibilityLabel: [{
                title: 'Maths Weekly Test',
                subTitles: ['Sets and Functions', 'Algebra'],
                date: '12 May 2025'
            }]
        },
    },
    {
        '2025-06-28': {
            selected: true,
            selectedColor: Colors.secondaryColor,
            accessibilityLabel: [{
                title: 'Parents Meeting',
                subTitles: ['Compulsory to Come'],
                date: '25 Mar 2025'
            }]
        },
    },
    {
        '2025-07-05': {
            selected: true,
            selectedColor: Colors.darkGreenColor,
            accessibilityLabel: [{
                title: 'Ambedkar Jayanti',
                subTitles: ['Public Holiday'],
                date: '02 Oct 2025',
            }]
        },
        '2025-07-25': {
            selected: true,
            selectedColor: Colors.redColor,
            accessibilityLabel: [{
                title: 'Computer Weekly Test',
                subTitles: ['Sets and Functions'],
                date: '25 Oct 2025',
            }]
        },
    },
    {
        '2025-08-21': {
            selected: true,
            selectedColor: Colors.redColor,
            accessibilityLabel: [{
                title: 'Mathematics Weekly Test',
                subTitles: ['Sets and Functions', 'Algebra'],
                date: '21 Nov 2025'
            }]
        },
    },
    {
        '2025-09-21': {
            selected: true,
            selectedColor: Colors.redColor,
            accessibilityLabel: [{
                title: 'Mathematics Weekly Test',
                subTitles: ['Sets and Functions', 'Algebra'],
                date: '21 Nov 2025'
            }]
        },
    },
    {
        '2025-10-02': {
            selected: true,
            selectedColor: Colors.darkGreenColor,
            accessibilityLabel: [{
                title: 'Gandhi Jayanti',
                subTitles: ['Public Holiday'],
                date: '02 Oct 2025',
            }]
        },
        '2025-10-25': {
            selected: true,
            selectedColor: Colors.redColor,
            accessibilityLabel: [{
                title: 'Computer Weekly Test',
                subTitles: ['Sets and Functions'],
                date: '25 Oct 2025',
            }]
        },
    },
    {
        '2025-11-21': {
            selected: true,
            selectedColor: Colors.redColor,
            accessibilityLabel: [{
                title: 'Mathematics Weekly Test',
                subTitles: ['Sets and Functions', 'Algebra'],
                date: '21 Nov 2025'
            }]
        },
        '2025-11-30': {
            selected: true,
            selectedColor: Colors.secondaryColor,
            accessibilityLabel: [{
                title: 'Parents Meeting',
                subTitles: ['Compulsory to Come'],
                date: '31 Nov 2025'
            }]
        },
    },
    {
        '2025-12-24': {
            selected: true,
            selectedColor: Colors.secondaryColor,
            accessibilityLabel: [{
                title: 'Christmas Party',
                subTitles: ['Chirstmas Celebration'],
                date: '24 Des 2025'
            }]
        },
        '2025-12-25': {
            selected: true,
            selectedColor: Colors.darkGreenColor,
            accessibilityLabel: [{
                title: 'Public Holiday',
                subTitles: ['Chirstmas Day'],
                date: '25 Des 2025'
            }]
        },
        '2025-12-31': {
            selected: true,
            selectedColor: Colors.secondaryColor,
            accessibilityLabel: [{
                title: '31 Party',
                subTitles: ['31 party'],
                date: '31 Des 2025'
            }]
        },
    },
    {
        '2026-01-01': {
            selected: true,
            selectedColor: Colors.secondaryColor,
            accessibilityLabel: [{
                title: 'New Year Celebration',
                subTitles: ['New Year Party'],
                date: '01 Jan 2026'
            }]
        },
        '2026-01-11': {
            selected: true,
            selectedColor: Colors.redColor,
            accessibilityLabel: [{
                title: 'Accountancy Weekly Test',
                subTitles: ['Financial Management', 'Business Ethics'],
                date: '11 Jan 2026'
            }]
        },
        '2026-01-14': {
            selected: true,
            selectedColor: Colors.darkGreenColor,
            accessibilityLabel: [{
                title: 'Public Holiday ',
                subTitles: ['International Kite Festival'],
                date: '14 Jan 2026'
            }]
        },
        '2026-01-26': {
            selected: true,
            selectedColor: Colors.darkGreenColor,
            accessibilityLabel: [{
                title: 'Public Holiday',
                subTitles: ['Republic Day Celebration'],
                date: '26 Jan 2026'
            }]
        },
    },
    {
        '2026-02-10': {
            selected: true,
            selectedColor: Colors.secondaryColor,
            accessibilityLabel: [{
                title: 'Parents Meeting',
                subTitles: ['Compulsory to Come'],
                date: '10 Feb 2026'
            }]
        },
        '2026-02-21': {
            selected: true,
            selectedColor: Colors.redColor,
            accessibilityLabel: [{
                title: 'Economics Weekly Test',
                subTitles: ['Statistics for Economics'],
                date: '21 Feb 2026'
            }]
        },
    },
    {
        '2026-03-23': {
            selected: true,
            selectedColor: Colors.redColor,
            accessibilityLabel: [{
                title: 'English Weekly Test',
                subTitles: ['Short Note'],
                date: '23 Mar 2026'
            }]
        },
        '2026-03-25': {
            selected: true,
            selectedColor: Colors.secondaryColor,
            accessibilityLabel: [{
                title: 'Parents Meeting',
                subTitles: ['Compulsory to Come'],
                date: '25 Mar 2026'
            }]
        },
    },
    {
        '2026-04-22': {
            selected: true,
            selectedColor: Colors.redColor,
            accessibilityLabel: [{
                title: 'English Weekly Test',
                subTitles: ['Short Note'],
                date: '23 Mar 2026'
            }]
        },
        '2026-04-25': {
            selected: true,
            selectedColor: Colors.secondaryColor,
            accessibilityLabel: [{
                title: 'Parents Meeting',
                subTitles: ['Compulsory to Come'],
                date: '25 Mar 2026'
            }]
        },
    },
    {
        '2026-05-25': {
            selected: true,
            selectedColor: Colors.secondaryColor,
            accessibilityLabel: [{
                title: 'Parents Meeting',
                subTitles: ['Compulsory to Come'],
                date: '25 Mar 2026'
            }]
        },
    },
];

const CalenderScreen = () => {

    const navigation = useNavigation();

    const [state, setState] = useState({
        currentDataIndex: getCurrentMonthIndex(),
    })

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    const { currentDataIndex, } = state;

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
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {calenderView()}
                        {eventsIndicators()}
                        {eventsInfo()}
                    </ScrollView>
                </View>
            </ImageBackground>
        </View>
    )

    function eventsIndicators() {
        return (
            <View style={styles.allIndicatorsWrapStyle}>
                {indicatorSort({ color: Colors.redColor, type: 'Test' })}
                {indicatorSort({ color: Colors.darkGreenColor, type: 'Holiday' })}
                {indicatorSort({ color: Colors.secondaryColor, type: 'Event' })}
            </View>
        )
    }

    function indicatorSort({ color, type }) {
        return (
            <View style={styles.indicatorWrapStyle}>
                <View style={{ ...styles.indicatorStyle, backgroundColor: color }} />
                <Text numberOfLines={1} style={{ flex: 1, marginLeft: Sizes.fixPadding, ...Fonts.blackColor13Medium }}>
                    {type}
                </Text>
            </View>
        )
    }

    function eventsInfo() {
        return (
            <View>
                {
                    (currentDataIndex >= 0) && (currentDataIndex <= markedDates.length - 1)
                        ?
                        Object.values(markedDates[currentDataIndex]).map((item, index) => (
                            <View
                                key={`${index}`}
                                style={{ borderColor: item.selectedColor, ...styles.eventWrapStyle, }}
                            >
                                <View style={{ backgroundColor: item.selectedColor, ...styles.eventHeaderWrapStyle, }}>
                                    <Text style={{ flex: 1, ...Fonts.whiteColor14Medium }}>
                                        {item.selectedColor == Colors.redColor
                                            ?
                                            `Test`
                                            :
                                            item.selectedColor == Colors.darkGreenColor
                                                ?
                                                'Holiday'
                                                :
                                                'Event'
                                        }
                                    </Text>
                                    <Text style={{ ...Fonts.whiteColor14Medium }}>
                                        {item.accessibilityLabel[0].date}
                                    </Text>
                                </View>
                                <View style={{ padding: Sizes.fixPadding + 5.0, }}>

                                    <Text style={{ ...Fonts.blackColor15Medium }}>
                                        {item.accessibilityLabel[0].title}
                                    </Text>
                                    {
                                        item.accessibilityLabel[0].subTitles.map((innerItem, innerIndex) => (
                                            <Text
                                                key={`${innerIndex}`}
                                                style={{ ...Fonts.grayColor13Regular, marginHorizontal: Sizes.fixPadding + 3.0, marginTop: Sizes.fixPadding - 5.0, }}
                                            >
                                                • {innerItem}
                                            </Text>
                                        ))
                                    }
                                </View>
                            </View>
                        ))
                        :
                        null
                }
            </View>
        )
    }

    function getCurrentMonthIndex() {
        var currentMonth = ((new Date().getMonth() + 1).toString().length == 1) ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1
        var currentYearWithMonth = `${new Date().getFullYear()}-${currentMonth}`
        const index = markedDates.findIndex(item => {
            if (item && JSON.stringify(item).slice(2, 9) === currentYearWithMonth) {
                return true;
            }
            return false;
        });
        return index >= 0 ? index : -1
    }

    function calenderView() {
        var markedDays = (currentDataIndex >= 0) && (currentDataIndex <= markedDates.length - 1)
            ?
            markedDates[currentDataIndex]
            :
            {};
        return (
            <View style={{ margin: Sizes.fixPadding * 2.0, }}>
                <Calendar
                    hideExtraDays={true}
                    disableMonthChange={true}
                    firstDay={0}
                    markedDates={markedDays}
                    renderHeader={date => {
                        return (
                            <Text style={{ ...Fonts.blackColor18Medium, }}>
                                {date.toString().slice(4, 8)} {date.toString().slice(11, 16)}
                            </Text>
                        )
                    }}
                    theme={{
                        textDayFontSize: 15,
                        textDayHeaderFontSize: 14,
                        textDayFontFamily: 'Inter_Regular',
                        textDayHeaderFontFamily: 'Inter_Regular',
                        arrowColor: Colors.blackColor,
                        calendarBackground: 'transparent',
                        textSectionTitleColor: Colors.blackColor,
                        selectedDayBackgroundColor: Colors.primaryColor,
                    }}
                    onMonthChange={month => {
                        const index = markedDates.findIndex(item => {
                            if (item && JSON.stringify(item).slice(2, 9) === month.dateString.slice(0, 7)) {
                                return true;
                            }
                            return false;
                        });
                        updateState({ currentDataIndex: index })
                    }}
                    enableSwipeMonths={true}
                />
            </View>
        )
    }

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <MaterialIcons name="arrow-back" size={24} color={Colors.whiteColor} onPress={() => { navigation.pop() }} />
                <Text style={{ marginLeft: Sizes.fixPadding * 2.0, ...Fonts.whiteColor18SemiBold }}>
                    Calendar
                </Text>
            </View>
        )
    }
}

export default CalenderScreen

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
    indicatorWrapStyle: {
        maxWidth: width / 3.7,
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding - 5.0,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2.0,
        marginBottom: Sizes.fixPadding * 2.0,
        paddingVertical: Sizes.fixPadding - 5.0,
        paddingHorizontal: Sizes.fixPadding + 5.0,
        shadowColor: Colors.blackColor,
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 0 }
    },
    indicatorStyle: {
        width: 8.0,
        height: 8.0,
        borderRadius: 4.0,
    },
    allIndicatorsWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: Sizes.fixPadding * 2.0,
    },
    eventHeaderWrapStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopLeftRadius: Sizes.fixPadding - 1,
        borderTopRightRadius: Sizes.fixPadding - 1,
        padding: Sizes.fixPadding + 3.0
    },
    eventWrapStyle: {
        borderWidth: 1.0,
        borderRadius: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding * 2.0,
    }
})