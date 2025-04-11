import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  TextInput,
  ScrollView,
  Platform
} from "react-native";
import React, { useState } from "react";
import { Colors, Fonts, Sizes, CommonStyles, } from "../../constants/styles";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { Menu } from "react-native-material-menu";
import MyStatusBar from "../../components/myStatusBar";
import { useNavigation } from "expo-router";

const { height, width } = Dimensions.get("window");

const teachersList = [
  "Kathryn Murphy",
  "Jane Cooper",
  "Leslie Alexander",
  "Brooklyn Simmons",
  "Jacob Jones",
  "Courtney Henry",
];

const subjectsList = [
  "Matemática",
  "Português",
  "Economia",
  "Contabilidade",
  "Ciências",
  "Informática",
];

const AskDoubtsScreen = () => {

  const navigation = useNavigation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showTeachersMenu, setShowTeachersMenu] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [showSubjectsMenu, setShowSubjectsMenu] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");

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
            {teacherInfo()}
            {subjectInfo()}
            {titleInfo()}
            {descriptionInfo()}
            {sendButton()}
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );

  function subjectInfo() {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginBottom: Sizes.fixPadding * 2.0 }}>
        <Text
          numberOfLines={1}
          style={{
            marginBottom: Sizes.fixPadding,
            ...Fonts.grayColor13Regular,
          }}
        >
          Selecione a Disciplina
        </Text>
        <Menu
          visible={showSubjectsMenu}
          anchor={
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setShowSubjectsMenu(true);
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  flex: 1,
                  ...(selectedSubject
                    ? { ...Fonts.blackColor14Medium }
                    : { ...Fonts.grayColor14Regular }),
                }}
              >
                {selectedSubject ? selectedSubject : "Selecione a Disciplina"}
              </Text>
              <Feather
                name="chevron-down"
                size={22}
                color={Colors.primaryColor}
              />
            </TouchableOpacity>
          }
          onRequestClose={() => setShowSubjectsMenu(false)}
        >
          <View style={{ width: width - 45, maxHeight: height - 100 }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View
                style={{
                  marginHorizontal: Sizes.fixPadding * 2.0,
                  marginVertical: Sizes.fixPadding,
                }}
              >
                {subjectsList.map((item, index) => (
                  <Text
                    key={`${index}`}
                    onPress={() => {
                      setSelectedSubject(item), setShowSubjectsMenu(false);
                    }}
                    style={{
                      ...Fonts.primaryColor14Medium,
                      marginVertical: Sizes.fixPadding,
                    }}
                  >
                    {item}
                  </Text>
                ))}
              </View>
            </ScrollView>
          </View>
        </Menu>
        <View
          style={{
            backgroundColor: Colors.lightGrayColor,
            height: 1.0,
            marginTop: Sizes.fixPadding - 5.0,
          }}
        />
      </View>
    );
  }

  function teacherInfo() {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginBottom: Sizes.fixPadding * 2.0, marginTop: Sizes.fixPadding }}>
        <Text
          numberOfLines={1}
          style={{
            marginBottom: Sizes.fixPadding,
            ...Fonts.grayColor13Regular,
          }}
        >
          Selecione o Professor
        </Text>
        <Menu
          visible={showTeachersMenu}
          anchor={
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setShowTeachersMenu(true);
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  flex: 1,
                  ...(selectedTeacher
                    ? { ...Fonts.blackColor14Medium }
                    : { ...Fonts.grayColor14Regular }),
                }}
              >
                {selectedTeacher ? selectedTeacher : "Selecione o Professor"}
              </Text>
              <Feather
                name="chevron-down"
                size={22}
                color={Colors.primaryColor}
              />
            </TouchableOpacity>
          }
          onRequestClose={() => setShowTeachersMenu(false)}
        >
          <View style={{ width: width - 45, maxHeight: height - 100 }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View
                style={{
                  marginHorizontal: Sizes.fixPadding * 2.0,
                  marginVertical: Sizes.fixPadding,
                }}
              >
                {teachersList.map((item, index) => (
                  <Text
                    key={`${index}`}
                    onPress={() => {
                      setSelectedTeacher(item), setShowTeachersMenu(false);
                    }}
                    style={{
                      ...Fonts.primaryColor14Medium,
                      marginVertical: Sizes.fixPadding,
                    }}
                  >
                    {item}
                  </Text>
                ))}
              </View>
            </ScrollView>
          </View>
        </Menu>
        <View
          style={{
            backgroundColor: Colors.lightGrayColor,
            height: 1.0,
            marginTop: Sizes.fixPadding - 5.0,
          }}
        />
      </View>
    );
  }

  function sendButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigation.pop();
        }}
        style={styles.buttonStyle}
      >
        <Text style={{ ...Fonts.whiteColor17Bold }}>Enviar</Text>
      </TouchableOpacity>
    );
  }

  function descriptionInfo() {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginBottom: Sizes.fixPadding * 2.0 }}>
        <Text 
          numberOfLines={1} 
          style={{ 
            ...Fonts.grayColor13Regular,
            marginBottom: Sizes.fixPadding,
          }}
        >
          Descrição
        </Text>
        <TextInput
          placeholder="Ex. Qual é o cenário..."
          placeholderTextColor={Colors.grayColor}
          value={description}
          onChangeText={(value) => {
            setDescription(value);
          }}
          cursorColor={Colors.primaryColor}
          selectionColor={Colors.primaryColor}
          multiline={true}
          numberOfLines={3}
          style={[styles.textFieldStyle, { minHeight: 80, textAlignVertical: 'top' }]}
        />
      </View>
    );
  }

  function titleInfo() {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginBottom: Sizes.fixPadding * 2.0 }}>
        <Text 
          numberOfLines={1} 
          style={{ 
            ...Fonts.grayColor13Regular,
            marginBottom: Sizes.fixPadding,
          }}
        >
          Título
        </Text>
        <TextInput
          placeholder="Ex. Estatística para Economia"
          placeholderTextColor={Colors.grayColor}
          value={title}
          onChangeText={(value) => {
            setTitle(value);
          }}
          cursorColor={Colors.primaryColor}
          selectionColor={Colors.primaryColor}
          style={styles.textFieldStyle}
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
          Tirar Dúvidas
        </Text>
      </View>
    );
  }
};

export default AskDoubtsScreen;

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
    paddingTop: Sizes.fixPadding * 2.0,
  },
  textFieldStyle: {
    ...Fonts.blackColor14Medium,
    borderBottomColor: Colors.lightGrayColor,
    borderBottomWidth: 1.0,
    paddingHorizontal: 0,
    paddingVertical: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding,
  },
  buttonStyle: {
    backgroundColor: Colors.secondaryColor,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Sizes.fixPadding + 5.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginTop: Sizes.fixPadding * 3.0,
    marginBottom: Sizes.fixPadding * 2.0,
    borderRadius: Sizes.fixPadding * 3.0,
    elevation: 1.0,
    ...CommonStyles.buttonShadow,
    borderColor: "#FFAB1B95",
    borderWidth: 1.0,
  },
});
