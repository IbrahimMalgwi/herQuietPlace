// App.tsx
import React, { useEffect } from "react";
import { Linking, Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// Screens
import HomeScreen from "./src/screens/HomeScreen";
import JournalScreen from "./src/screens/JournalScreen";
import AudioScreen from "./src/screens/AudioScreen";
import PrayerScreen from "./src/screens/PrayerScreen";
import AdminDashboardScreen from "./src/screens/AdminDashboardScreen";
import AuthScreen from "./src/screens/AuthScreen";
import SplashScreen from "./src/screens/SplashScreen";
import ResetPasswordScreen from "./src/screens/ResetPasswordScreen";

// Theme
import { colors } from "./src/theme/colors";

// Auth
import { useAuth, AuthProvider } from "./src/contexts/AuthContext";
import { navigationRef } from "./src/navigation/RootNavigation";

export type RootTabParamList = {
  Home: undefined;
  Journal: undefined;
  Audio: undefined;
  Prayer: undefined;
  Admin: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

interface AppTabsProps {
  initialRoute?: keyof RootTabParamList;
  role: string | null;
}

function AppTabs({ initialRoute = "Home", role }: AppTabsProps) {
  return (
    <Tab.Navigator
      initialRouteName={initialRoute}
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colors.primaryBackground },
        headerTintColor: colors.primaryText,
        tabBarActiveTintColor: colors.primaryAccent,
        tabBarInactiveTintColor: colors.secondaryText,
        tabBarStyle: {
          backgroundColor: colors.primaryBackground,
          borderTopColor: colors.secondaryText,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          switch (route.name) {
            case "Home":
              iconName = "sunny-outline";
              break;
            case "Journal":
              iconName = "book-outline";
              break;
            case "Audio":
              iconName = "headset-outline";
              break;
            case "Prayer":
              iconName = "hand-left-outline";
              break;
            default:
              iconName = "settings-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Journal" component={JournalScreen} />
      <Tab.Screen name="Audio" component={AudioScreen} />
      <Tab.Screen name="Prayer" component={PrayerScreen} />
      {role === "admin" && (
        <Tab.Screen name="Admin" component={AdminDashboardScreen} />
      )}
    </Tab.Navigator>
  );
}

function RootNavigation() {
  const { user, role, loading } = useAuth();

  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const url = event.url;
      if (url.includes("reset-password")) {
        const tokenParam = url.split("token=")[1] ?? null;
        if (tokenParam) {
          navigationRef.navigate("ResetPassword", { access_token: tokenParam });
        } else {
          Alert.alert("Error", "Invalid reset password link.");
        }
      }
    };

    Linking.addEventListener("url", handleDeepLink);

    // Check if app was opened via deep link
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => Linking.removeEventListener("url", handleDeepLink);
  }, []);

  if (loading) return <SplashScreen />;

  if (!user) return <AuthScreen />;

  return (
    <AppTabs initialRoute={role === "admin" ? "Admin" : "Home"} role={role} />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer ref={navigationRef}>
        <RootNavigation />
      </NavigationContainer>
    </AuthProvider>
  );
}
