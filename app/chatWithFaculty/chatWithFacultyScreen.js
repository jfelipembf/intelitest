import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import { MaterialIcons } from "@expo/vector-icons";
import { Flow } from "react-native-animated-spinkit";
import MyStatusBar from "../../components/myStatusBar";
import { useNavigation } from "expo-router";

const ChatWithFacultyScreen = () => {

  const navigation = useNavigation();

  const userMessages = [
    {
      id: "1",
      message: "Lorem ipsum dolor sit amet",
      isSender: true,
      messageTime: "3:25 PM",
    },
    {
      id: "2",
      message: "Enim eleifend orci congue eget.In non eu odio dis metus.",
      isSender: true,
      messageTime: "3:25 PM",
    },
    {
      id: "3",
      message: "Dolor netus leo maecenas ipsum.",
      isSender: false,
      messageTime: "3:26 PM",
    },
    {
      id: "4",
      message:
        "pellentesque in sollicitudin. Ullamcorper faucibus gravida fermentum felis amet.",
      isSender: false,
      messageTime: "3:26 PM",
    },
  ];

  const [messagesList, setMessagesList] = useState(userMessages);

  return (
    <View style={{ flex: 1 }}>
      <MyStatusBar />
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'height' : null}
        style={{ flex: 1, backgroundColor: Colors.primaryColor }}
      >
        <ImageBackground
          source={require("../../assets/images/bgImage.png")}
          style={{ width: "100%", height: 250, flex: 1 }}
          resizeMode="stretch"
          tintColor={Colors.whiteColor}
        >
          {header()}
          <View style={styles.sheetStyle}>
            {messages()}
          </View>
          {typeMessage()}
        </ImageBackground>
      </KeyboardAvoidingView>
    </View>
  );

  function typingIndicator() {
    return (
      <Flow
        size={48}
        color={Colors.secondaryColor}
        style={{
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginBottom: Sizes.fixPadding * 2.0,
          marginTop: -(Sizes.fixPadding * 2.0),
        }}
      />
    );
  }

  function messages() {
    const renderItem = ({ item, index }) => {
      return (
        <View
          style={{
            marginHorizontal: Sizes.fixPadding * 2.0,
            alignItems: item.isSender == true ? "flex-end" : "flex-start",
            marginBottom: Sizes.fixPadding,
          }}
        >
          <View
            style={{
              ...styles.messageWrapStyle,
              backgroundColor: item.isSender
                ? Colors.secondaryColor
                : "#F0F0F0",
              borderBottomRightRadius: item.isSender ? 0.0 : Sizes.fixPadding,
              borderBottomLeftRadius: item.isSender ? Sizes.fixPadding : 0.0,
            }}
          >
            <Text
              style={{
                ...(item.isSender
                  ? { ...Fonts.whiteColor15Regular }
                  : { ...Fonts.blackColor15Regular }),
              }}
            >
              {item.message}
            </Text>
          </View>
          {index !== messagesList.length - 1 ? (
            messagesList[index + 1].isSender == item.isSender ? (
              messagesList[index + 1].messageTime == item.messageTime ? null : (
                <Text style={styles.messageTimeTextStyle}>
                  {item.messageTime}
                </Text>
              )
            ) : (
              <Text style={styles.messageTimeTextStyle}>
                {item.messageTime}
              </Text>
            )
          ) : (
            <Text style={styles.messageTimeTextStyle}>{item.messageTime}</Text>
          )}
        </View>
      );
    };
    return (
      <View style={{ paddingBottom: Sizes.fixPadding * 8.0, }}>
        <FlatList
          inverted
          data={messagesList}
          keyExtractor={(item) => `${item.id}`}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexDirection: "column-reverse",
            paddingBottom: Sizes.fixPadding * 2.0,
          }}
          ListFooterComponent={<>{typingIndicator()}</>}
          automaticallyAdjustKeyboardInsets={true}
        />
      </View>
    );
  }

  function addMessage({ message }) {
    const oldMessages = messagesList;

    let date = Date();
    let hour = new Date(date).getHours();
    let minute = new Date(date).getMinutes();
    let AmPm = hour >= 12 ? "pm" : "am";
    let finalhour = hour > 12 ? hour - 12 : hour;
    let displayHour =
      finalhour.toString().length == 1 ? `0${finalhour}` : finalhour;
    let displayMinute = minute.toString().length == 1 ? `0${minute}` : minute;

    const newMessage = {
      id: messagesList.length + 1,
      message: message,
      messageTime: `${displayHour}:${displayMinute} ${AmPm}`,
      isSender: true,
    };

    oldMessages.push(newMessage);
    setMessagesList(oldMessages);
  }

  function typeMessage() {
    const [message, setMessage] = useState("");
    return (
      <View style={styles.typeMessageWrapStyle}>
        <MaterialIcons name="mic" size={16} color={Colors.grayColor} />
        <TextInput
          cursorColor={Colors.primaryColor}
          selectionColor={Colors.primaryColor}
          value={message}
          onChangeText={setMessage}
          placeholder="Type Something..."
          style={{
            padding: 0,
            flex: 1,
            ...Fonts.blackColor13Regular,
            marginHorizontal: Sizes.fixPadding,
          }}
          placeholderTextColor={Colors.grayColor}
        />
        <MaterialIcons
          name="insert-emoticon"
          size={16}
          color={Colors.grayColor}
        />
        <MaterialIcons
          name="attach-file"
          size={16}
          color={Colors.grayColor}
          style={{ marginHorizontal: Sizes.fixPadding }}
        />
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            if (message != "") {
              addMessage({ message: message });
              setMessage("");
            }
          }}
          style={styles.sendIconWrapStyle}
        >
          <MaterialIcons
            name="send"
            size={20}
            color={Colors.whiteColor}
            style={{ marginLeft: Sizes.fixPadding - 5.0 }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  function header() {
    return (
      <View style={styles.headerWrapStyle}>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={Colors.whiteColor}
            onPress={() => { navigation.pop() }}
          />
          <Image
            source={require("../../assets/images/faculties/faculty1.png")}
            style={styles.userImageStyle}
          />
          <View style={{ flex: 1 }}>
            <Text numberOfLines={1} style={{ ...Fonts.whiteColor16SemiBold }}>
              Leslie Alexandar
            </Text>
            <Text style={{ ...Fonts.whiteColor13Medium }}>Online</Text>
          </View>
        </View>
        <MaterialIcons name="more-vert" color={Colors.whiteColor} size={24} />
      </View>
    );
  }
};

