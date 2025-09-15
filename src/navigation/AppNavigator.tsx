// src/navigation/AppNavigator.tsx
import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Linking } from "react-native";
import { navigationRef } from "./RootNavigation";
import AuthScreen from "../screens/AuthScreen";
import SplashScreen from "../screens/SplashScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import UserStack from "./UserStack";
import AdminStack from "./AdminStack";
import { useAuth } from "../contexts/AuthContext";

// -----------------------------
// Define the Stack Param List
// -----------------------------
export type RootStackParamList = {
  Auth: undefined;
  User: undefined;
  Admin: undefined;
  ResetPassword: { email?: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { user, role, loading } = useAuth();

  useEffect(() => {
    const handleDeepLink = ({ url }: { url: string }) => {
      const parsed = url.split("://")[1];
      if (parsed?.startsWith("reset-password")) {
        const emailParam = parsed.split("?email=")[1];
        navigationRef.current?.navigate("ResetPassword", { email: emailParam });
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => subscription.remove();
  }, []);

  if (loading) return <SplashScreen />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="Auth" component={AuthScreen} />
      ) : role === "admin" ? (
        <Stack.Screen name="Admin" component={AdminStack} />
      ) : (
        <Stack.Screen name="User" component={UserStack} />
      )}
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}
