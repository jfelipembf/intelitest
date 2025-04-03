import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ScrollView, ImageBackground } from 'react-native'
import React, { useState } from 'react'
import { Colors, Fonts, Sizes } from '../../constants/styles'
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { LineChart, } from "react-native-chart-kit"
import * as Progress from 'react-native-progress';
import { Menu } from 'react-native-material-menu';
import MyStatusBar from '../../components/myStatusBar';
import { useNavigation } from 'expo-router';

const { width } = Dimensions.get('window');

const subjectWiseProgressList = [
    {
        id: '1',
        subject: 'Mathematics',
        fillColor: Colors.purpleColor,
        unfilledColor: Colors.lightPurpleColor,
        progress: 85.50,
    },
    {
        id: '2',
        subject: 'Science',
        fillColor: Colors.secondaryColor,
        unfilledColor: Colors.lightSecondaryColor,
        progress: 50.50,
    },
    {
        id: '3',
        subject: 'English',
        fillColor: Colors.greenColor,
        unfilledColor: Colors.lightGreenColor,
        progress: 89.50,
    },
    {
        id: '4',
        subject: 'Economic',
        fillColor: Colors.cyanColor,
        unfilledColor: Colors.lightCyanColor,
        progress: 95.12,
    },
    {
        id: '5',
        subject: 'Accounting',
        fillColor: Colors.purpleColor,
        unfilledColor: Colors.lightPurpleColor,
        progress: 89.50,
    },
    {
        id: '6',
        subject: 'Computer',
        fillColor: Colors.creamColor,
        unfilledColor: Colors.lightCreamColor,
        progress: 96.25,
    },
];

