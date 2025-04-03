import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
  Animated,
} from "react-native";
import React, { useState, useRef } from "react";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import { SwipeListView } from "react-native-swipe-list-view";
import { Snackbar } from "react-native-paper";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import MyStatusBar from "../../components/myStatusBar";
import { useNavigation } from "expo-router";

const { width } = Dimensions.get("window");

const notificatiosList = [
  {
    key: "1",
    notificationPart1: "Tomorrow",
    notificationPart2: "26 Dec 2020, Sat Economics",
    notificationPart3: "weekly Exam",
    iconColor: Colors.purpleColor,
    bgColor: Colors.lightPurpleColor,
  },
  {
    key: "2",
    notificationPart1:
      "All the faculty members and students are hereby informed that classes will be suspended on",
    notificationPart2: "Monday, 25/12/20",
    notificationPart3: "in lieu of the Christmas Festival.",
    iconColor: Colors.creamColor,
    bgColor: Colors.lightCreamColor,
  },
  {
    key: "3",
    notificationPart1:
      "Parent teachers meeting for up coming exam is going to be held on ",
    notificationPart2: "last saturday(27/12/20)",
    notificationPart3:
      "of the month (9:30 am to 12:30 pm). All the parents are requested to attend the meeting.",
    note: "All the parents are requested to attend the meeting.",
    iconColor: Colors.greenColor,
    bgColor: Colors.lightGreenColor,
  },
  {
    key: "4",
    notificationPart1: "All the students are hereby informed that the",
    notificationPart2:
      "Annual Day Function of the school will be held on Wednesday, the 31 December,2020",
    notificationPart3: "at 4:00pm in the school campus.",
    iconColor: Colors.cyanColor,
    bgColor: Colors.lightCyanColor,
  },
];

const rowTranslateAnimatedValues = {};

const NotificationsScreen = () => {

  const navigation = useNavigation();

  const [showSnackBar, setShowSnackBar] = useState(false);
  const [listData, setListData] = useState(notificatiosList);

  Array(listData.length + 1)
    .fill("")
    .forEach((_, i) => {
      rowTranslateAnimatedValues[`${i}`] = new Animated.Value(1);
    });

  const animationIsRunning = useRef(false);

  const onSwipeValueChange = (swipeData) => {
    const { key, value } = swipeData;

    if (value > width || (value < -width && !animationIsRunning.current)) {
      animationIsRunning.current = true;
      Animated.timing(rowTranslateAnimatedValues[key], {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        const newData = [...listData];
        const prevIndex = listData.findIndex((item) => item.key === key);
        newData.splice(prevIndex, 1);
        setListData(newData);
        setShowSnackBar(true);
        animationIsRunning.current = false;
      });
    }
  };

  const renderItem = (data) => (
    <View>
      <View style={{ flex: 1, backgroundColor: Colors.whiteColor, }}>
        <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, }}>
          <View style={{ flexDirection: "row", }}>
            <View
              style={{
                ...styles.iconWrapStyle,
                backgroundColor: data.item.bgColor,
              }}
            >
              <Ionicons
                name="notifications"
                size={24}
                color={data.item.iconColor}
              />
            </View>
            <View style={{ flex: 1, marginLeft: Sizes.fixPadding + 5.0 }}>
              <Text style={{ lineHeight: 20.0, ...Fonts.blackColor14Regular }}>
                {data.item.notificationPart1}
                <Text style={{ ...Fonts.blackColor14SemiBold }}>
                  { } {data.item.notificationPart2} { }
                </Text>
                {data.item.notificationPart3}
              </Text>
              {data.item.note ? (
                <Text style={{ ...Fonts.redColor14Regular }}>
                  {data.item.note}
                </Text>
              ) : null}
            </View>
          </View>
          <View
            style={{
              backgroundColor: Colors.lightGrayColor,
              height: 1.0,
              marginVertical: Sizes.fixPadding * 2.0,
            }}
          />
        </View>
      </View>
    </View>
  );

  const renderHiddenItem = () => <View style={styles.rowBack} />;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.primaryColor }}>
      <MyStatusBar />
      <ImageBackground
        source={require("../../assets/images/bgImage.png")}
        style={{
          width: "100%",
          height: 250,
          flex: 1,
        }}
        resizeMode="stretch"
        tintColor={Colors.whiteColor}
      >
        {header()}
        <View style={styles.sheetViewStyle}>{notifications()}</View>
      </ImageBackground>
      {snackBar()}
    </View>
  );

  function header() {
    return (
      <View style={styles.headerWrapStyle}>
        <MaterialIcons
          name="arrow-back"
          size={24}
          color={Colors.whiteColor}
          onPress={() => { navigation.pop() }}
        />
        <Text
          style={{
            marginLeft: Sizes.fixPadding * 2.0,
            ...Fonts.whiteColor18SemiBold,
          }}
        >
          Notifications
        </Text>
      </View>
    );
  }

  function notifications() {
    return listData.length == 0 ? noNotoficationInfo() : notificationsInfo();
  }

  function snackBar() {
    return (
      <Snackbar
        style={{ backgroundColor: Colors.blackColor }}
        elevation={0}
        visible={showSnackBar}
        onDismiss={() => setShowSnackBar(false)}
      >
        <Text style={{ ...Fonts.whiteColor13Regular }}>
          Notification Dismissed!
        </Text>
      </Snackbar>
    );
  }

  function notificationsInfo() {
    return (
      <SwipeListView
        data={listData}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-width}
        leftOpenValue={width}
        onSwipeValueChange={onSwipeValueChange}
        useNativeDriver={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: Sizes.fixPadding * 2.0 }}
      />
    );
  }

  function noNotoficationInfo() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Ionicons
          name="notifications-off-outline"
          size={40}
          color={Colors.grayColor}
        />
        <Text
          style={{
            ...Fonts.grayColor16Medium,
            marginTop: Sizes.fixPadding + 5.0,
          }}
        >
          No New Notifications
        </Text>
      </View>
    );
  }
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  rowBack: {
    alignItems: "center",
    backgroundColor: Colors.primaryColor,
    flex: 1,
    marginBottom: Sizes.fixPadding * 2.0
  },
  iconWrapStyle: {
    width: 50.0,
    height: 50.0,
    borderRadius: 25.0,
    justifyContent: "center",
    alignItems: "center",
  },
  sheetViewStyle: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
    borderTopLeftRadius: Sizes.fixPadding * 2.0,
    borderTopRightRadius: Sizes.fixPadding * 2.0,
    marginBottom: -(Sizes.fixPadding * 5.0),
    overflow: "hidden",
    paddingBottom: Sizes.fixPadding * 5.0,
  },
  headerWrapStyle: {
    marginVertical: Sizes.fixPadding * 3.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
    flexDirection: "row",
    alignItems: "center",
  },
});
