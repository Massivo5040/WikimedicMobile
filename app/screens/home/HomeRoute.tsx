import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./HomeScreen";
import MedicineCategory from "./MedicineCategory";
import MedicineDetails from "./MedicineDetails";

const Stack = createStackNavigator();

export default function HomeRoute() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="MedicineCategory" component={MedicineCategory} />
      <Stack.Screen name="MedicineDetails" component={MedicineDetails} />
    </Stack.Navigator>
  );
}
