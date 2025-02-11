import { Tabs } from "expo-router";
import {
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#3B82F6",
        tabBarInactiveTintColor: "#64748B",
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: "Doctors",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="doctor" size={24} color={color} />
          ),
        }}
      />

      {/* Emergency Ambulance Tab */}
      <Tabs.Screen
        name="ambulance"
        options={{
          title: "Emergency",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="ambulance" size={26} color={color} />
          ),
        }}
      />

      {/* AI Symptom Checker Tab */}
      <Tabs.Screen
        name="symptom-checker"
        options={{
          title: "Symptom Check",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="chat" size={24} color={color} />
          ),
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
