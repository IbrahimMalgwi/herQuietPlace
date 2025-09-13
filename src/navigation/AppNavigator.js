// navigation/AppNavigator.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuth } from "../contexts/AuthContext";
import HomeScreen from "../screens/HomeScreen";
import JournalScreen from "../screens/JournalScreen";
import PrayerScreen from "../screens/PrayerScreen";
import AdminDashboard from "../screens/AdminDashboard";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const { role } = useAuth();

  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Journal" component={JournalScreen} />
      <Tab.Screen name="Prayers" component={PrayerScreen} />

      {/* ✅ Show Admin only if role is admin */}
      {role === "admin" && (
        <Tab.Screen name="Admin" component={AdminDashboard} />
      )}
    </Tab.Navigator>
  );
}
