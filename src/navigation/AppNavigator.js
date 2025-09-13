// src/navigation/AppNavigator.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AuthScreen from "../screens/AuthScreen";
import HomeScreen from "../screens/HomeScreen";
import SplashScreen from "../screens/SplashScreen";
import { useAuth } from "../contexts/AuthContext";
import UserStack from "./UserStack";
import AdminStack from "./AdminStack";

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        // 🚪 Not logged in
        <Stack.Screen name="Auth" component={AuthScreen} />
      ) : user.role === "admin" ? (
        // 👑 Admin logged in
        <Stack.Screen name="Admin" component={AdminStack} />
      ) : (
        // 🙋 Normal user logged in
        <Stack.Screen name="User" component={UserStack} />
      )}
    </Stack.Navigator>
  );
}
