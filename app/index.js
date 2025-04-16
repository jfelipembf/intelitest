import React, { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { useAuth } from "../hooks/useAuth";
import { Image, View, StyleSheet, Dimensions } from "react-native";
import { Circle } from 'react-native-animated-spinkit';
import { Colors } from "../constants/styles";
import MyStatusBar from "../components/myStatusBar";

const { width, height } = Dimensions.get("window");



const SplashScreen = () => {
  const navigation = useNavigation();
  const { user, loading } = useAuth();
  const [navigating, setNavigating] = useState(false);

  // Navegar para a tela apropriada após um atraso
  useEffect(() => {
    // Garantir que apenas navegamos uma vez
    if (navigating) return;
    
    // Apenas prosseguir se o loading estiver concluído
    if (!loading) {
      const timer = setTimeout(() => {
        setNavigating(true);
        if (user) {
          navigation.replace("home/homeScreen");
        } else {
          navigation.replace("auth/loginScreen");
        }
      }, 2000); // Atraso de 2 segundos para mostrar a tela de splash
      
      return () => clearTimeout(timer);
    }
  }, [user, loading, navigating, navigation]);

  // Mostrar a tela de splash enquanto carrega
  return (
    <View style={styles.container}>
      <MyStatusBar />
      <Image
        source={require("../assets/images/splash.png")}
        style={styles.backgroundImage}
      />
      <Circle
        size={50}
        color={Colors.secondaryColor}
        style={styles.loadingIndicator}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  backgroundImage: {
    width: width,
    height: height,
    position: 'absolute',
    top: 0,
    left: 0,
    resizeMode: 'cover',
  },
  loadingIndicator: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
  }
});
