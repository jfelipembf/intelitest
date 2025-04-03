import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, Image, FlatList } from 'react-native'
import React from 'react'
import { Colors, Fonts, Sizes } from '../../constants/styles'
import { MaterialIcons } from '@expo/vector-icons';
import MyStatusBar from '../../components/myStatusBar';
import { useNavigation } from 'expo-router';

const facultiesList = [
    {
        id: '1',
        facultyName: 'Leslie Alexander',
        lastMessage: 'Lorem ipsum dolor sit amet, consectetur...',
        lastMessageTime: '2 min ago',
        facultyImage: require('../../assets/images/faculties/faculty1.png')
    },
    {
        id: '2',
        facultyName: 'Brooklyn Simmons',
        lastMessage: 'Lorem ipsum dolor sit amet, consectetur...',
        lastMessageTime: '5 min ago',
        facultyImage: require('../../assets/images/faculties/faculty2.png')
    },
    {
        id: '3',
        facultyName: 'Jacob Jones',
        lastMessage: 'Lorem ipsum dolor sit amet, consectetur...',
        lastMessageTime: '20 min ago',
        facultyImage: require('../../assets/images/faculties/faculty3.png')
    },
    {
        id: '4',
        facultyName: 'Wade Warren',
        lastMessage: 'Lorem ipsum dolor sit amet, consectetur...',
        lastMessageTime: '1 h ago',
        facultyImage: require('../../assets/images/faculties/faculty4.png')
    },
    {
        id: '5',
        facultyName: 'Marvin McKinney',
        lastMessage: 'Lorem ipsum dolor sit amet, consectetur...',
        lastMessageTime: '2 dyas ago',
        facultyImage: require('../../assets/images/faculties/faculty5.png')
    },
    {
        id: '6',
        facultyName: 'Bessie Cooper',
        lastMessage: 'Lorem ipsum dolor sit amet, consectetur...',
        lastMessageTime: '2 dyas ago',
        facultyImage: require('../../assets/images/faculties/faculty6.png')
    },
    {
        id: '7',
        facultyName: 'Devon Lane',
        lastMessage: 'Lorem ipsum dolor sit amet, consectetur...',
        lastMessageTime: '3 dyas ago',
        facultyImage: require('../../assets/images/faculties/faculty7.png')
    },
    {
        id: '8',
        facultyName: 'Eleanor Pena',
        lastMessage: 'Lorem ipsum dolor sit amet, consectetur...',
        lastMessageTime: '3 dyas ago',
        facultyImage: require('../../assets/images/faculties/faculty8.png')
    },
    {
        id: '9',
        facultyName: 'Arlene McCoy',
        lastMessage: 'Lorem ipsum dolor sit amet, consectetur...',
        lastMessageTime: '4 dyas ago',
        facultyImage: require('../../assets/images/faculties/faculty9.png')
    },
    {
        id: '10',
        facultyName: 'Kathryn Murphy',
        lastMessage: 'Lorem ipsum dolor sit amet, consectetur...',
        lastMessageTime: '4 dyas ago',
        facultyImage: require('../../assets/images/faculties/faculty10.png')
    },
    {
        id: '11',
        facultyName: 'Theresa Webb',
        lastMessage: 'Lorem ipsum dolor sit amet, consectetur...',
        lastMessageTime: '4 dyas ago',
        facultyImage: require('../../assets/images/faculties/faculty11.png')
    },
    {
        id: '12',
        facultyName: 'Jerome Bell',
        lastMessage: 'Lorem ipsum dolor sit amet, consectetur...',
        lastMessageTime: '4 dyas ago',
        facultyImage: require('../../assets/images/faculties/faculty12.png')
    },
];

const MessagesScreen = () => {

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
                    {faculties()}
                </View>
            </ImageBackground>
        </View>
    )

    function faculties() {
        const renderItem = ({ item, index }) => (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, }}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => { navigation.push('chatWithFaculty/chatWithFacultyScreen') }}
                    style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
                >
                    <Image
                        source={item.facultyImage}
                        style={{ width: 50.0, height: 50.0, borderRadius: 25.0, }}
                    />
                    <View style={{ flex: 1, marginHorizontal: Sizes.fixPadding + 2.0 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text numberOfLines={1} style={{ flex: 1, ...Fonts.blackColor15Medium }}>
                                {item.facultyName}
                            </Text>
                            <Text style={{ ...Fonts.grayColor11Medium }}>
                                {item.lastMessageTime}
                            </Text>
                        </View>
                        <Text numberOfLines={1} style={{ marginTop: Sizes.fixPadding - 8.0, ...Fonts.blackColor13Regular }}>
                            {item.lastMessage}
                        </Text>
                    </View>
                </TouchableOpacity>
                {
                    index == facultiesList.length - 1
                        ?
                        null
                        :
                        <View style={{ backgroundColor: Colors.lightGrayColor, height: 1.0, marginVertical: Sizes.fixPadding * 2.0 }} />
                }
            </View>
        )
        return (
            <FlatList
                data={facultiesList}
                keyExtractor={(item) => `${item.id}`}
                renderItem={renderItem}
                contentContainerStyle={{ paddingVertical: Sizes.fixPadding * 2.0, }}
                showsVerticalScrollIndicator={false}
            />
        )
    }

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <MaterialIcons name="arrow-back" size={24} color={Colors.whiteColor} onPress={() => { navigation.pop() }} />
                <Text style={{ marginLeft: Sizes.fixPadding * 2.0, ...Fonts.whiteColor18SemiBold }}>
                    Messages
                </Text>
            </View>
        )
    }
}

export default MessagesScreen

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
})