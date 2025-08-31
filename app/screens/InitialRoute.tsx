import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Schedule from "./schedule/ScheduleRoute";
import Home from "./home/HomeRoute";
import Profile from "./profile/ProfileRoute";

import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";

const Tab = createBottomTabNavigator();

export default function InitialRoute() {
  return (
    <Tab.Navigator
      initialRouteName="HomeRoute"
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name="HomeRoute"
        component={Home}
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color, size }) => (
            <Entypo name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ScheduleRoute"
        component={Schedule}
        options={{
          title: "Schedule",
          tabBarIcon: ({ focused, color, size }) => (
            <FontAwesome name="map-marker" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileRoute"
        component={Profile}
        options={{
          title: "Profile",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name="person-circle" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