const monthsList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const ProgressCardScreen = () => {

    const navigation = useNavigation();

    const [showMonths, setShowMonths] = useState(false);
    const [selectedMonthIndex, setSelectedMonthIndex] = useState(11);

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
                        {studentNameAndPracticeText()}
                        {overallRankAndLastTestRank()}
                        {monthlyPerformanceChart()}
                        {subjectWiseProgressInfo()}
                    </ScrollView>
                </View>
            </ImageBackground>
        </View>
    )

    function subjectWiseProgressInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, }}>
                <Text style={{ marginBottom: Sizes.fixPadding * 2.0, ...Fonts.blackColor16Medium }}>
                    Subject Wise Progress
                </Text>
                {
                    subjectWiseProgressList.map((item) => (
                        <View
                            key={`${item.id}`}
                            style={styles.progressInfoWrapStyle}
                        >
                            <Text numberOfLines={1} style={{ width: 94.0, ...Fonts.grayColor15Medium }}>
                                {item.subject}
                            </Text>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ flex: 1, marginHorizontal: Sizes.fixPadding, }}>
                                    <Progress.Bar
                                        progress={item.progress / 100}
                                        width={null}
                                        unfilledColor={item.unfilledColor}
                                        color={item.fillColor}
                                        height={12}
                                        borderRadius={6}
                                        borderWidth={0}
                                    />
                                </View>
                                <Text style={{ ...Fonts.blackColor14Medium, color: item.fillColor }}>
                                    {item.progress.toFixed(2)}%
                                </Text>
                            </View>
                        </View>
                    ))
                }
            </View>
        )
    }

    function* yLabel() {
        yield* ['A', 'B', 'C', 'D', 'E', 'F'];
    }

    function monthlyPerformanceChart() {
        const yLabelIterator = yLabel();
        const chartConfig = {
            backgroundColor: Colors.whiteColor,
            backgroundGradientFrom: Colors.whiteColor,
            backgroundGradientTo: Colors.whiteColor,
            fillShadowGradientFromOpacity: 0.2,
            fillShadowGradientToOpacity: 0.2,
            color: (opacity = 1) => Colors.secondaryColor,
            labelColor: (opacity = 1) => Colors.blackColor,
            barPercentage: 0.5,
            propsForDots: {
                r: "4",
                strokeWidth: "1",
                stroke: Colors.secondaryColor
            },
            decimalPlaces: 0,
        };
        return (
            <View style={{ margin: Sizes.fixPadding * 2.0, }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ flex: 1, ...Fonts.blackColor16Medium }}>
                        Monthly Performance
                    </Text>
                    <Menu
                        visible={showMonths}
                        anchor={
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => setShowMonths(true)}
                                style={{ flexDirection: 'row', alignItems: 'center' }}
                            >
                                <Text style={{ ...Fonts.primaryColor14Medium, marginRight: Sizes.fixPadding - 5.0, }}>
                                    {monthsList[selectedMonthIndex]}
                                </Text>
                                <Feather name="chevron-down" size={24} color={Colors.primaryColor} />
                            </TouchableOpacity>
                        }
                        onRequestClose={() => setShowMonths(false)}
                    >
                        <View style={{ marginHorizontal: Sizes.fixPadding * 3.0, marginVertical: Sizes.fixPadding }}>
                            {
                                monthsList.map((item, index) => (
                                    <Text
                                        key={`${index}`}
                                        onPress={() => { setSelectedMonthIndex(index), setShowMonths(false) }}
                                        style={{ ...Fonts.primaryColor14Medium, marginVertical: Sizes.fixPadding, }}
                                    >
                                        {item}
                                    </Text>
                                ))
                            }
                        </View>
                    </Menu>
                </View>
                <View style={{ overflow: 'hidden' }}>
                    <LineChart
                        data={{
                            labels: ["1-7", "7-14", "14-21", "21-28", "28-3",],
                            datasets: [{ data: [1, 5, 2, 4, 2,] }],
                        }}
                        formatYLabel={(yLabel) => `${Number(yLabel) + 1} Rank ${yLabelIterator.next().value}`}
                        width={width}
                        height={230}
                        fromZero
                        fromNumber={15}
                        withInnerLines={false}
                        chartConfig={chartConfig}
                        bezier
                        style={{ marginTop: Sizes.fixPadding * 2.0, }}
                    />
                </View>
            </View>
        )
    }

    function overallRankAndLastTestRank() {
        return (
            <View style={{ flexDirection: 'row', marginHorizontal: Sizes.fixPadding + 5.0, }}>
                <View style={styles.boxStyle}>
                    <Text style={{ ...Fonts.blackColor34BebasRegular }}>
                        05
                    </Text>
                    <Text numberOfLines={1} style={{ marginTop: Sizes.fixPadding - 5.0, ...Fonts.grayColor16Medium }}>
                        Overall Rank
                    </Text>
                </View>
                <View style={styles.boxStyle}>
                    <Text style={{ ...Fonts.blackColor34BebasRegular }}>
                        03
                    </Text>
                    <Text numberOfLines={1} style={{ marginTop: Sizes.fixPadding - 5.0, ...Fonts.grayColor16Medium }}>
                        Last Test Rank
                    </Text>
                </View>
            </View>
        )
    }

    function studentNameAndPracticeText() {
        return (
            <View style={{ alignItems: 'center', margin: Sizes.fixPadding * 2.0, }}>
                <Text style={{ textAlign: 'center', ...Fonts.blackColor30BebasRegular }}>
                    Samantha Smith
                </Text>
                <Text style={{ marginTop: Sizes.fixPadding - 5.0, textAlign: 'center', ...Fonts.blackColor15Regular }}>
                    You’re good. Some more practice.
                </Text>
            </View>
        )
    }

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <MaterialIcons name="arrow-back" size={24} color={Colors.whiteColor} onPress={() => { navigation.pop() }} />
                <Text style={{ marginLeft: Sizes.fixPadding * 2.0, ...Fonts.whiteColor18SemiBold }}>
                    Progress Card
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
    boxStyle: {
        flex: 1,
        borderColor: Colors.primaryColor,
        borderWidth: 1.0,
        borderRadius: Sizes.fixPadding,
        padding: Sizes.fixPadding * 2.0,
        marginHorizontal: Sizes.fixPadding - 5.0,
    },
    progressInfoWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Sizes.fixPadding * 2.0,
    }
})