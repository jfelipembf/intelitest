import {
  StyleSheet,
  Text,
  View,
  BackHandler,
  Image,
  Dimensions,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  AccessibilityInfo
} from "react-native";
import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import MyStatusBar from "../../components/myStatusBar";
import { useNavigation } from "expo-router";
import { useAuth } from "../../hooks/useAuth";

const { width } = Dimensions.get("window");

const LoginScreen = () => {
  const navigation = useNavigation();
  const { login, authError, loading, isConnected } = useAuth();

  const [backClickCount, setBackClickCount] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPwdRemember, setIsPwdRemember] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);

  // Verificar se o leitor de tela está ativo
  useEffect(() => {
    AccessibilityInfo.isScreenReaderEnabled().then(
      screenReaderEnabled => {
        setScreenReaderEnabled(screenReaderEnabled);
      }
    );
    
    const subscription = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      screenReaderEnabled => {
        setScreenReaderEnabled(screenReaderEnabled);
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  // Validar email com regex
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Verificar email quando mudar
  useEffect(() => {
    if (email.length > 0) {
      setIsEmailValid(validateEmail(email));
    } else {
      setIsEmailValid(true);
    }
  }, [email]);

  const backAction = useCallback(() => {
    if (backClickCount === 1) {
      BackHandler.exitApp();
    } else {
      setBackClickCount(1);
      setTimeout(() => {
        setBackClickCount(0);
      }, 1000);
    }
    return true;
  }, [backClickCount]);

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", backAction);
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", backAction);
      };
    }, [backAction])
  );

  const handleLogin = async () => {
    // Verificar conexão com a internet
    if (!isConnected) {
      Alert.alert(
        "Sem conexão",
        "Verifique sua conexão com a internet e tente novamente."
      );
      return;
    }

    // Validar campos antes de tentar login
    if (!email) {
      Alert.alert("Erro", "Por favor, informe seu e-mail");
      return;
    }

    if (!isEmailValid) {
      Alert.alert("Erro", "Por favor, informe um e-mail válido");
      return;
    }

    if (!password) {
      Alert.alert("Erro", "Por favor, informe sua senha");
      return;
    }

    const result = await login(email, password, isPwdRemember);
    
    if (result.success) {
      // Navegação para a tela principal em caso de sucesso
      navigation.push("home/homeScreen");
    } else {
      // Mostrar mensagem de erro
      Alert.alert("Erro de Login", result.error);
    }
  };

  // Memoize componentes para melhorar performance
  const ExitInfo = useMemo(() => {
    return backClickCount === 1 ? (
      <View style={styles.exitInfoWrapStyle}>
        <Text style={{ ...Fonts.whiteColor13Regular }}>
          Pressione voltar novamente para sair
        </Text>
      </View>
    ) : null;
  }, [backClickCount]);

  const LoginButton = useMemo(() => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleLogin}
        disabled={loading}
        style={styles.buttonStyle}
        accessible={true}
        accessibilityLabel="Botão de login"
        accessibilityHint="Toque para fazer login"
        accessibilityRole="button"
      >
        {loading ? (
          <ActivityIndicator size="small" color={Colors.whiteColor} />
        ) : (
          <Text style={{ ...Fonts.whiteColor17Bold }}>Entrar</Text>
        )}
      </TouchableOpacity>
    );
  }, [loading, handleLogin]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: Colors.whiteColor }}
    >
      <MyStatusBar />
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ 
            paddingTop: Sizes.fixPadding * 4.0,
            paddingBottom: Sizes.fixPadding * 4.0,
            flexGrow: 1,
            justifyContent: 'center' 
          }}
        >
          <Image
            source={require("../../assets/images/inteliLogo.png")}
            style={styles.imageStyle}
            accessible={true}
            accessibilityLabel="Logo da Inteli"
          />
          
          <View
            style={{
              marginHorizontal: Sizes.fixPadding * 2.0,
              alignItems: "center",
              marginBottom: Sizes.fixPadding * 2.0,
            }}
          >
            <Text 
              style={{ ...Fonts.primaryColor20SemiBold }}
              accessible={true}
              accessibilityRole="header"
            >
              Bem-vindo
            </Text>
            <Text
              style={{
                textAlign: "center",
                marginTop: Sizes.fixPadding - 5.0,
                ...Fonts.grayColor13Regular,
              }}
              accessible={true}
            >
              Entre com suas credenciais para continuar
            </Text>
          </View>
          
          <View 
            style={{ 
              ...styles.textFieldWrapStyle,
              borderColor: isEmailValid ? Colors.extraLightGrayColor : Colors.redColor,
              borderWidth: 1 
            }}
            accessible={true}
            accessibilityLabel="Campo de e-mail"
            accessibilityHint="Digite seu e-mail aqui"
          >
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
              autoCapitalize="none"
              textContentType="emailAddress"
              returnKeyType="next"
              accessibilityLabel="Campo de e-mail"
            />
          </View>
          
          {!isEmailValid && email.length > 0 && (
            <Text style={styles.errorTextStyle}>
              Por favor, informe um e-mail válido
            </Text>
          )}
          
          <View
            style={{
              ...styles.textFieldWrapStyle,
              marginTop: 0.0,
              marginBottom: Sizes.fixPadding,
            }}
            accessible={true}
            accessibilityLabel="Campo de senha"
            accessibilityHint="Digite sua senha aqui"
          >
            <MaterialIcons name="lock-open" size={18} color={Colors.blackColor} />
            <TextInput
              value={password}
              onChangeText={(value) => setPassword(value)}
              placeholder="Senha"
              placeholderTextColor={Colors.grayColor}
              style={styles.textFieldStyle}
              cursorColor={Colors.primaryColor}
              selectionColor={Colors.primaryColor}
              secureTextEntry={!passwordVisible}
              numberOfLines={1}
              textContentType="password"
              returnKeyType="done"
              accessibilityLabel="Campo de senha"
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
              accessible={true}
              accessibilityLabel={passwordVisible ? "Ocultar senha" : "Mostrar senha"}
              accessibilityRole="button"
            >
              <MaterialIcons
                name={passwordVisible ? "visibility-off" : "visibility"}
                size={20}
                color={Colors.grayColor}
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.rememberAndForgetPasswordInfoWrapStyle}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setIsPwdRemember(!isPwdRemember);
              }}
              style={{ width: 135, flexDirection: "row", alignItems: "center" }}
              accessible={true}
              accessibilityLabel={isPwdRemember ? "Lembrar-me, ativado" : "Lembrar-me, desativado"}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isPwdRemember }}
            >
              <View style={styles.radioButtonStyle}>
                {isPwdRemember ? (
                  <View style={styles.selectedRadioButtonStyle} />
                ) : null}
              </View>
              <Text
                style={{
                  marginLeft: Sizes.fixPadding,
                  ...Fonts.grayColor13Regular,
                }}
              >
                Lembrar-me
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => navigation.push("auth/forgotPasswordScreen")}
              accessible={true}
              accessibilityLabel="Esqueceu a senha?"
              accessibilityRole="link"
            >
              <Text style={{ minWidth: 130, ...Fonts.blackColor13Medium }}>
                Esqueceu a senha?
              </Text>
            </TouchableOpacity>
          </View>
          
          {LoginButton}

          {!isConnected && (
            <Text style={styles.offlineTextStyle}>
              Você está offline. Verifique sua conexão com a internet.
            </Text>
          )}
        </ScrollView>
      </View>
      {ExitInfo}
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

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
  rememberAndForgetPasswordInfoWrapStyle: {
    marginHorizontal: Sizes.fixPadding * 2.0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Sizes.fixPadding,
  },
  radioButtonStyle: {
    width: 14.0,
    height: 14.0,
    borderRadius: 7.0,
    borderColor: Colors.grayColor,
    borderWidth: 1.0,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedRadioButtonStyle: {
    width: 8.0,
    height: 8.0,
    backgroundColor: Colors.grayColor,
    borderRadius: 4.0,
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
  errorTextStyle: {
    color: Colors.redColor,
    ...Fonts.redColor12Regular,
    marginHorizontal: Sizes.fixPadding * 2.5,
    marginTop: -Sizes.fixPadding,
    marginBottom: Sizes.fixPadding,
  },
  offlineTextStyle: {
    color: Colors.redColor,
    ...Fonts.redColor14Regular,
    textAlign: 'center',
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginTop: Sizes.fixPadding,
  }
});