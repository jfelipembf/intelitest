import {
  StyleSheet,
  Text,
  View,
  BackHandler,
  ScrollView,
  ImageBackground,
  Dimensions,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import MyStatusBar from "../../components/myStatusBar";
import { useNavigation } from "expo-router";
import { useAuth } from "../../hooks/useAuth";



const { width } = Dimensions.get("window");

const HomeScreen = () => {

  const navigation = useNavigation();
  const { logout, userData, user } = useAuth();
  
  //
  const backAction = () => {
    backClickCount == 1 ? BackHandler.exitApp() : _spring();
    return true;
  };

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", backAction);
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", backAction);
      };
    }, [backAction])
  );

  function _spring() {
    setBackClickCount(1);
    setTimeout(() => {
      setBackClickCount(0);
    }, 1000);
  }

  const [backClickCount, setBackClickCount] = useState(0);
  const [showLogoutDialog, setshowLogoutDialog] = useState(false);

  const handleLogout = async () => {
    try {
      setshowLogoutDialog(false);
      const result = await logout();
      if (result.success) {
        navigation.replace("auth/loginScreen");
      }
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.primaryColor }}>
      <MyStatusBar />
      <ImageBackground
        source={require("../../assets/images/bgImage.png")}
        style={{ width: "100%", height: 250, flex: 1, }}
        resizeMode="stretch"
        tintColor={Colors.whiteColor}
      >
        <View style={{ marginTop: Sizes.fixPadding * 4.0 }} />
        {header()}
        <View style={styles.sheetStyle} />
        <View style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {attendanceAndFeesInfo()}
            {options()}
          </ScrollView>
        </View>
      </ImageBackground>
      {logoutDialog()}
      {exitInfo()}
    </View>
  );

  function exitInfo() {
    return backClickCount == 1 ? (
      <View style={[styles.exitInfoWrapStyle]}>
        <Text style={{ ...Fonts.whiteColor13Regular }}>
          Pressione voltar novamente para sair
        </Text>
      </View>
    ) : null;
  }

  function logoutDialog() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showLogoutDialog}
        onRequestClose={() => setshowLogoutDialog(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => { setshowLogoutDialog(false) }}
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <View style={{ justifyContent: "center", flex: 1 }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => { }}
              style={styles.dialogStyle}
            >
              <View>
                <Text style={{ ...Fonts.grayColor15Medium }}>
                  Tem certeza que deseja sair?
                </Text>
                <View
                  style={{
                    marginTop: Sizes.fixPadding * 2.5,
                    flexDirection: "row",
                    alignSelf: "flex-end",
                  }}
                >
                  <Text
                    onPress={() => {
                      setshowLogoutDialog(false);
                    }}
                    style={{ ...Fonts.secondaryColor17Bold }}
                  >
                    Não
                  </Text>
                  <Text
                    onPress={handleLogout}
                    style={{
                      ...Fonts.secondaryColor17Bold,
                      marginLeft: Sizes.fixPadding * 2.0,
                    }}
                  >
                    Sim
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }

  function options() {
    return (
      <View style={styles.optionsWrapStyle}>
        {optionSort({
          bgColor: Colors.lightPurpleColor,
          customIcon: (
            <View style={styles.customIconContainer}>
              <MaterialIcons name="campaign" size={40} color={Colors.purpleColor}/>
            </View>
          ),
          title: "Avisos",
          description: "Comunicados",
          onPress: () => {
            navigation.push("announcements/announcementsScreen");
          },
        })}
        {optionSort({
          bgColor: Colors.lightCreamColor,
          icon: require("../../assets/images/icons/assignment.png"),
          title: "Atividades",
          description: "Tarefas a fazer",
          onPress: () => {
            navigation.push("assignment/assignmentScreen");
          },
        })}
        {optionSort({
          bgColor: Colors.lightCyanColor,
          icon: require("../../assets/images/icons/timetable.png"),
          title: "Horários",
          description: "Agenda diária",
          onPress: () => {
            navigation.push("timeTable/timeTableScreen");
          },
        })}
        {optionSort({
          bgColor: Colors.lightCreamColor,
          icon: require("../../assets/images/icons/progressCard.png"),
          title: "Boletim",
          description: "Notas e desempenho",
          onPress: () => {
            navigation.push("progressCard/progressCardScreen");
          },
        })}
        {optionSort({
          bgColor: Colors.lightCyanColor,
          icon: require("../../assets/images/icons/gallery.png"),
          title: "Galeria da Escola",
          description: "Fotos e eventos",
          onPress: () => {
            navigation.push("schoolGallery/schoolGalleryScreen");
          },
        })}
        {optionSort({
          bgColor: Colors.lightPurpleColor,
          icon: require("../../assets/images/icons/doubt.png"),
          title: "Tirar Dúvidas",
          description: "Pergunte ao professor",
          onPress: () => {
            navigation.push("askDoubts/askDoubtsScreen");
          },
        })}
        {optionSort({
          bgColor: Colors.lightCreamColor,
          icon: require("../../assets/images/icons/faculties.png"),
          title: "Professores",
          description: "Lista de docentes",
          onPress: () => {
            navigation.push("faculties/facultiesScreen");
          },
        })}
        {optionSort({
          bgColor: Colors.lightCreamColor,
          icon: require("../../assets/images/icons/logout.png"),
          title: "Sair",
          description: "Encerrar sessão",
          onPress: () => {
            setshowLogoutDialog(true);
          },
        })}
      </View>
    );
  }

  function optionSort({ bgColor, icon, customIcon, title, description, onPress }) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={{ backgroundColor: bgColor, ...styles.singleOptionWrapStyle }}
      >
        {customIcon ? (
          customIcon
        ) : (
          <Image
            source={icon}
            style={{ width: 30.0, height: 30.0, resizeMode: "contain" }}
          />
        )}
        <Text
          numberOfLines={1}
          style={{
            marginTop: Sizes.fixPadding + 5.0,
            ...Fonts.blackColor16Medium,
          }}
        >
          {title}
        </Text>
        <Text numberOfLines={1} style={{ ...Fonts.grayColor13Regular }}>
          {description}
        </Text>
      </TouchableOpacity>
    );
  }

  function attendanceAndFeesInfo() {
    return (
      <View style={styles.attendanceAndFeeInfoWrapStyle}>
        {attendanceAndFeeInfoSort({
          title: "Frequência",
          value: "80.49%",
          bgColor: Colors.lightYellowColor,
          icon: require("../../assets/images/icons/attendance.png"),
          onPress: () => {
            navigation.push("attendance/attendanceScreen");
          },
        })}
        {attendanceAndFeeInfoSort({
          title: "Pontos",
          value: "1250",
          bgColor: Colors.lightPinkColor,
          icon: require("../../assets/images/icons/progressCard.png"),
          onPress: () => {
            navigation.push("progressCard/progressCardScreen");
          },
        })}
      </View>
    );
  }

  function attendanceAndFeeInfoSort({ title, value, bgColor, icon, onPress }) {
    return (
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={onPress}
        style={styles.attendanceAndFeesDetailWrapStyle}
      >
        <View
          style={{
            ...styles.attendanceAndFeesIconWrapStyle,
            backgroundColor: bgColor,
          }}
        >
          <Image
            source={icon}
            style={{
              width: width / 12.0,
              height: width / 12.0,
              resizeMode: "contain",
            }}
          />
        </View>
        <View
          style={{
            marginTop: Sizes.fixPadding * 2.0,
            marginBottom: Sizes.fixPadding - 5.0,
          }}
        >
          <Text style={{ ...Fonts.blackColor34BebasRegular }}>{value}</Text>
          <Text
            style={{
              marginTop: Sizes.fixPadding - 5.0,
              ...Fonts.grayColor16Medium,
            }}
          >
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  function header() {
    // Obter dados do usuário do context
    const userName = userData?.personalInfo?.name || "Estudante";
    const userClass = userData?.academicInfo?.class || "";
    const userGrade = userData?.academicInfo?.grade || "";
    const userRegistration = userData?.academicInfo?.registration || "N/A";
    const userProfileImage = userData?.personalInfo?.profileImage;
    
    return (
      <View style={styles.headerWrapStyle}>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation.push("studentProfile/studentProfileScreen");
            }}
          >
            {userProfileImage ? (
              <Image
                source={{ uri: userProfileImage }}
                style={styles.userImageStyle}
              />
            ) : (
              <Image
                source={require("../../assets/images/students/student1.png")}
                style={styles.userImageStyle}
              />
            )}
          </TouchableOpacity>
          <View style={{ flex: 1, marginHorizontal: Sizes.fixPadding * 2.0 }}>
            <Text numberOfLines={1} style={{ ...Fonts.whiteColor18SemiBold }}>
              Olá, {userName}
            </Text>
            <Text
              style={{
                marginTop: Sizes.fixPadding - 2.0,
                ...Fonts.whiteColor15Regular,
                color: "#ffffff60",
              }}
            >
              {userGrade} | Turma {userClass} | Nº: {userRegistration}
            </Text>
          </View>
        </View>
        <Ionicons
          name="notifications-outline"
          size={24}
          color={Colors.whiteColor}
          onPress={() => {
            navigation.push("notification/notificationScreen");
          }}
        />
      </View>
    );
  }
};

