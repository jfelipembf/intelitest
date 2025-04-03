import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
} from "react-native";
import React, { useState } from "react";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import { MaterialIcons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import MyStatusBar from "../../components/myStatusBar";
import { useNavigation } from "expo-router";

const markedDates = [
  {
    festivalAndHoliDays: {
      "2026-01-25": { selected: true, selectedColor: Colors.greenColor },
      "2026-01-26": { selected: true, selectedColor: Colors.greenColor },
    },
    absentDays: {
      "2026-01-18": { selected: true, selectedColor: Colors.redColor },
      "2026-01-19": { selected: true, selectedColor: Colors.redColor },
    },
    halfDays: {
      "2026-01-07": { selected: true, selectedColor: Colors.secondaryColor },
    },
  },
  {
    festivalAndHoliDays: {
      "2026-02-25": { selected: true, selectedColor: Colors.greenColor },
      "2026-02-07": { selected: true, selectedColor: Colors.greenColor },
    },
    absentDays: {
      "2026-02-10": { selected: true, selectedColor: Colors.redColor },
      "2026-02-11": { selected: true, selectedColor: Colors.redColor },
    },
    halfDays: {
      "2026-02-04": { selected: true, selectedColor: Colors.secondaryColor },
    },
  },
  {
    festivalAndHoliDays: {
      "2026-03-25": { selected: true, selectedColor: Colors.greenColor },
      "2026-03-07": { selected: true, selectedColor: Colors.greenColor },
    },
    absentDays: {
      "2026-03-10": { selected: true, selectedColor: Colors.redColor },
    },
  },
  {
    festivalAndHoliDays: {
      "2026-04-25": { selected: true, selectedColor: Colors.greenColor },
    },
    absentDays: {
      "2026-04-10": { selected: true, selectedColor: Colors.redColor },
      "2026-04-11": { selected: true, selectedColor: Colors.redColor },
    },
    halfDays: {
      "2026-04-04": { selected: true, selectedColor: Colors.secondaryColor },
      "2026-04-07": { selected: true, selectedColor: Colors.secondaryColor },
    },
  },
  {
    festivalAndHoliDays: {
      "2026-05-25": { selected: true, selectedColor: Colors.greenColor },
    },
    halfDays: {
      "2026-05-04": { selected: true, selectedColor: Colors.secondaryColor },
      "2026-05-08": { selected: true, selectedColor: Colors.secondaryColor },
    },
  },  
  {
    festivalAndHoliDays: {
      "2025-01-06": { selected: true, selectedColor: Colors.greenColor },
      "2025-01-21": { selected: true, selectedColor: Colors.greenColor },
    },
    halfDays: {
      "2025-01-04": { selected: true, selectedColor: Colors.secondaryColor },
    },
  },
  {
    festivalAndHoliDays: {
      "2025-02-11": { selected: true, selectedColor: Colors.greenColor },
      "2025-02-08": { selected: true, selectedColor: Colors.greenColor },
    },
    halfDays: {
      "2025-02-22": { selected: true, selectedColor: Colors.secondaryColor },
    },
  },
  {
    festivalAndHoliDays: {
      "2025-03-06": { selected: true, selectedColor: Colors.greenColor },
      "2025-03-24": { selected: true, selectedColor: Colors.greenColor },
    },
    halfDays: {
      "2025-03-22": { selected: true, selectedColor: Colors.secondaryColor },
    },
  },
  {
    festivalAndHoliDays: {
      "2025-04-08": { selected: true, selectedColor: Colors.greenColor },
      "2025-04-24": { selected: true, selectedColor: Colors.greenColor },
    },
    halfDays: {
      "2025-04-05": { selected: true, selectedColor: Colors.secondaryColor },
    },
  },
  {
    festivalAndHoliDays: {
      "2025-05-08": { selected: true, selectedColor: Colors.greenColor },
      "2025-05-19": { selected: true, selectedColor: Colors.greenColor },
    },
    halfDays: {
      "2025-05-31": { selected: true, selectedColor: Colors.secondaryColor },
    },
  },
  {
    festivalAndHoliDays: {
      "2025-06-27": { selected: true, selectedColor: Colors.greenColor },
    },
    halfDays: {
      "2025-06-05": { selected: true, selectedColor: Colors.secondaryColor },
      "2025-06-07": { selected: true, selectedColor: Colors.secondaryColor },
    },
  },
  {
    festivalAndHoliDays: {
      "2025-07-14": { selected: true, selectedColor: Colors.greenColor },
      "2025-07-26": { selected: true, selectedColor: Colors.greenColor },
      "2025-07-31": { selected: true, selectedColor: Colors.greenColor },
    },
    halfDays: {
      "2025-07-10": { selected: true, selectedColor: Colors.secondaryColor },
      "2025-07-24": { selected: true, selectedColor: Colors.secondaryColor },
    },
  },
  {
    festivalAndHoliDays: {
      "2025-08-25": { selected: true, selectedColor: Colors.greenColor },
      "2025-08-26": { selected: true, selectedColor: Colors.greenColor },
    },
    halfDays: {
      "2025-08-07": { selected: true, selectedColor: Colors.secondaryColor },
    },
  },
  {
    halfDays: {
      "2025-09-07": { selected: true, selectedColor: Colors.secondaryColor },
    },
  },
  {
    festivalAndHoliDays: {
      "2025-10-16": { selected: true, selectedColor: Colors.greenColor },
    },
    halfDays: {
      "2025-10-07": { selected: true, selectedColor: Colors.secondaryColor },
    },
  },
  {
    festivalAndHoliDays: {
      "2025-11-16": { selected: true, selectedColor: Colors.greenColor },
      "2025-11-20": { selected: true, selectedColor: Colors.greenColor },
      "2025-11-25": { selected: true, selectedColor: Colors.greenColor },
    },
    halfDays: {
      "2025-11-04": { selected: true, selectedColor: Colors.secondaryColor },
    },
  },
  {
    festivalAndHoliDays: {
      "2025-12-06": { selected: true, selectedColor: Colors.greenColor },
      "2025-12-12": { selected: true, selectedColor: Colors.greenColor },
    },
  },
];

const AttendanceScreen = () => {

  const navigation = useNavigation();

  const [currentDataIndex, setcurrentDataIndex] = useState(getCurrentMonthIndex());

  return (
    <View style={{ flex: 1, backgroundColor: Colors.primaryColor }}>
      <MyStatusBar />
      <ImageBackground
        source={require("../../assets/images/bgImage.png")}
        style={{ width: "100%", height: 250, flex: 1 }}
        resizeMode="stretch"
        tintColor={Colors.whiteColor}
      >
        {header()}
        <View style={styles.sheetStyle}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 2.0 }}
          >
            {calenderView()}
            {absentInfo()}
            {festivalAndHolidaysInfo()}
            {halfDaysInfo()}
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );

  function halfDaysInfo() {
    var count =
      currentDataIndex >= 0 && currentDataIndex <= markedDates.length - 1
        ? markedDates[currentDataIndex].halfDays
          ? Object.values(markedDates[currentDataIndex].halfDays).length
          : 0
        : 0;
    return infoSort({
      title: "Half Day",
      count: count,
      bgColor: Colors.lightSecondaryColor,
      color: Colors.secondaryColor,
      textStyle: { ...Fonts.secondaryColor15SemiBold },
    });
  }

  function festivalAndHolidaysInfo() {
    var count =
      currentDataIndex >= 0 && currentDataIndex <= markedDates.length - 1
        ? markedDates[currentDataIndex].festivalAndHoliDays
          ? Object.values(markedDates[currentDataIndex].festivalAndHoliDays)
            .length
          : 0
        : 0;
    return (
      <View style={{ marginVertical: Sizes.fixPadding + 5.0 }}>
        {infoSort({
          title: "Festival & Holidays",
          count: count,
          bgColor: Colors.lightGreenColor,
          color: Colors.greenColor,
          textStyle: { ...Fonts.greenColor15SemiBold },
        })}
      </View>
    );
  }

  function absentInfo() {
    var count =
      currentDataIndex >= 0 && currentDataIndex <= markedDates.length - 1
        ? markedDates[currentDataIndex].absentDays
          ? Object.values(markedDates[currentDataIndex].absentDays).length
          : 0
        : 0;
    return infoSort({
      title: "Absent",
      count: count,
      bgColor: Colors.lightRedColor,
      color: Colors.redColor,
      textStyle: { ...Fonts.redColor15SemiBold },
    });
  }

  function infoSort({ title, count, bgColor, color, textStyle }) {
    return (
      <View style={{ borderColor: color, ...styles.infoOuterWrapStyle }}>
        <View style={{ backgroundColor: color, ...styles.indicatorStyle }} />
        <View style={styles.infoWrapStyle}>
          <Text
            numberOfLines={1}
            style={{ flex: 1, ...Fonts.blackColor16Regular }}
          >
            {title}
          </Text>
          <View style={{ backgroundColor: bgColor, ...styles.countWrapStyle }}>
            <Text style={{ ...textStyle }}>
              {count.toString().length == 1 ? `0${count}` : count}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  function getCurrentMonthIndex() {
    var currentMonth =
      (new Date().getMonth() + 1).toString().length == 1
        ? `0${new Date().getMonth() + 1}`
        : new Date().getMonth() + 1;
    var currentYearWithMonth = `${new Date().getFullYear()}-${currentMonth}`;
    const index = markedDates.findIndex((item) => {
      if (
        (item.absentDays &&
          JSON.stringify(item.absentDays).slice(2, 9).toString() ===
          currentYearWithMonth) ||
        (item.festivalAndHoliDays &&
          JSON.stringify(item.festivalAndHoliDays).slice(2, 9).toString() ===
          currentYearWithMonth) ||
        (item.halfDays &&
          JSON.stringify(item.halfDays).slice(2, 9).toString() ===
          currentYearWithMonth)
      ) {
        return true;
      }
      return false;
    });
    return index >= 0 ? index : -1;
  }

  function calenderView() {
    var markedDays =
      currentDataIndex >= 0 && currentDataIndex <= markedDates.length - 1
        ? {
          ...(markedDates[currentDataIndex].festivalAndHoliDays
            ? markedDates[currentDataIndex].festivalAndHoliDays
            : null),
          ...(markedDates[currentDataIndex].absentDays
            ? markedDates[currentDataIndex].absentDays
            : null),
          ...(markedDates[currentDataIndex].halfDays
            ? markedDates[currentDataIndex].halfDays
            : null),
        }
        : {};
    return (
      <View style={{ margin: Sizes.fixPadding * 2.0 }}>
        <Calendar
          hideExtraDays={true}
          disableMonthChange={true}
          firstDay={0}
          markedDates={markedDays}
          renderHeader={(date) => {
            return (
              <Text style={{ ...Fonts.blackColor18Medium }}>
                {date.toString().slice(4, 8)} {date.toString().slice(11, 16)}
              </Text>
            );
          }}
          theme={{
            textDayFontSize: 15,
            textDayHeaderFontSize: 14,
            textDayFontFamily: "Inter-Regular",
            textDayHeaderFontFamily: "Inter-Regular",
            arrowColor: Colors.blackColor,
            calendarBackground: "transparent",
            textSectionTitleColor: Colors.blackColor,
          }}
          onMonthChange={(month) => {
            const index = markedDates.findIndex((item) => {
              if (
                (item.absentDays &&
                  JSON.stringify(item.absentDays).slice(2, 9) ===
                  month.dateString.slice(0, 7)) ||
                (item.festivalAndHoliDays &&
                  JSON.stringify(item.festivalAndHoliDays).slice(2, 9) ===
                  month.dateString.slice(0, 7)) ||
                (item.halfDays &&
                  JSON.stringify(item.halfDays).slice(2, 9) ===
                  month.dateString.slice(0, 7))
              ) {
                return true;
              }
              return false;
            });
            setcurrentDataIndex(index);
          }}
          enableSwipeMonths={true}
        />
      </View>
    );
  }

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
          Attendance
        </Text>
      </View>
    );
  }
};

export default AttendanceScreen;

const styles = StyleSheet.create({
  headerWrapStyle: {
    marginVertical: Sizes.fixPadding * 3.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
    flexDirection: "row",
    alignItems: "center",
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
  countWrapStyle: {
    width: 32.0,
    height: 32.0,
    borderRadius: 16.0,
    alignItems: "center",
    justifyContent: "center",
  },
  infoWrapStyle: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    padding: Sizes.fixPadding,
  },
  indicatorStyle: {
    width: 32.0,
    borderTopLeftRadius: Sizes.fixPadding,
    borderBottomLeftRadius: Sizes.fixPadding,
    height: "100%",
    left: -1.0,
  },
  infoOuterWrapStyle: {
    borderWidth: 1.0,
    borderRadius: Sizes.fixPadding,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: Sizes.fixPadding * 2.0,
  },
});
