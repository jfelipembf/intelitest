import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
import { MaterialIcons } from "@expo/vector-icons";
import MyStatusBar from "../../components/myStatusBar";
import { useNavigation } from "expo-router";
import { useAuth } from "../../hooks/useAuth";

const { width } = Dimensions.get("window");

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const { resetPassword, loading } = useAuth();
  const [email, setEmail] = useState("");

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Erro", "Por favor, informe seu e-mail");
      return;
    }
    
    const result = await resetPassword(email);
    
    if (result.success) {
      Alert.alert(
        "E-mail enviado", 
        "Verifique sua caixa de entrada para instruções sobre como redefinir sua senha.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } else {
      Alert.alert("Erro", result.error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <MyStatusBar />
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          automaticallyAdjustKeyboardInsets={true}
          contentContainerStyle={{ 
            paddingTop: Sizes.fixPadding * 4.0,
            paddingBottom: Sizes.fixPadding * 4.0,
            flexGrow: 1,
            justifyContent: 'center' 
          }}
        >
          {passwordRecoveryImage()}
          {recoveryText()}
          {emailField()}
          {resetPasswordButton()}
          {backToLoginButton()}
        </ScrollView>
      </View>
    </View>
  );

  function passwordRecoveryImage() {
    return (
      <Image
        source={require("../../assets/images/inteliLogo.png")}
        style={styles.imageStyle}
      />
    );
  }

  function recoveryText() {
    return (
      <View style={{
        marginHorizontal: Sizes.fixPadding * 2.0,
        alignItems: "center",
        marginBottom: Sizes.fixPadding * 2.0,
      }}>
        <Text style={{ ...Fonts.primaryColor20SemiBold }}>
          Recuperação de Senha
        </Text>
        <Text style={{
          textAlign: "center",
          marginTop: Sizes.fixPadding - 5.0,
          ...Fonts.grayColor13Regular,
        }}>
          Digite seu e-mail para receber um link de recuperação de senha
        </Text>
      </View>
    );
  }

  function emailField() {
    return (
      <View style={{ ...styles.textFieldWrapStyle }}>
        <MaterialIcons
          name="mail-outline"
          size={18}
          color={Colors.blackColor}
        />
        <TextInput
          value={email}
          onChangeText={(value) => setEmail(value)}
          placeholder="Email"
          placeholderTextColor={Colors.grayColor}
          style={styles.textFieldStyle}
          cursorColor={Colors.primaryColor}
          selectionColor={Colors.primaryColor}
          keyboardType="email-address"
          numberOfLines={1}
          editable={!loading}
        />
      </View>
    );
  }

  function resetPasswordButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleResetPassword}
        disabled={loading}
        style={styles.buttonStyle}
      >
        {loading ? (
          <ActivityIndicator size="small" color={Colors.whiteColor} />
        ) : (
          <Text style={{ ...Fonts.whiteColor17Bold }}>
            Recuperar Senha
          </Text>
        )}
      </TouchableOpacity>
    );
  }
  
  function backToLoginButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.goBack()}
        style={{ alignItems: 'center', marginTop: Sizes.fixPadding }}
      >
        <Text style={{ ...Fonts.blackColor13Medium }}>
          Voltar para o login
        </Text>
      </TouchableOpacity>
    );
  }
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  imageStyle: {
    width: "60%",
    height: width / 4.5,
    resizeMode: "contain",
    alignSelf: "center",
    margin: Sizes.fixPadding * 2.0,
    marginBottom: Sizes.fixPadding * 3.0,
  },
  textFieldStyle: {
    ...Fonts.blackColor14Medium,
    flex: 1,
    height: 20.0,
    padding: 0,
    marginLeft: Sizes.fixPadding,
  },
  textFieldWrapStyle: {
    backgroundColor: Colors.extraLightGrayColor,
    borderRadius: Sizes.fixPadding * 2.5,
    flexDirection: "row",
    alignItems: "center",
    padding: Sizes.fixPadding + 5.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginTop: Sizes.fixPadding * 2.0,
    marginBottom: Sizes.fixPadding * 2.0,
  },
  buttonStyle: {
    backgroundColor: Colors.secondaryColor,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Sizes.fixPadding * 3.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
    paddingVertical: Sizes.fixPadding + 5.0,
    marginVertical: Sizes.fixPadding * 2.0,
    elevation: 1.0,
    ...CommonStyles.buttonShadow,
    borderColor: "#FFAB1B95",
    borderWidth: 1.0,
  },
}); 