export default HomeScreen;

const styles = StyleSheet.create({
  headerWrapStyle: {
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginBottom: Sizes.fixPadding * 2.0,
    marginTop: Sizes.fixPadding,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userImageStyle: {
    width: 50.0,
    height: 50.0,
    borderRadius: 25.0,
    borderColor: Colors.whiteColor,
    borderWidth: 1.5,
  },
  sheetStyle: {
    backgroundColor: Colors.whiteColor,
    borderTopLeftRadius: Sizes.fixPadding * 2.0,
    borderTopRightRadius: Sizes.fixPadding * 2.0,
    position: "absolute",
    left: 0.0,
    right: 0.0,
    height: "100%",
    top: width / 1.7,
  },
  attendanceAndFeeInfoWrapStyle: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Sizes.fixPadding + 5.0,
    marginTop: Sizes.fixPadding * 2.0,
  },
  attendanceAndFeesDetailWrapStyle: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    borderColor: Colors.primaryColor,
    borderWidth: 1.0,
    padding: Sizes.fixPadding * 2.0,
    marginHorizontal: Sizes.fixPadding - 5.0,
  },
  attendanceAndFeesIconWrapStyle: {
    width: width / 5.5,
    height: width / 5.5,
    borderRadius: width / 5.5 / 2.0,
    alignItems: "center",
    justifyContent: "center",
  },
  optionsWrapStyle: {
    marginTop: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding + 5.0,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  singleOptionWrapStyle: {
    width: width / 2.0 - 25.0,
    borderRadius: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    paddingVertical: Sizes.fixPadding * 3.0,
    marginHorizontal: Sizes.fixPadding - 5.0,
    marginBottom: Sizes.fixPadding,
  },
  buttonStyle: {
    backgroundColor: Colors.secondaryColor,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Sizes.fixPadding * 3.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
    paddingVertical: Sizes.fixPadding + 5.0,
    marginBottom: Sizes.fixPadding * 2.0,
    elevation: 1.0,
    ...CommonStyles.buttonShadow,
    borderColor: "#FFAB1B95",
    borderWidth: 1.0,
  },
  exitInfoWrapStyle: {
    backgroundColor: Colors.blackColor,
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    borderRadius: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding,
    justifyContent: "center",
    alignItems: "center",
  },
  dialogStyle: {
    backgroundColor: Colors.whiteColor,
    alignSelf: 'center',
    padding: Sizes.fixPadding * 2.0,
    width: "90%",
    borderRadius: Sizes.fixPadding - 5.0,
  },
  customIconContainer: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
