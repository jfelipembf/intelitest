import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ImageBackground,
  Dimensions,
  FlatList,
  Platform,
  TouchableOpacity
} from "react-native";
import React, { useState } from "react";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

const { width } = Dimensions.get("window");

const randomColor = () => {
  const generateRandomColor = Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0");
  return `#${generateRandomColor}`;
};

const connectedUsersList = [
  {
    id: "1",
    userShortName: "AB",
    isUserMute: true,
    isUserVideoCamOff: true,
    bgColor: randomColor(),
  },
  {
    id: "2",
    userShortName: "AA",
    isUserMute: false,
    isUserVideoCamOff: true,
    bgColor: randomColor(),
  },
  {
    id: "3",
    userShortName: "BV",
    isUserMute: true,
    isUserVideoCamOff: true,
    bgColor: randomColor(),
  },
  {
    id: "4",
    userShortName: "DZ",
    isUserMute: true,
    isUserVideoCamOff: true,
    bgColor: randomColor(),
  },
  {
    id: "5",
    userShortName: "DR",
    isUserMute: true,
    isUserVideoCamOff: true,
    bgColor: randomColor(),
  },
  {
    id: "6",
    userShortName: "DS",
    isUserMute: true,
    isUserVideoCamOff: true,
    bgColor: randomColor(),
  },
];

const VideoClassScreen = () => {

  const navigation = useNavigation();

  const [isMute, setIsMute] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.primaryColor }}>
      <StatusBar translucent backgroundColor='transparent' barStyle={'light-content'} />
      <ImageBackground
        source={require("../../assets/images/videoClassBgImage.png")}
        style={{ width: "100%", flex: 1, justifyContent: "space-between" }}
        resizeMode="stretch"
      >
        {timingInfo()}
        <View>
          {connectedUsersInfo()}
          {callingFunctionsButtons()}
        </View>
      </ImageBackground>
    </View>
  );

  function connectedUsersInfo() {
    const renderItem = ({ item }) => (
      <View
        style={{
          backgroundColor: Colors.extraLightGrayColor,
          marginRight: Sizes.fixPadding,
          padding: Sizes.fixPadding - 5.0,
        }}
      >
        <MaterialIcons
          name="more-vert"
          color={Colors.blackColor}
          size={20}
          style={{ left: -5.0 }}
        />
        <View
          style={{
            ...styles.userShortNameWrapStyle,
            backgroundColor: item.bgColor,
          }}
        >
          <Text style={{ ...Fonts.whiteColor20Regular }}>
            {item.userShortName}
          </Text>
        </View>
        <View
          style={{
            alignSelf: "flex-end",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <MaterialIcons
            name={item.isUserMute ? "mic-off" : "mic"}
            color={Colors.blackColor}
            size={20}
          />
          <MaterialIcons
            name={item.isUserVideoCamOff ? "videocam-off" : "videocam"}
            color={Colors.blackColor}
            size={18}
            style={{ marginLeft: Sizes.fixPadding - 5.0 }}
          />
        </View>
      </View>
    );
    return (
      <FlatList
        data={connectedUsersList}
        keyExtractor={(item) => `${item.id}`}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingLeft: Sizes.fixPadding * 2.0,
          paddingRight: Sizes.fixPadding,
        }}
      />
    );
  }

  function callingFunctionsButtons() {
    return (
      <View
        style={{
          margin: Sizes.fixPadding * 2.0,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setIsMute(!isMute);
          }}
          style={styles.callingFunctionalButtonStyle}
        >
          <MaterialIcons
            name={isMute ? "mic-off" : "mic"}
            size={width / 15.0}
            color={Colors.blackColor}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => { navigation.pop() }}
          style={{
            ...styles.callingFunctionalButtonStyle,
            backgroundColor: Colors.redColor,
            marginHorizontal: Sizes.fixPadding + 5.0,
          }}
        >
          <MaterialIcons
            name="call-end"
            size={width / 15.0}
            color={Colors.whiteColor}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => { }}
          style={styles.callingFunctionalButtonStyle}
        >
          <MaterialIcons
            name="videocam"
            size={width / 15.0}
            color={Colors.blackColor}
          />
        </TouchableOpacity>
      </View>
    );
  }

  function timingInfo() {
    return (
      <View
        style={{
          alignItems: "center",
          marginTop:
            Platform.OS == "ios"
              ? Sizes.fixPadding * 8.0
              : StatusBar.currentHeight + Sizes.fixPadding * 3.0,
        }}
      >
        <Text style={{ ...Fonts.whiteColor18SemiBold }}>Live Class</Text>
        <Text style={{ ...Fonts.whiteColor16Regular }}>00:22</Text>
      </View>
    );
  }
};

export default VideoClassScreen;

const styles = StyleSheet.create({
  callingFunctionalButtonStyle: {
    width: width / 7.5,
    height: width / 7.5,
    borderRadius: width / 7.5 / 2.0,
    backgroundColor: Colors.whiteColor,
    alignItems: "center",
    justifyContent: "center",
  },
  userShortNameWrapStyle: {
    width: width / 6.5,
    height: width / 6.5,
    borderRadius: width / 6.5 / 2.0,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginHorizontal: Sizes.fixPadding * 2.5,
    marginTop: Sizes.fixPadding - 5.0,
    marginBottom: Sizes.fixPadding,
  },
});
