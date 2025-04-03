import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import MyStatusBar from "../../components/myStatusBar";
import { useNavigation } from "expo-router";
import DateTimePicker from 'react-native-ui-datepicker';
import moment from "moment";

const LeaveApplicationScreen = () => {

  const navigation = useNavigation();

  const [teacherName, setTeacherName] = useState("");
  const [applicationTitle, setApplicationTitle] = useState("");
  const [fromDate, setFromDate] = useState(moment().format('YYYY-MM-DD'));
  const [toDate, setToDate] = useState(moment().format('YYYY-MM-DD'));
  const [description, setDescription] = useState("");
  const [showRangeCalendar, setShowRangeCalendar] = useState(false);

  const [finalFromToDate, setFinalFromToDate] = useState();

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
            automaticallyAdjustKeyboardInsets={true}
            showsVerticalScrollIndicator={false}
          >
            {nameOfClassTeacherInfo()}
            {applicationTitleInfo()}
            {fromToDateInfo()}
            {descriptionInfo()}
            {applyButton()}
          </ScrollView>
        </View>
        {dateRangeSheet()}
      </ImageBackground>
    </View>
  );

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  function dateRangeSheet() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showRangeCalendar}
        onRequestClose={() => { setShowRangeCalendar(false) }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => { setShowRangeCalendar(false) }}
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <View style={{ justifyContent: "flex-end", flex: 1 }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => { }}
              style={styles.sheetWrapStyle}
            >              
              <DateTimePicker
                mode="range"
                locale="en"
                minDate={moment().format('YYYY-MM-DD')}
                height={280}
                startDate={fromDate}
                endDate={toDate}
                onChange={({ startDate, endDate }) => {
                  setFromDate(startDate);
                  setToDate(endDate);
                }}
                displayFullDays={true}
                headerButtonsPosition="around"
                selectedItemColor={Colors.primaryColor}
                headerTextStyle={{ ...Fonts.blackColor15Medium }}
                timePickerDecelerationRate="fast"
                dayContainerStyle={{ margin: 0 }}
                selectedTextStyle={{ ...Fonts.whiteColor14Medium }}
                todayTextStyle={{ ...Fonts.secondaryColor14Medium }}
                todayContainerStyle={{ borderWidth: null }}
                calendarTextStyle={{ ...Fonts.blackColor14Medium }}
              />
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginHorizontal: Sizes.fixPadding * 2.0 }}>
                <Text onPress={() => { setShowRangeCalendar(false) }} style={{ ...Fonts.grayColor16Medium }}>
                  Cancel
                </Text>
                <Text
                  onPress={() => {
                    setFinalFromToDate(`${(formatDate(fromDate)) + ' - ' + formatDate(toDate)}`);
                    setShowRangeCalendar(false);
                  }}
                  style={{ ...Fonts.secondaryColor16SemiBold, marginLeft: Sizes.fixPadding + 5.0 }}
                >
                  Ok
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    )
  }

  function applyButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigation.pop();
        }}
        style={styles.buttonStyle}
      >
        <Text style={{ ...Fonts.whiteColor17Bold }}>Apply</Text>
      </TouchableOpacity>
    );
  }

  function descriptionInfo() {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
        <Text numberOfLines={1} style={{ ...Fonts.grayColor13Regular }}>
          Description
        </Text>
        <TextInput
          placeholder="Ex. I have very strong ...."
          placeholderTextColor={Colors.grayColor}
          value={description}
          onChangeText={(value) => {
            setDescription(value);
          }}
          cursorColor={Colors.primaryColor}
          selectionColor={Colors.primaryColor}
          style={styles.textFieldStyle}
          numberOfLines={1}
        />
      </View>
    );
  }

  function fromToDateInfo() {
    return (
      <View style={{ marginVertical: Sizes.fixPadding * 2.0 }}>
        <Text
          numberOfLines={1}
          style={{
            marginHorizontal: Sizes.fixPadding * 2.0,
            ...Fonts.grayColor13Regular,
          }}
        >
          From - To
        </Text>
        <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => { setShowRangeCalendar(true) }}
            style={{ alignItems: "center", flexDirection: 'row' }}
          >
            <Text style={{ ...finalFromToDate ? { ...Fonts.blackColor14Medium } : { ...Fonts.grayColor14Medium }, flex: 1, }}>
              {finalFromToDate ? finalFromToDate : 'Ex. 12 Dec 2024 - 15 Jan 2025'}
            </Text>
            <MaterialCommunityIcons
              name="calendar-month-outline"
              size={22}
              color={Colors.primaryColor}
              style={{}}
            />
          </TouchableOpacity>
          <View
            style={{ backgroundColor: Colors.lightGrayColor, height: 1.0 }}
          />
        </View>
      </View>
    );
  }

  function applicationTitleInfo() {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
        <Text numberOfLines={1} style={{ ...Fonts.grayColor13Regular }}>
          Application Title
        </Text>
        <TextInput
          placeholder="Ex. Fever"
          placeholderTextColor={Colors.grayColor}
          value={applicationTitle}
          onChangeText={(value) => {
            setApplicationTitle(value);
          }}
          cursorColor={Colors.primaryColor}
          selectionColor={Colors.primaryColor}
          style={styles.textFieldStyle}
          numberOfLines={1}
        />
      </View>
    );
  }

  function nameOfClassTeacherInfo() {
    return (
      <View style={{ margin: Sizes.fixPadding * 2.0 }}>
        <Text numberOfLines={1} style={{ ...Fonts.grayColor13Regular }}>
          Name of Class Teacher
        </Text>
        <TextInput
          placeholder="Ex. Kathryn Murphy"
          placeholderTextColor={Colors.grayColor}
          value={teacherName}
          onChangeText={(value) => {
            setTeacherName(value);
          }}
          cursorColor={Colors.primaryColor}
          selectionColor={Colors.primaryColor}
          style={styles.textFieldStyle}
          numberOfLines={1}
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
          onPress={() => {
            navigation.pop();
          }}
        />
        <Text
          style={{
            marginLeft: Sizes.fixPadding * 2.0,
            ...Fonts.whiteColor18SemiBold,
          }}
        >
          Leave Application
        </Text>
      </View>
    );
  }
};

export default LeaveApplicationScreen;

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
  textFieldStyle: {
    paddingBottom: Sizes.fixPadding - 5.0,
    ...Fonts.blackColor14Medium,
    borderBottomColor: Colors.lightGrayColor,
    borderBottomWidth: 1.0,
    padding: 0,
  },
  calenderOkButtonStyle: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: Sizes.fixPadding + 3.0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Sizes.fixPadding * 3.0,
    elevation: 1.0,
    shadowColor: Colors.primaryColor,
  },
  buttonStyle: {
    backgroundColor: Colors.secondaryColor,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Sizes.fixPadding + 5.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginTop: Sizes.fixPadding * 4.0,
    marginBottom: Sizes.fixPadding * 2.0,
    borderRadius: Sizes.fixPadding * 3.0,
    elevation: 1.0,
    ...CommonStyles.buttonShadow,
    borderColor: "#FFAB1B95",
    borderWidth: 1.0,
  },
  sheetWrapStyle: {
    backgroundColor: Colors.whiteColor,
    borderTopLeftRadius: Sizes.fixPadding,
    borderTopRightRadius: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding
  }
});
