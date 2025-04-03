import { StyleSheet, Text, View, ScrollView, Dimensions, Image, ImageBackground } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Colors, Fonts, Sizes } from '../../constants/styles'
import { MaterialIcons } from '@expo/vector-icons';
import BottomSheet from 'react-native-simple-bottom-sheet';
import MyStatusBar from '../../components/myStatusBar';
import { useNavigation } from 'expo-router';

const { width, height } = Dimensions.get('screen');

const allParticipateUsersList = [
    {
        id: '1',
        userImage: require('../../assets/images/students/student2.png'),
        userName: 'Robert Fox',
        userPercentage: 98.70,
    },
    {
        id: '2',
        userImage: require('../../assets/images/students/student3.png'),
        userName: 'Jenny Wilson',
        userPercentage: 96.50,
    },
    {
        id: '3',
        userImage: require('../../assets/images/students/student1.png'),
        userName: 'Samantha Smith',
        userPercentage: 95.00,
        isYou: true,
    },
    {
        id: '4',
        userImage: require('../../assets/images/students/student4.png'),
        userName: 'Jane Cooper',
        userPercentage: 93.50,
    },
    {
        id: '5',
        userImage: require('../../assets/images/students/student5.png'),
        userName: 'Wade Warren',
        userPercentage: 93.00,
    },
    {
        id: '6',
        userImage: require('../../assets/images/students/student6.png'),
        userName: 'Esther Howard',
        userPercentage: 91.80,
    },
    {
        id: '7',
        userImage: require('../../assets/images/students/student7.png'),
        userName: 'Cameron Williamson',
        userPercentage: 90.50,
    },
    {
        id: '8',
        userImage: require('../../assets/images/students/student8.png'),
        userName: 'Brooklyn Simmons',
        userPercentage: 90.45,
    },
    {
        id: '9',
        userImage: require('../../assets/images/students/student9.png'),
        userName: 'Leslie Alexander',
        userPercentage: 89.40,
    },
    {
        id: '10',
        userImage: require('../../assets/images/students/student10.png'),
        userName: 'Guy Hawkins',
        userPercentage: 88.00,
    },
    {
        id: '11',
        userImage: require('../../assets/images/students/student11.png'),
        userName: 'Jacob Jones',
        userPercentage: 86.75,
    },
    {
        id: '12',
        userImage: require('../../assets/images/students/student12.png'),
        userName: 'Kristin Watson',
        userPercentage: 84.96,
    },
    {
        id: '13',
        userImage: require('../../assets/images/students/student13.png'),
        userName: 'Albert Flores',
        userPercentage: 82.12,
    },
];

