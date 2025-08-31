import { createStackNavigator } from "@react-navigation/stack";
import ScheduleScreen from "./ScheduleScreen";
import MyAgenda from "./MyAgenda";
import MyHealth from "./MyHealth";
import MyLeaflets from "./MyLeaflets";

const Stack = createStackNavigator();

export default function ScheduleRoute() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ScheduleScreen" component={ScheduleScreen} />
      <Stack.Screen name="MyAgenda" component={MyAgenda} />
      <Stack.Screen name="MyHealth" component={MyHealth} />
      <Stack.Screen name="MyLeaflets" component={MyLeaflets} />
    </Stack.Navigator>
  );
}
