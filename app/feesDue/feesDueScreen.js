import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  FlatList,
} from "react-native";
import React from "react";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import { MaterialIcons } from "@expo/vector-icons";
import MyStatusBar from "../../components/myStatusBar";
import { useNavigation } from "expo-router";

const notPayableReceiptsList = [
  {
    id: "1",
    receiptNo: "#145879",
    month: "November - January",
    lastDayToPay: "17 Dec 2020",
    totalAmount: "₹6500",
  },
];

const payableReceiptsList = [
  {
    id: "1",
    receiptNo: "#145879",
    month: "August - October",
    paymentDate: "12 Sep 2020",
    paymentMode: "Cash on Counter",
    totalAmount: "₹6500",
  },
  {
    id: "2",
    receiptNo: "#145879",
    month: "May - July",
    paymentDate: "12 May 2020",
    paymentMode: "Cash on Counter",
    totalAmount: "₹6500",
  },
];

const FeesDueScreen = () => {

  const navigation = useNavigation();

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
          <FlatList
            ListHeaderComponent={
              <>
                {notPayableReceipts()}
                {payableReceipts()}
              </>
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: Sizes.fixPadding * 2.0 }}
          />
        </View>
      </ImageBackground>
    </View>
  );

  function payableReceipts() {
    const renderItem = ({ item }) => (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginBottom: Sizes.fixPadding * 2.0,
        }}
      >
        <View style={styles.infoWrapStyle}>
          <View style={{ ...styles.rowAlignCenterSpaceBetween }}>
            <Text style={{ flex: 1, ...Fonts.grayColor13Regular }}>
              Receipt No:
            </Text>
            <Text style={{ ...Fonts.blackColor13Medium }}>
              {item.receiptNo}
            </Text>
          </View>
          {divider()}
          <View style={{ ...styles.rowAlignCenterSpaceBetween }}>
            <Text style={{ flex: 1, ...Fonts.grayColor13Regular }}>Month</Text>
            <Text style={{ ...Fonts.blackColor13Medium }}>{item.month}</Text>
          </View>
          <View
            style={{
              marginVertical: Sizes.fixPadding + 2.0,
              ...styles.rowAlignCenterSpaceBetween,
            }}
          >
            <Text style={{ flex: 1, ...Fonts.grayColor13Regular }}>
              Payment Date
            </Text>
            <Text style={{ ...Fonts.blackColor13Medium }}>
              {item.paymentDate}
            </Text>
          </View>
          <View style={{ ...styles.rowAlignCenterSpaceBetween }}>
            <Text style={{ flex: 1, ...Fonts.grayColor13Regular }}>
              Payment Mode
            </Text>
            <Text style={{ ...Fonts.blackColor13Medium }}>
              {item.paymentMode}
            </Text>
          </View>
          {divider()}
          <View style={{ ...styles.rowAlignCenterSpaceBetween }}>
            <Text style={{ flex: 1, ...Fonts.grayColor13Regular }}>
              Total Amount:
            </Text>
            <Text style={{ ...Fonts.blackColor13Medium }}>
              {item.totalAmount}
            </Text>
          </View>
        </View>
        <View style={styles.buttonStyle}>
          <Text style={{ ...Fonts.whiteColor16Bold }}>Download</Text>
        </View>
      </View>
    );
    return (
      <FlatList
        listKey="payable"
        data={payableReceiptsList}
        keyExtractor={(item) => `${item.id}`}
        renderItem={renderItem}
        scrollEnabled={false}
      />
    );
  }

  function notPayableReceipts() {
    const renderItem = ({ item }) => (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginBottom: Sizes.fixPadding * 2.0,
        }}
      >
        <View style={styles.infoWrapStyle}>
          <View style={{ ...styles.rowAlignCenterSpaceBetween }}>
            <Text style={{ flex: 1, ...Fonts.grayColor13Regular }}>
              Receipt No:
            </Text>
            <Text style={{ ...Fonts.blackColor13Medium }}>
              {item.receiptNo}
            </Text>
          </View>
          {divider()}
          <View style={{ ...styles.rowAlignCenterSpaceBetween }}>
            <Text style={{ flex: 1, ...Fonts.grayColor13Regular }}>Month</Text>
            <Text style={{ ...Fonts.blackColor13Medium }}>{item.month}</Text>
          </View>
          <View
            style={{
              marginTop: Sizes.fixPadding + 2.0,
              ...styles.rowAlignCenterSpaceBetween,
            }}
          >
            <Text style={{ flex: 1, ...Fonts.grayColor13Regular }}>
              Last Date to Pay
            </Text>
            <Text style={{ ...Fonts.blackColor13Medium }}>
              {item.lastDayToPay}
            </Text>
          </View>
          {divider()}
          <View style={{ ...styles.rowAlignCenterSpaceBetween }}>
            <Text style={{ flex: 1, ...Fonts.grayColor13Regular }}>
              Total Amount:
            </Text>
            <Text style={{ ...Fonts.blackColor13Medium }}>
              {item.totalAmount}
            </Text>
          </View>
        </View>
        <View style={styles.buttonStyle}>
          <Text style={{ ...Fonts.whiteColor16Bold }}>Pay Now</Text>
        </View>
      </View>
    );
    return (
      <FlatList
        listKey="notPayable"
        data={notPayableReceiptsList}
        keyExtractor={(item) => `${item.id}`}
        renderItem={renderItem}
        scrollEnabled={false}
      />
    );
  }

  function divider() {
    return (
      <View
        style={{
          backgroundColor: Colors.lightGrayColor,
          height: 1.0,
          marginVertical: Sizes.fixPadding * 2.0,
        }}
      />
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
          Fees Due
        </Text>
      </View>
    );
  }
};

export default FeesDueScreen;

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
  rowAlignCenterSpaceBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonStyle: {
    backgroundColor: Colors.secondaryColor,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: Sizes.fixPadding,
    borderBottomRightRadius: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding + 3.0,
    top: -1.0,
  },
  infoWrapStyle: {
    backgroundColor: Colors.whiteColor,
    borderColor: Colors.lightGrayColor,
    borderTopLeftRadius: Sizes.fixPadding,
    borderTopRightRadius: Sizes.fixPadding,
    borderWidth: 1.0,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding * 2.0,
  },
});
