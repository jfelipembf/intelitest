import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native'
import React from 'react'
import { Colors, Fonts, Sizes, CommonStyles } from '../../constants/styles'
import { MaterialIcons } from '@expo/vector-icons';
import MyStatusBar from '../../components/myStatusBar';
import { useNavigation } from 'expo-router';

const { width } = Dimensions.get('window');

const SupportScreen = () => {

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
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {supportImage()}
                        {supportText()}
                        {callUsInfo()}
                        {divider()}
                        {mailUsInfo()}
                        {divider()}
                        {submitButton()}
                    </ScrollView>
                </View>
            </ImageBackground>
        </View>
    )

    function divider() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, backgroundColor: Colors.lightGrayColor, height: 1.0, }} />
        )
    }

    function submitButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => { navigation.pop() }}
                style={styles.buttonStyle}
            >
                <Text style={{ ...Fonts.whiteColor17Bold }}>
                    Submit
                </Text>
            </TouchableOpacity>
        )
    }

    function mailUsInfo() {
        return (
            <View style={{ marginTop: Sizes.fixPadding * 2.0, marginHorizontal: Sizes.fixPadding * 2.0, }}>
                <Text numberOfLines={1} style={{ marginBottom: Sizes.fixPadding - 5.0, ...Fonts.grayColor13Regular }}>
                    Mail us
                </Text>
                <Text style={styles.callAndMailTextStyle}>
                    scholarstudy@gmail.com
                </Text>
            </View>
        )
    }

    function callUsInfo() {
        return (
            <View style={{ marginTop: Sizes.fixPadding * 4.0, marginHorizontal: Sizes.fixPadding * 2.0, }}>
                <Text numberOfLines={1} style={{ marginBottom: Sizes.fixPadding - 5.0, ...Fonts.grayColor13Regular }}>
                    Call us
                </Text>
                <Text style={styles.callAndMailTextStyle}>
                    +91 1236547890
                </Text>
            </View>
        )
    }

    function supportText() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginVertical: Sizes.fixPadding, alignItems: 'center' }}>
                <Text style={{ textAlign: 'center', ...Fonts.blackColor20Medium }}>
                    Get Support
                </Text>
                <Text style={{ marginTop: Sizes.fixPadding - 5.0, textAlign: 'center', ...Fonts.grayColor13Regular }}>
                    For any support and request...{`\n`}Please feel free to speak with us at below.
                </Text>
            </View>
        )
    }

    function supportImage() {
        return (
            <Image
                source={require('../../assets/images/icons/supportBig.png')}
                style={styles.supportImageStyle}
            />
        )
    }

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <MaterialIcons name="arrow-back" size={24} color={Colors.whiteColor} onPress={() => { navigation.pop() }} />
                <Text style={{ marginLeft: Sizes.fixPadding * 2.0, ...Fonts.whiteColor18SemiBold }}>
                    Support
                </Text>
            </View>
        )
    }
}

export default SupportScreen

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
    supportImageStyle: {
        width: width / 3.0,
        height: width / 3.0,
        resizeMode: 'contain',
        margin: Sizes.fixPadding * 2.0,
        alignSelf: 'center'
    },
    callAndMailTextStyle: {
        paddingBottom: Sizes.fixPadding - 5.0,
        ...Fonts.blackColor14Medium,
    },
    buttonStyle: {
        backgroundColor: Colors.secondaryColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Sizes.fixPadding * 3.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
        paddingVertical: Sizes.fixPadding + 5.0,
        marginBottom: Sizes.fixPadding * 2.0,
        elevation: 1.0,
        ...CommonStyles.buttonShadow,
        borderColor: '#FFAB1B95',
        borderWidth: 1.0,
        marginTop: Sizes.fixPadding * 3.0,
    },
})