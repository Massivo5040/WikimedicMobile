import { StatusBar } from "expo-status-bar";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { useEffect } from "react";

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
import { AuthProvider, FavoritesProvider, useAuth } from "@/contexts";

import "./global.css";

const Stack = createStackNavigator();

SplashScreen.preventAutoHideAsync();

// --- 1. CRIAMOS UM COMPONENTE SEPARADO PARA AS ROTAS ---
// Este componente será filho do AuthProvider, então o useAuth funcionará aqui
function Routes() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // Você pode retornar null ou um componente de Loading aqui
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="auto" hidden={false} />
      <Stack.Navigator
        // Importante: Se o user existir, a rota inicial muda logicamente
        screenOptions={{ headerShown: false }}
      >
        {user ? (
          // --- USUÁRIO LOGADO ---
          <Stack.Screen name="InitialRoute" component={InitialRoute} />
        ) : (
          // --- USUÁRIO NÃO LOGADO ---
          <>
            <Stack.Screen name="Presentation" component={Presentation} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signin" component={Signin} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="ForgotPassword2" component={ForgotPassword2} />
            <Stack.Screen name="ForgotPassword3" component={ForgotPassword3} />
          </>
        )}
      </Stack.Navigator>
    </SafeAreaView>
  );
}

// --- 2. O APP PRINCIPAL APENAS CONFIGURA OS PROVIDERS ---
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
        <FavoritesProvider>
          {/* O AuthProvider envolve o componente Routes */}
          <AuthProvider>
            <Routes />
          </AuthProvider>
        </FavoritesProvider>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}
