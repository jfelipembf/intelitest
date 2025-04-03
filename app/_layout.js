import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { AppState, LogBox, StatusBar } from 'react-native';
import { AuthProvider } from '../hooks/useAuth';

LogBox.ignoreAllLogs();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const [loaded] = useFonts({
    'Inter-Regular': require("../assets/fonts/Inter-Regular.ttf"),
    'Inter-Medium': require("../assets/fonts/Inter-Medium.ttf"),
    'Inter-SemiBold': require("../assets/fonts/Inter-SemiBold.ttf"),
    'Inter-Bold': require("../assets/fonts/Inter-Bold.ttf"),
    'Inter-ExtraBold': require("../assets/fonts/Inter-ExtraBold.ttf"),
    BebasNeue_Regular: require("../assets/fonts/BebasNeue-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
    const subscription = AppState.addEventListener("change", (_) => {
      StatusBar.setBarStyle("light-content");
    });
    return () => {
      subscription.remove();
    };
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false, animation: 'ios_from_right' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth/loginScreen" options={{ gestureEnabled: false }} />
        <Stack.Screen name="home/homeScreen" options={{ gestureEnabled: false }} />
        <Stack.Screen name="notification/notificationScreen" />
        <Stack.Screen name="studentProfile/studentProfileScreen" />
        <Stack.Screen name="videoClass/videoClassScreen" />
        <Stack.Screen name="attendance/attendanceScreen" />
        <Stack.Screen name="feesDue/feesDueScreen" />
        <Stack.Screen name="syllabus/syllabusScreen" />
        <Stack.Screen name="syllabusDetail/syllabusDetailScreen" />
        <Stack.Screen name="assignment/assignmentScreen" />
        <Stack.Screen name="calender/calenderScreen" />
        <Stack.Screen name="timeTable/timeTableScreen" />
        <Stack.Screen name="test/testScreen" />
        <Stack.Screen name="testStart/testStartScreen" />
        <Stack.Screen name="testResult/testResultScreen" />
        <Stack.Screen name="leaderBoard/leaderBoardScreen" />
        <Stack.Screen name="answerSheet/answerSheetScreen" />
        <Stack.Screen name="progressCard/progressCardScreen" />
        <Stack.Screen name="leaveApplication/leaveApplicationScreen" />
        <Stack.Screen name="schoolGallery/schoolGalleryScreen" />
        <Stack.Screen name="askDoubts/askDoubtsScreen" />
        <Stack.Screen name="faculties/facultiesScreen" />
        <Stack.Screen name="messages/messagesScreen" />
        <Stack.Screen name="chatWithFaculty/chatWithFacultyScreen" />
        <Stack.Screen name="support/supportScreen" />
        <Stack.Screen name="changePassword/changePasswordScreen" />
        <Stack.Screen name="changePasswordSuccess/changePasswordSuccessScreen" />
        <Stack.Screen name="auth/forgotPasswordScreen" />
      </Stack>
    </AuthProvider>
  );
}