export default ChatWithFacultyScreen;

const styles = StyleSheet.create({
  headerWrapStyle: {
    marginVertical: Sizes.fixPadding * 3.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sheetStyle: {
    backgroundColor: Colors.whiteColor,
    borderTopLeftRadius: Sizes.fixPadding * 2.0,
    borderTopRightRadius: Sizes.fixPadding * 2.0,
    flex: 1,
    overflow: "hidden",
    paddingBottom: Sizes.fixPadding * 2.0,
  },
  userImageStyle: {
    width: 35.0,
    height: 35.0,
    borderRadius: 17.5,
    marginHorizontal: Sizes.fixPadding + 5.0,
  },
  typeMessageWrapStyle: {
    position: "absolute",
    bottom: 0,
    left: 0.0,
    right: 0.0,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.whiteColor,
    borderColor: Colors.lightGrayColor,
    borderWidth: 1.0,
    borderRadius: Sizes.fixPadding,
    margin: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding + 2.0,
  },
  messageWrapStyle: {
    paddingVertical: Sizes.fixPadding + 2.0,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    borderRadius: Sizes.fixPadding,
  },
  messageTimeTextStyle: {
    marginBottom: Sizes.fixPadding * 2.0,
    marginTop: Sizes.fixPadding - 5.0,
    ...Fonts.grayColor13Regular,
  },
  sendIconWrapStyle: {
    width: 36.0,
    height: 36.0,
    borderRadius: 18.0,
    backgroundColor: Colors.primaryColor,
    alignItems: "center",
    justifyContent: "center",
  },
});
