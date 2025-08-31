import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "./ProfileScreen";

const Stack = createStackNavigator();

export default function ProfileRoute() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
