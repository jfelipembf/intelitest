import { StyleSheet, Text, View, Image, ImageBackground, ScrollView, Dimensions } from 'react-native'
import React from 'react'
import { Colors, Fonts, Sizes } from '../../constants/styles'
import { MaterialIcons } from '@expo/vector-icons';
import MyStatusBar from '../../components/myStatusBar';
import { useNavigation } from 'expo-router';

const { width } = Dimensions.get('window');

const schoolGalleriesList = [
    {
        id: '1',
        image: require('../../assets/images/schoolGallery/gallery1.png')
    },
    {
        id: '2',
        image: require('../../assets/images/schoolGallery/gallery2.png')
    },
    {
        id: '3',
        image: require('../../assets/images/schoolGallery/gallery3.png')
    },
    {
        id: '4',
        image: require('../../assets/images/schoolGallery/gallery4.png')
    },
    {
        id: '5',
        image: require('../../assets/images/schoolGallery/gallery5.png')
    },
    {
        id: '6',
        image: require('../../assets/images/schoolGallery/gallery6.png')
    },
    {
        id: '7',
        image: require('../../assets/images/schoolGallery/gallery7.png')
    },
    {
        id: '8',
        image: require('../../assets/images/schoolGallery/gallery8.png')
    },
    {
        id: '9',
        image: require('../../assets/images/schoolGallery/gallery9.png')
    },
];

const SchoolGalleryScreen = () => {

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
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: Sizes.fixPadding * 2.0, }}>
                        {schoolGalleries()}
                    </ScrollView>
                </View>
            </ImageBackground>
        </View>
    )

    function schoolGalleries() {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: Sizes.fixPadding * 2.0, }}>
                <View>
                    {schoolGalleriesList
                        .filter((_, i) => i % 2 === 0)
                        .map((item) =>
                        (
                            <Image
                                key={`${item.id}`}
                                source={item.image}
                                style={{
                                    ...styles.galleryImageStyle,
                                    height: (((width - 40) / 2.0) * ((Math.floor(Math.random() * 150) + 50) / 145)),
                                }}
                            />
                        ))}
                </View>
                <View>
                    {schoolGalleriesList
                        .filter((_, i) => i % 2 === 1)
                        .map((item) =>
                        (
                            <Image
                                key={`${item.id}`}
                                source={item.image}
                                style={{
                                    ...styles.galleryImageStyle,
                                    height: (((width - 40) / 2.0) * ((Math.floor(Math.random() * 150) + 50) / 145)),
                                }}
                            />
                        ))}
                </View>
            </View>
        )
    }

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <MaterialIcons name="arrow-back" size={24} color={Colors.whiteColor} onPress={() => { navigation.pop() }} />
                <Text style={{ marginLeft: Sizes.fixPadding * 2.0, ...Fonts.whiteColor18SemiBold }}>
                    School Gallery
                </Text>
            </View>
        )
    }
}

export default SchoolGalleryScreen

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
    galleryImageStyle: {
        width: (width / 2.0) - 28,
        marginBottom: Sizes.fixPadding - 7.0,
        marginBottom: Sizes.fixPadding * 2.0,
        borderRadius: Sizes.fixPadding,
    }
})