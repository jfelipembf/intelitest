import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors, Fonts, Sizes } from "../constants/styles";
import { Circle } from 'react-native-animated-spinkit'
import MyStatusBar from "../components/myStatusBar";
import { useNavigation } from "expo-router";
import { useAuth } from "../hooks/useAuth";

const { width } = Dimensions.get("window");

const SplashScreen = () => {
  const navigation = useNavigation();
  const { user, loading } = useAuth();
  const [navigating, setNavigating] = useState(false);

  useEffect(() => {
    // Garantir que apenas navegamos uma vez
    if (navigating) return;
    
    // Apenas prosseguir se o loading estiver concluído
    if (!loading) {
      const timer = setTimeout(() => {
        setNavigating(true);
        if (user) {
          navigation.push("home/homeScreen");
        } else {
          navigation.push("auth/loginScreen");
        }
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [user, loading, navigating, navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <MyStatusBar />
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        {appIcon()}
        {appText()}
      </View>
      <Circle
        size={50}
        color={Colors.secondaryColor}
        style={{ position: "absolute", bottom: 40.0, alignSelf: "center" }}
      />
    </View>
  );

  function appText() {
    return (
      <Text
        style={{
          marginTop: Sizes.fixPadding + 5.0,
          ...Fonts.blackColor15Medium,
        }}
      >
        Student App
      </Text>
    );
  }

  function appIcon() {
    return (
      <View style={styles.appIconWrapStyle}>
        <Image
          source={require("../assets/images/inteli_icon.png")}
          style={{
            width: width / 7.0,
            height: width / 7.0,
            resizeMode: "contain",
          }}
        />
      </View>
    );
  }
};

export default SplashScreen;

const styles = StyleSheet.create({
  appIconWrapStyle: {
    width: width / 4.2,
    height: width / 4.2,
    borderColor: Colors.lightGrayColor,
    borderRadius: Sizes.fixPadding,
    alignItems: "center",
    justifyContent: "center",
  },
});
