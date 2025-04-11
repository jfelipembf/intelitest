import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity, FlatList, } from 'react-native'
import React, { useState } from 'react'
import { Colors, Fonts, Sizes } from '../../constants/styles'
import { MaterialIcons } from '@expo/vector-icons';
import MyStatusBar from '../../components/myStatusBar';
import { useNavigation } from 'expo-router';

const subjectsList = ['Todos', 'Mat', 'Ciên', 'Port', 'Eco', 'Cont', 'Info'];

const facultiesList = [
    {
        id: '1',
        facultyName: 'Leslie Alexander',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Porta elementum elementum nisl sagittis.',
        subjectsKnown: ['Mat', 'Ciên', 'Eco'],
        facultyImage: require('../../assets/images/faculties/faculty1.png')
    },
    {
        id: '2',
        facultyName: 'Brooklyn Simmons',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Porta elementum elementum nisl sagittis.',
        subjectsKnown: ['Cont', 'Mat', 'Ciên'],
        facultyImage: require('../../assets/images/faculties/faculty2.png')
    },
    {
        id: '3',
        facultyName: 'Jacob Jones',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Porta elementum elementum nisl sagittis.',
        subjectsKnown: ['Port', 'Info'],
        facultyImage: require('../../assets/images/faculties/faculty3.png')
    },
    {
        id: '4',
        facultyName: 'Wade Warren',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Porta elementum elementum nisl sagittis.',
        subjectsKnown: ['Eco', 'Ciên', 'Port'],
        facultyImage: require('../../assets/images/faculties/faculty4.png')
    },
    {
        id: '5',
        facultyName: 'Marvin McKinney',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Porta elementum elementum nisl sagittis.',
        subjectsKnown: ['Mat', 'Cont'],
        facultyImage: require('../../assets/images/faculties/faculty5.png')
    },
    {
        id: '6',
        facultyName: 'Bessie Cooper',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Porta elementum elementum nisl sagittis.',
        subjectsKnown: ['Ciên', 'Port'],
        facultyImage: require('../../assets/images/faculties/faculty6.png')
    },
    {
        id: '7',
        facultyName: 'Devon Lane',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Porta elementum elementum nisl sagittis.',
        subjectsKnown: ['Mat', 'Eco'],
        facultyImage: require('../../assets/images/faculties/faculty7.png')
    },
];

const FacultiesScreen = () => {

    const navigation = useNavigation();

    const [selectedSubjectIndex, setSelectedSubjectIndex] = useState(0);

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
                    {subjects()}
                    {facultiesInfo()}
                </View>
            </ImageBackground>
        </View>
    )

    function facultiesInfo() {
        const displayFaculties = facultiesList.filter((item) => item.subjectsKnown.includes(subjectsList[selectedSubjectIndex]));
        const renderItem = ({ item }) => (
            <View style={styles.infoWrapStyle}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1, }}>
                        <Text numberOfLines={1} style={{ ...Fonts.blackColor15Medium }}>
                            {item.facultyName}
                        </Text>
                        <Text
                            numberOfLines={2}
                            style={{
                                marginTop: Sizes.fixPadding - 5.0,
                                ...Fonts.grayColor13Regular,
                            }}
                        >
                            {item.description}
                        </Text>
                    </View>
                    <View style={{ marginLeft: Sizes.fixPadding }}>
                        <Image
                            source={item.facultyImage}
                            style={{ width: 60.0, height: 60.0, borderRadius: 30.0 }}
                        />
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => { navigation.push('chatWithFaculty/chatWithFacultyScreen') }}
                            style={styles.chatBoxStyle}
                        >
                            <Text style={{ ...Fonts.whiteColor11Bold, color: Colors.whiteColor }}>
                                Conversar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ backgroundColor: Colors.lightGrayColor, height: 1.0, marginVertical: Sizes.fixPadding + 5.0 }} />
                <Text style={{ ...Fonts.blackColor14Medium }}>
                    {item.subjectsKnown.map(item => item).join(', ')}
                </Text>
            </View>
        )
        return (
            <FlatList
                data={displayFaculties.length == 0 ? facultiesList : displayFaculties}
                keyExtractor={(item) => `${item.id}`}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
            />
        )
    }

    function subjects() {
        const renderItem = ({ item, index }) => (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setSelectedSubjectIndex(index)}
                style={{
                    backgroundColor: index == selectedSubjectIndex ? Colors.secondaryColor : 'transparent',
                    marginHorizontal: index == 0 || index == subjectsList.length - 1 ? 0.0 : Sizes.fixPadding - 5.0,
                    paddingHorizontal: index == selectedSubjectIndex ? Sizes.fixPadding + 10.0 : Sizes.fixPadding + 2.0,
                    ...styles.subjectWrapStyle,
                }}
            >
                <Text style={index == selectedSubjectIndex ? { ...Fonts.whiteColor13Medium } : { ...Fonts.blackColor13Medium }}>
                    {item}
                </Text>
            </TouchableOpacity>
        )
        return (
            <View style={{ ...styles.allSubjectsWrapStyle }}>
                <FlatList
                    data={subjectsList}
                    keyExtractor={(item, index) => `${item}${index}`}
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
                    Professores
                </Text>
            </View>
        )
    }
}

export default FacultiesScreen

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
    subjectWrapStyle: {
        borderRadius: Sizes.fixPadding * 2.0,
        paddingVertical: Sizes.fixPadding - 5.0,
    },
    allSubjectsWrapStyle: {
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
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding * 2.0,
        paddingHorizontal: Sizes.fixPadding + 5.0,
        paddingVertical: Sizes.fixPadding * 2.0,
    },
    chatBoxStyle: {
        marginTop: -15.0,
        flexDirection: 'row',
        backgroundColor: Colors.secondaryColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Sizes.fixPadding,
        paddingHorizontal: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding - 7.0,
    }
})