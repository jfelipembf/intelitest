import { StyleSheet, Text, View, ImageBackground, FlatList } from 'react-native'
import React from 'react'
import { Colors, Fonts, Sizes } from '../../constants/styles'
import { MaterialIcons } from '@expo/vector-icons';
import MyStatusBar from '../../components/myStatusBar';
import { useLocalSearchParams, useNavigation } from 'expo-router';

const SyllabusDetailScreen = () => {

    const navigation = useNavigation();

    var { syllabus } = useLocalSearchParams();
    syllabus = JSON.parse(syllabus);

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
                    {syllabusDetail()}
                </View>
            </ImageBackground>
        </View>
    )

    function syllabusDetail() {
        const renderItem = ({ item, index }) => (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, }}>
                <Text style={{ marginBottom: Sizes.fixPadding * 2.0, ...Fonts.primaryColor18Medium }}>
                    Unit {index + 1}:- {item.chepterName}
                </Text>
                {
                    <FlatList
                        data={item?.subTopics}
                        scrollEnabled={false}
                        renderItem={(subTopics) => {
                            return (
                                <View style={{ marginBottom: Sizes.fixPadding * 2.0, }}>
                                    <View style={{ flexDirection: 'row', }}>
                                        <Text style={{ ...Fonts.blackColor15Medium }}>
                                            {index + 1}.{subTopics.index + 1}
                                        </Text>
                                        <Text style={{ flex: 1, ...Fonts.blackColor15Medium, marginLeft: Sizes.fixPadding - 5.0 }}>
                                            {subTopics.item.subTopicTitle}
                                        </Text>
                                    </View>
                                    {
                                        <FlatList
                                            data={subTopics?.item.innerSubTopics}
                                            scrollEnabled={false}
                                            renderItem={(innerSubtopic) => (
                                                <View>
                                                    <View
                                                        style={{ flexDirection: 'row', marginHorizontal: Sizes.fixPadding, marginTop: Sizes.fixPadding, }}
                                                    >
                                                        <Text style={{ ...Fonts.grayColor13Regular, }}>
                                                            •
                                                        </Text>
                                                        <Text style={{ marginLeft: Sizes.fixPadding - 5.0, flex: 1, ...Fonts.grayColor13Regular, }}>
                                                            {innerSubtopic.item.innerSubTopicTitle}
                                                        </Text>
                                                    </View>
                                                    <FlatList
                                                        data={innerSubtopic?.item.extraInnerSubTopics}
                                                        renderItem={(extraInnerSubTopic) => {
                                                            return (
                                                                <View
                                                                    style={{ flexDirection: 'row', marginHorizontal: Sizes.fixPadding * 3.0, marginTop: Sizes.fixPadding }}
                                                                >
                                                                    <Text style={{ ...Fonts.grayColor13Regular }}>
                                                                        •
                                                                    </Text>
                                                                    <Text style={{ ...Fonts.grayColor13Regular, marginLeft: Sizes.fixPadding - 5.0, }}>
                                                                        {extraInnerSubTopic.item.extraInnerSubTopicTitle}
                                                                    </Text>
                                                                </View>
                                                            )
                                                        }}
                                                        scrollEnabled={false}
                                                    />
                                                </View>
                                            )}
                                        />
                                    }
                                </View>
                            )
                        }}
                    />
                }
            </View>
        )
        return (
            <FlatList
                data={syllabus.slice(0, 2)}
                renderItem={renderItem}
                contentContainerStyle={{ paddingTop: Sizes.fixPadding * 2.0, }}
                showsVerticalScrollIndicator={false}
            />
        )
    }

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <MaterialIcons name="arrow-back" size={24} color={Colors.whiteColor} onPress={() => { navigation.pop() }} />
                <Text style={{ marginLeft: Sizes.fixPadding * 2.0, ...Fonts.whiteColor18SemiBold }}>
                    Syllabus
                </Text>
            </View>
        )
    }
}

export default SyllabusDetailScreen

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