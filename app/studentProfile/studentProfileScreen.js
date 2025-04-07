import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
import {
  MaterialIcons,
  Entypo,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import MyStatusBar from "../../components/myStatusBar";
import { useNavigation } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import { studentData as mockStudentData } from "../../constants/mockData";

const monthsList = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

const StudentProfileScreen = () => {

  const navigation = useNavigation();
  const { userData, refreshUserData } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    refreshAllData();
  }, []);
  
  const refreshAllData = async () => {
    setRefreshing(true);
    setRefreshing(false);
  };
  
  useEffect(() => {
  }, [userData]);

  const formatBirthDate = (birthDateString) => {
    if (!birthDateString) return "";
    
    if (birthDateString.includes('-')) {
      const [year, month, day] = birthDateString.split('-');
      return `${day} ${monthsList[parseInt(month)-1]} ${year}`;
    }
    
    return birthDateString;
  };

  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarFor, setCalendarFor] = useState("");

  const studentName = userData?.personalInfo?.name || mockStudentData?.name || "Estudante";
  const studentClass = userData?.academicInfo?.class || mockStudentData?.class || "A";
  const studentGrade = userData?.academicInfo?.grade || mockStudentData?.grade || "9º Ano";
  const studentCPF = userData?.personalInfo?.cpf || "";
  const studentRegistration = userData?.academicInfo?.registration || mockStudentData?.rollNumber || "";
  const studentBirthDate = formatBirthDate(userData?.personalInfo?.birthDate || mockStudentData?.birthDate) || "";
  const studentEmail = userData?.personalInfo?.email || mockStudentData?.contactInfo?.email || "";
  const studentPhone = userData?.personalInfo?.phone || mockStudentData?.contactInfo?.phone || "";
  const academicYear = "2023-2024";
  
  const guardianName = userData?.guardian?.name || mockStudentData?.parentInfo?.name || "";
  const guardianEmail = userData?.guardian?.email || mockStudentData?.parentInfo?.email || "";
  
  const fullAddress = userData?.address?.street && userData?.address?.city ? 
    `${userData?.address?.street}, ${userData?.address?.number} - ${userData?.address?.neighborhood}, ${userData?.address?.city}/${userData?.address?.state}` : 
    mockStudentData?.contactInfo?.address || "";

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
            {profileInfo()}
            {adharNoAndAcademicYearInfo()}
            {admissionClassAndOldAdmissionNoInfo()}
            {dateOfAdmissionAndBirthInfo()}
            {calendar()}
            {parentMailIdInfo()}
            {motherNameInfo()}
            {fatherNameInfo()}
            {addressInfo()}
          </ScrollView>
        </View>
      </ImageBackground>
      {changeProfilePicOptionsSheet()}
    </View>
  );

  function changeProfilePicOptionsSheet() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showBottomSheet}
        onRequestClose={() => {
          setShowBottomSheet(false)
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            setShowBottomSheet(false);
          }}
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <View style={{ justifyContent: "flex-end", flex: 1 }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => { }}
              style={{ backgroundColor: Colors.whiteColor }}
            >
              <View style={styles.bottomSheetStyle}>
                <Text style={{ ...Fonts.blackColor18SemiBold }}>Escolher Opção</Text>
                <View style={{ marginTop: Sizes.fixPadding * 2.0, flexDirection: "row" }}>
                  {changeProfilePicOptionsSort({
                    bgColor: "#009688",
                    icon: (
                      <Entypo name="camera" size={22} color={Colors.whiteColor} />
                    ),
                    option: "Câmera",
                  })}
                  <View style={{ marginHorizontal: Sizes.fixPadding * 3.0 }}>
                    {changeProfilePicOptionsSort({
                      bgColor: "#00A7F7",
                      icon: (
                        <MaterialCommunityIcons
                          name="image"
                          size={24}
                          color={Colors.whiteColor}
                        />
                      ),
                      option: "Galeria",
                    })}
                  </View>
                  {changeProfilePicOptionsSort({
                    bgColor: "#DD5A5A",
                    icon: (
                      <MaterialCommunityIcons
                        name="delete"
                        size={24}
                        color={Colors.whiteColor}
                      />
                    ),
                    option: "Remover\nfoto",
                  })}
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }

  function changeProfilePicOptionsSort({ bgColor, icon, option }) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => { setShowBottomSheet(false) }}
        style={{ alignItems: 'center' }}
      >
        <View
          style={{
            ...styles.changeProfilePicOptionsIconWrapStyle,
            backgroundColor: bgColor,
          }}
        >
          {icon}
        </View>
        <Text
          style={{
            marginTop: Sizes.fixPadding - 5.0,
            ...Fonts.grayColor13Regular,
          }}
        >
          {option}
        </Text>
      </TouchableOpacity>
    );
  }

  function addressInfo() {
    return (
      <View style={{ margin: Sizes.fixPadding * 2.0 }}>
        <Text numberOfLines={1} style={{ ...Fonts.grayColor13Regular }}>
          Endereço Permanente
        </Text>
        <Text style={styles.readOnlyFieldStyle}>
          {fullAddress || "-"}
        </Text>
      </View>
    );
  }

  function fatherNameInfo() {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
        <Text numberOfLines={1} style={{ ...Fonts.grayColor13Regular }}>
          Nome do Responsável
        </Text>
        <Text style={styles.readOnlyFieldStyle}>
          {guardianName || "-"}
        </Text>
      </View>
    );
  }

  function motherNameInfo() {
    return (
      <View style={{ margin: Sizes.fixPadding * 2.0 }}>
        <Text numberOfLines={1} style={{ ...Fonts.grayColor13Regular }}>
          Telefone do Responsável
        </Text>
        <Text style={styles.readOnlyFieldStyle}>
          {userData?.guardian?.phone || "-"}
        </Text>
      </View>
    );
  }

  function parentMailIdInfo() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginTop: Sizes.fixPadding,
        }}
      >
        <Text numberOfLines={1} style={{ ...Fonts.grayColor13Regular }}>
          E-mail do Responsável
        </Text>
        <Text style={styles.readOnlyFieldStyle}>
          {guardianEmail || "-"}
        </Text>
      </View>
    );
  }

  function calendar() {
    return null;
  }

  function dateOfAdmissionAndBirthInfo() {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          margin: Sizes.fixPadding,
        }}
      >
        <View style={{ flex: 1, marginHorizontal: Sizes.fixPadding }}>
          <Text numberOfLines={1} style={{ ...Fonts.grayColor13Regular }}>
            Telefone
          </Text>
          <Text style={styles.readOnlyFieldStyle}>
            {studentPhone || "-"}
          </Text>
        </View>
        <View style={{ flex: 1, marginHorizontal: Sizes.fixPadding }}>
          <Text numberOfLines={1} style={{ ...Fonts.grayColor13Regular }}>
            Data de Nascimento
          </Text>
          <Text style={styles.readOnlyFieldStyle}>
            {studentBirthDate || "-"}
          </Text>
        </View>
      </View>
    );
  }

  function admissionClassAndOldAdmissionNoInfo() {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          margin: Sizes.fixPadding,
        }}
      >
        <View style={{ flex: 1, marginHorizontal: Sizes.fixPadding }}>
          <Text numberOfLines={1} style={{ ...Fonts.grayColor13Regular }}>
            Série
          </Text>
          <Text style={styles.readOnlyFieldStyle}>
            {studentGrade || "-"}
          </Text>
        </View>
        <View style={{ flex: 1, marginHorizontal: Sizes.fixPadding }}>
          <Text numberOfLines={1} style={{ ...Fonts.grayColor13Regular }}>
            Matrícula
          </Text>
          <Text style={styles.readOnlyFieldStyle}>
            {studentRegistration || "-"}
          </Text>
        </View>
      </View>
    );
  }

  function adharNoAndAcademicYearInfo() {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: Sizes.fixPadding,
        }}
      >
        <View style={{ flex: 1, marginHorizontal: Sizes.fixPadding }}>
          <Text numberOfLines={1} style={{ ...Fonts.grayColor13Regular }}>
            CPF
          </Text>
          <Text style={styles.readOnlyFieldStyle}>
            {studentCPF || "-"}
          </Text>
        </View>
        <View style={{ flex: 1, marginHorizontal: Sizes.fixPadding }}>
          <Text numberOfLines={1} style={{ ...Fonts.grayColor13Regular }}>
            E-mail
          </Text>
          <Text style={styles.readOnlyFieldStyle}>
            {studentEmail || "-"}
          </Text>
        </View>
      </View>
    );
  }

  function profileInfo() {
    const userProfileImage = userData?.personalInfo?.profileImage;
    
    return (
      <View style={styles.profileInfoWrapStyle}>
        {userProfileImage ? (
          <Image
            source={{ uri: userProfileImage }}
            style={{ width: 75, height: 75, borderRadius: Sizes.fixPadding }}
          />
        ) : (
          <Image
            source={require("../../assets/images/students/student1.png")}
            style={{ width: 75, height: 75, borderRadius: Sizes.fixPadding }}
          />
        )}
        <View style={{ flex: 1, marginLeft: Sizes.fixPadding + 5.0 }}>
          <Text numberOfLines={1} style={{ ...Fonts.blackColor18Bold }}>
            {studentName}
          </Text>
          <Text style={{ ...Fonts.grayColor16Regular }}>
            {studentGrade} | Turma {studentClass} | Nº: {studentRegistration}
          </Text>
          {refreshing && (
            <Text style={{ ...Fonts.primaryColor13Medium, marginTop: Sizes.fixPadding - 5.0 }}>
              Atualizando dados...
            </Text>
          )}
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setShowBottomSheet(true);
          }}
          style={{ position: "absolute", right: 12.0, top: 12.0 }}
        >
          <Image
            source={require("../../assets/images/icons/camera.png")}
            style={styles.cameraIconStyle}
          />
        </TouchableOpacity>
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
          Meu Perfil
        </Text>
      </View>
    );
  }
};

