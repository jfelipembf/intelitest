import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Image,
  StatusBar,
  Dimensions,
} from "react-native";
import React from "react";
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "expo-router";
import MyStatusBar from "../../components/myStatusBar";

const { width } = Dimensions.get('window');

const TestResultScreen = () => {

  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: Colors.primaryColor }}>
      <MyStatusBar/>
      <ImageBackground
        source={require("../../assets/images/bgImage.png")}
        style={{ width: "100%", height: 250, flex: 1 }}
        resizeMode="stretch"
        tintColor={Colors.whiteColor}
      >
        {header()}
        <View style={styles.sheetStyle}>
          {bottomImage()}
          <ScrollView showsVerticalScrollIndicator={false}>
            {gradePercentageInfo()}
            {greatMessage()}
            {resultSort({
              title: "Correct Answers",
              result: "17(85%)",
              borderColor: Colors.darkGreenColor,
            })}
            {resultSort({
              title: "Skipped Answers",
              result: "01(5%)",
              borderColor: Colors.secondaryColor,
            })}
            {resultSort({
              title: "Wrong Answers",
              result: "02(10%)",
              borderColor: Colors.redColor,
            })}
            {leaderBoardAndAnswerSheetButton()}
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );

  function leaderBoardAndAnswerSheetButton() {
    return (
      <View style={styles.leaderBoardAndAnswerSheetButtonWrapStyle}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            navigation.push("leaderBoard/leaderBoardScreen");
          }}
          style={{
            backgroundColor: Colors.secondaryColor,
            ...styles.buttonStyle,
          }}
        >
          <Text numberOfLines={1} style={{ ...Fonts.whiteColor17Bold }}>
            Leaderboard
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            navigation.push("answerSheet/answerSheetScreen");
          }}
          style={{ backgroundColor: Colors.whiteColor, ...styles.buttonStyle }}
        >
          <Text numberOfLines={1} style={{ ...Fonts.secondaryColor17Bold }}>
            Answer Sheet
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function bottomImage() {
    return (
      <Image
        source={require("../../assets/images/resultBg.png")}
        style={styles.bottomImageStyle}
      />
    );
  }

  function resultSort({ title, result, borderColor }) {
    return (
      <View style={{ borderColor: borderColor, ...styles.resultInfoWrapStyle }}>
        <Text style={{ flex: 1, ...Fonts.blackColor16Regular }}>{title}</Text>
        <Text style={{ ...Fonts.blackColor16Medium }}>{result}</Text>
      </View>
    );
  }

  function greatMessage() {
    return (
      <View
        style={{ alignItems: "center", marginBottom: Sizes.fixPadding * 2.0 }}
      >
        <Text style={{ textAlign: "center", ...Fonts.blackColor15Medium }}>
          You’re Excellent
        </Text>
        <Text
          style={{
            marginTop: Sizes.fixPadding,
            textAlign: "center",
            ...Fonts.blackColor30BebasRegular,
          }}
        >
          Samantha Smith !!
        </Text>
      </View>
    );
  }

  function gradePercentageInfo() {
    return (
      <ImageBackground
        source={require("../../assets/images/gradePercentangeCircle.png")}
        style={styles.gradeWithPercentageImageStyle}
      >
        <Text
          style={{ textAlign: "center", ...Fonts.whiteColor44BebasRegular }}
        >
          95%
        </Text>
        <Text style={{ textAlign: "center", ...Fonts.whiteColor13SemiBold }}>
          GRADE A
        </Text>
      </ImageBackground>
    );
  }

  function header() {
    return (
      <View style={styles.headerWrapStyle}>
        <MaterialIcons
          name="arrow-back"
          size={24}
          color={Colors.whiteColor}
          onPress={() => {
            navigation.pop();
          }}
        />
      </View>
    );
  }
};

export default TestResultScreen;

const styles = StyleSheet.create({
  headerWrapStyle: {
    marginTop: StatusBar.currentHeight + Sizes.fixPadding * 3.0,
    marginBottom: Sizes.fixPadding * 3.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
    flexDirection: "row",
    alignItems: "center",
  },
  sheetStyle: {
    backgroundColor: Colors.whiteColor,
    borderTopLeftRadius: Sizes.fixPadding * 2.0,
    borderTopRightRadius: Sizes.fixPadding * 2.0,
    flex: 1,
    overflow: "hidden",
  },
  gradeWithPercentageImageStyle: {
    width: 136.0,
    height: 136.0,
    alignSelf: "center",
    margin: Sizes.fixPadding * 2.0,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonStyle: {
    borderColor: Colors.secondaryColor,
    borderWidth: 1.0,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Sizes.fixPadding * 3.0,
    paddingVertical: Sizes.fixPadding + 5.0,
    elevation: 3.0,
    marginHorizontal: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding,
    ...CommonStyles.buttonShadow
  },
  leaderBoardAndAnswerSheetButtonWrapStyle: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Sizes.fixPadding,
    marginVertical: Sizes.fixPadding + 5.0,
  },
  bottomImageStyle: {
    height: width / 3.0,
    width: "100%",
    position: "absolute",
    bottom: 0.0,
  },
  resultInfoWrapStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1.0,
    borderRadius: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginBottom: Sizes.fixPadding + 5.0,
    padding: Sizes.fixPadding + 5.0,
  },
});
