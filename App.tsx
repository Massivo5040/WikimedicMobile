import { StatusBar } from "expo-status-bar";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import {
  OpenSans_400Regular,
  OpenSans_700Bold,
  useFonts,
} from "@expo-google-fonts/open-sans";
import * as SplashScreen from "expo-splash-screen";

import {
  Presentation,
  Login,
  Signin,
  ForgotPassword,
  ForgotPassword2,
  ForgotPassword3,
} from "@/screens/presentation";
import InitialRoute from "@/screens/InitialRoute";

import "./global.css";
import { useEffect } from "react";

const Stack = createStackNavigator();

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [loaded, error] = useFonts({
    OpenSans_400Regular,
    OpenSans_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar style="auto" hidden={false} />
          <Stack.Navigator
            initialRouteName="InitialRoute"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Presentation" component={Presentation} />
            {/* <Stack.Screen name="Presentation3" component={Presentation3} /> */}
            {/* <Stack.Screen name="Welcome" component={Welcome} /> */}
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signin" component={Signin} />
            {/* <Stack.Screen name="CorpLogin" component={CorpLogin} /> */}
            {/* <Stack.Screen name="CorpSignin" component={CorpSignin} /> */}
            {/* <Stack.Screen name="CorpWelcome" component={CorpWelcome} /> */}
            {/* <Stack.Screen name="ClientWelcome" component={ClientWelcome} /> */}
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="ForgotPassword2" component={ForgotPassword2} />
            <Stack.Screen name="ForgotPassword3" component={ForgotPassword3} />
            <Stack.Screen name="InitialRoute" component={InitialRoute} />
          </Stack.Navigator>
        </SafeAreaView>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}
