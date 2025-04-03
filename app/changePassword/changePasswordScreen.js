import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, ImageBackground } from 'react-native'
import React, { useState } from 'react'
import { Colors, Fonts, Sizes, CommonStyles } from '../../constants/styles'
import { MaterialIcons } from '@expo/vector-icons';
import MyStatusBar from '../../components/myStatusBar';
import { useNavigation } from 'expo-router';

const ChangePasswordScreen = () => {

    const navigation = useNavigation();

    const [oldPassword, setoldPassword] = useState('');
    const [newPassword, setnewPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');

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
                    <ScrollView automaticallyAdjustKeyboardInsets={true} showsVerticalScrollIndicator={false}>
                        {oldPasswordInfo()}
                        {newPasswordInfo()}
                        {retypePasswordInfo()}
                        {changePasswordButton()}
                    </ScrollView>
                </View>
            </ImageBackground>
        </View>
    )

    function changePasswordButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => { navigation.push('changePasswordSuccess/changePasswordSuccessScreen') }}
                style={styles.buttonStyle}
            >
                <Text style={{ ...Fonts.whiteColor17Bold }}>
                    Change Password
                </Text>
            </TouchableOpacity>
        )
    }

    function retypePasswordInfo() {
        return (
            <View style={{ margin: Sizes.fixPadding * 2.0, }}>
                <Text numberOfLines={1} style={{ ...Fonts.grayColor13Regular }}>
                    Retype Password
                </Text>
                <TextInput
                    placeholder='--'
                    placeholderTextColor={Colors.grayColor}
                    value={retypePassword}
                    onChangeText={(value) => { setRetypePassword(value) }}
                    cursorColor={Colors.primaryColor}
                    selectionColor={Colors.primaryColor}
                    style={styles.textFieldStyle}
                    secureTextEntry={true}
                    textContentType='oneTimeCode'
                    numberOfLines={1}
                />
            </View>
        )
    }

    function newPasswordInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, }}>
                <Text numberOfLines={1} style={{ ...Fonts.grayColor13Regular }}>
                    New Password
                </Text>
                <TextInput
                    placeholder='--'
                    placeholderTextColor={Colors.grayColor}
                    value={newPassword}
                    onChangeText={(value) => { setnewPassword(value) }}
                    cursorColor={Colors.primaryColor}
                    selectionColor={Colors.primaryColor}
                    style={styles.textFieldStyle}
                    secureTextEntry={true}
                    textContentType='oneTimeCode'
                    numberOfLines={1}
                />
            </View>
        )
    }

    function oldPasswordInfo() {
        return (
            <View style={{ margin: Sizes.fixPadding * 2.0, }}>
                <Text numberOfLines={1} style={{ ...Fonts.grayColor13Regular }}>
                    Old Password
                </Text>
                <TextInput
                    placeholder='--'
                    placeholderTextColor={Colors.grayColor}
                    value={oldPassword}
                    onChangeText={(value) => { setoldPassword(value) }}
                    cursorColor={Colors.primaryColor}
                    selectionColor={Colors.primaryColor}
                    style={styles.textFieldStyle}
                    secureTextEntry={true}
                    textContentType='oneTimeCode'
                    numberOfLines={1}
                />
            </View>
        )
    }

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <MaterialIcons name="arrow-back" size={24} color={Colors.whiteColor} onPress={() => { navigation.pop() }} />
                <Text style={{ marginLeft: Sizes.fixPadding * 2.0, ...Fonts.whiteColor18SemiBold }}>
                    Change Password
                </Text>
            </View>
        )
    }
}

export default ChangePasswordScreen

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
    textFieldStyle: {
        paddingHorizontal:0,
        paddingVertical: Sizes.fixPadding - 5.0,
        ...Fonts.blackColor14Medium,
        borderBottomColor: Colors.lightGrayColor,
        borderBottomWidth: 1.0,
    },
    buttonStyle: {
        backgroundColor: Colors.secondaryColor,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Sizes.fixPadding + 5.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginTop: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding * 2.0,
        borderRadius: Sizes.fixPadding * 3.0,
        elevation: 1.0,
        ...CommonStyles.buttonShadow,
        borderColor: '#FFAB1B95',
        borderWidth: 1.0,
    }
})