export default StudentProfileScreen;

const styles = StyleSheet.create({
  sheetStyle: {
    backgroundColor: Colors.whiteColor,
    borderTopLeftRadius: Sizes.fixPadding * 2.0,
    borderTopRightRadius: Sizes.fixPadding * 2.0,
    flex: 1,
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
  cameraIconStyle: {
    width: 22.0,
    height: 22.0,
    resizeMode: "contain",
    tintColor: Colors.grayColor,
  },
  profileInfoWrapStyle: {
    borderColor: Colors.primaryColor,
    borderWidth: 1.0,
    borderRadius: Sizes.fixPadding,
    flexDirection: "row",
    alignItems: "center",
    margin: Sizes.fixPadding * 2.0,
    padding: Sizes.fixPadding + 2.0,
  },
  readOnlyFieldStyle: {
    paddingBottom: Sizes.fixPadding - 5.0,
    ...Fonts.blackColor14Medium,
    borderBottomColor: Colors.lightGrayColor,
    borderBottomWidth: 1.0,
    paddingTop: Platform.OS == 'ios' ? Sizes.fixPadding - 5.0 : 0,
    marginVertical: Sizes.fixPadding - 5.0,
  },
  changeProfilePicOptionsIconWrapStyle: {
    width: 50.0,
    height: 50.0,
    borderRadius: 25.0,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomSheetStyle: {
    backgroundColor: Colors.whiteColor,
    borderTopLeftRadius: Sizes.fixPadding + 5.0,
    borderTopRightRadius: Sizes.fixPadding + 5.0,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    paddingVertical: Sizes.fixPadding + 5.0,
  },
  rowItemStyle: {
    padding: Sizes.fixPadding,
    justifyContent: "center",
    alignItems: "center",
  },
  rowContainerStyle: {
    flexDirection: "row",
    alignItems: "center",
  },
  dividerStyle: {
    height: 1.0,
    backgroundColor: Colors.lightGrayColor,
    marginVertical: Sizes.fixPadding - 5.0,
  },
  schoolInfoBox: undefined,
  subjectTag: undefined,
});