const LeaderBoardScreen = () => {

    const navigation = useNavigation();

    const [scroll, setScroll] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setScroll(false)
        }, 500);
        return () => {
            clearTimeout()
        }
    }, [])

    return (
        <View style={{ flex: 1, backgroundColor: Colors.primaryColor }}>
            <MyStatusBar />
            <ImageBackground
                source={require('../../assets/images/bgImage.png')}
                style={{ width: '100%', height: 290, flex: 1, }}
                resizeMode="stretch"
                tintColor={Colors.whiteColor}
            >
                {header()}
                {rankerInfo()}
                {allStudents()}
            </ImageBackground>
        </View>
    )

    function allStudents() {
        return (
            <BottomSheet
                isOpen={false}
                sliderMinHeight={height - 350}
                sliderMaxHeight={height / 1.25}
            >
                {(onScrollEndDrag) => (
                    <ScrollView onScrollEndDrag={onScrollEndDrag} showsVerticalScrollIndicator={false}>
                        {allParticipateUsersList.map((item, index) => (
                            <View
                                key={`${item.id}`}
                                style={{
                                    borderColor: item.isYou ? Colors.secondaryColor : Colors.lightGrayColor,
                                    borderWidth: item.isYou ? 1.3 : 1.0,
                                    ...styles.userRankingWrapStyle,
                                }}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, }}>
                                    <Text style={{ ...Fonts.blackColor15Medium, color: item.isYou ? Colors.secondaryColor : Colors.blackColor }}>
                                        {index + 1}.
                                    </Text>
                                    <Image
                                        source={item.userImage}
                                        style={styles.userImageStyle}
                                    />
                                    <Text numberOfLines={1} style={{ flex: 1, ...Fonts.blackColor15Medium, color: item.isYou ? Colors.secondaryColor : Colors.blackColor }}>
                                        {item.isYou ? 'You' : item.userName}
                                    </Text>
                                </View>
                                <Text style={{ ...Fonts.blackColor15Medium, marginLeft: Sizes.fixPadding - 5.0, color: item.isYou ? Colors.secondaryColor : Colors.blackColor }}>
                                    {item.userPercentage.toFixed(2)}%
                                </Text>
                            </View>
                        ))}
                    </ScrollView>
                )}
            </BottomSheet>
        )
    }

    function rankerInfo() {
        return (
            <View style={styles.rankerInfoWrapStyle}>
                {rankerSort({
                    width: (width / 5.5),
                    smallWidth: (width / 17.0),
                    userImage: allParticipateUsersList[1].userImage,
                    userName: allParticipateUsersList[1].userName,
                    userPercentage: allParticipateUsersList[1].userPercentage,
                    number: 2,
                })}
                {rankerSort({
                    width: (width / 3.5),
                    smallWidth: (width / 14.0),
                    userImage: allParticipateUsersList[0].userImage,
                    userName: allParticipateUsersList[0].userName,
                    userPercentage: allParticipateUsersList[0].userPercentage,
                    number: 1,
                })}
                {rankerSort({
                    width: (width / 5.5),
                    smallWidth: (width / 17.0),
                    userImage: allParticipateUsersList[2].userImage,
                    userName: allParticipateUsersList[2].userName,
                    userPercentage: allParticipateUsersList[2].userPercentage,
                    number: 3,
                })}
            </View>
        )
    }

    function rankerSort({ width, smallWidth, userImage, userName, userPercentage, number }) {
        return (
            <View style={{ alignItems: 'center', flex: 1, marginHorizontal: number == 1 ? Sizes.fixPadding - 5.0 : 0.0 }}>
                <View style={{ width: width, height: width, borderRadius: width / 2.0, ...styles.imageShadowStyle }}>
                    <Image
                        source={userImage}
                        style={{ borderRadius: width / 2.0, ...styles.rankerUserImageStyle, }}
                    />
                    <View style={{ width: smallWidth, height: smallWidth, borderRadius: smallWidth / 2.0, ...styles.rankingWrapStyle, }}>
                        <Text style={{ ...Fonts.whiteColor12ExtraBold, fontSize: number == 1 ? 13 : 12 }}>
                            {number}
                        </Text>
                    </View>
                </View>
                <Text numberOfLines={1} style={{ marginTop: Sizes.fixPadding, ...Fonts.whiteColor14Medium }}>
                    {userName}
                </Text>
                <Text numberOfLines={1} style={{ ...Fonts.whiteColor13SemiBold }}>
                    {userPercentage.toFixed(2)}%
                </Text>
            </View>
        )
    }

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <MaterialIcons name="arrow-back" size={24} color={Colors.whiteColor} onPress={() => { navigation.pop() }} />
                <Text style={{ marginLeft: Sizes.fixPadding * 2.0, ...Fonts.whiteColor18SemiBold }}>
                    Leaderboard
                </Text>
            </View>
        )
    }
}

export default LeaderBoardScreen

const styles = StyleSheet.create({
    headerWrapStyle: {
        marginVertical: Sizes.fixPadding * 3.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
        flexDirection: 'row',
        alignItems: 'center'
    },
    imageShadowStyle: {
        backgroundColor: '#FFFFFF10',
        alignItems: 'center',
        padding: Sizes.fixPadding - 5.0,
    },
    rankerUserImageStyle: {
        width: '100%',
        height: '100%',
        borderColor: Colors.whiteColor,
        borderWidth: 1.5,
    },
    rankingWrapStyle: {
        backgroundColor: Colors.secondaryColor,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0.0,
        elevation: 5.0,
    },
    rankerInfoWrapStyle: {
        marginBottom: Sizes.fixPadding * 2.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
        flexDirection: 'row',
        alignItems: 'center',
    },
    userRankingWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding + 5.0,
        padding: Sizes.fixPadding + 5.0,
    },
    userImageStyle: {
        width: 45.0,
        height: 45.0,
        borderRadius: 23.5,
        marginHorizontal: Sizes.fixPadding * 2.0,
    }
})