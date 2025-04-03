import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react'
import { Colors, Fonts, Sizes } from '../../constants/styles'
import { MaterialIcons } from '@expo/vector-icons';
import MyStatusBar from '../../components/myStatusBar';
import { useNavigation } from 'expo-router';

const { width } = Dimensions.get('window');

const ChangePasswordSuccessScreen = () => {

    const navigation = useNavigation();

    return (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <MyStatusBar />
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                {closeArrow()}
                {changeInfo()}
            </View>
        </View>
    )

    function changeInfo() {
        return (
            <View style={{ alignItems: 'center', marginHorizontal: Sizes.fixPadding * 4.0, }}>
                <View style={styles.doneIconWrapStyle}>
                    <MaterialIcons
                        name='done'
                        color={Colors.primaryColor}
                        size={width / 8.0}
                    />
                </View>
                <Text style={{ textAlign: 'center', ...Fonts.blackColor18SemiBold }}>
                    Password Changed
                </Text>
                <Text style={{ marginTop: Sizes.fixPadding, textAlign: 'center', ...Fonts.blackColor13Regular }}>
                    Your password has been successfully changed
                </Text>
            </View>
        )
    }

    function closeArrow() {
        return (
            <MaterialIcons
                name="close"
                size={30}
                color={Colors.blackColor}
                onPress={() => { navigation.pop() }}
                style={styles.closeArrowStyle}
            />
        )
    }
}

export default ChangePasswordSuccessScreen

const styles = StyleSheet.create({
    doneIconWrapStyle: {
        width: width / 3.7,
        height: width / 3.7,
        borderRadius: (width / 3.5) / 2.0,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: Colors.primaryColor,
        borderWidth: 3.0,
        marginVertical: Sizes.fixPadding * 2.0,
    },
    closeArrowStyle: {
        margin: Sizes.fixPadding * 2.0,
        position: 'absolute',
        top: 0.0,
        left: 0.0,
    }
})