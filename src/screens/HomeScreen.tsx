import React, { useContext } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { theme } from "../theme/theme";
import DailyStrengthCard from "../components/DailyStrengthCard";
import PrayerList from "../components/PrayerList";
import AuthButtons from "../components/AuthButtons";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../contexts/AuthContext";
import { PrayerContext } from "../contexts/PrayerContext";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "User">;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen = ({ navigation }: Props) => {
  const { user } = useAuth();
  const { prayers, loading, refreshPrayers } = useContext(PrayerContext);
  const dailyStrength = "Be strong and courageous today!";

  const onRefresh = () => refreshPrayers();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primaryAccent} />
      </View>
    );
  }

  // Ensure approved and shared are booleans
  const safePrayers = prayers.map((p) => ({
    ...p,
    approved: p.approved ?? false,
    shared: p.shared ?? false,
  }));

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Her Quiet Place</Text>
        {user && (
          <Text
            style={styles.profileIcon}
            onPress={() => navigation.navigate("Profile")}
          >
            👤
          </Text>
        )}
      </View>

      {/* Daily Strength */}
      <View style={styles.dailyStrengthWrapper}>
        <DailyStrengthCard message={dailyStrength} />
      </View>

      {/* Prayers */}
      {safePrayers.length ? (
        <PrayerList
          prayers={safePrayers}
          loading={loading}
          refreshing={false}
          onRefresh={onRefresh}
        />
      ) : (
        <EmptyState
          title="No prayers yet"
          subtitle={
            user ? "Create your first prayer" : "Sign in to share your prayers"
          }
        />
      )}

      {/* Guest Auth Buttons */}
      {!user && (
        <View style={styles.authContainer}>
          <Text style={styles.authPrompt}>Join our community of faith</Text>
          <AuthButtons
            onSignIn={() => navigation.navigate("Auth")}
            onSignUp={() => navigation.navigate("Auth")}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.primaryBackground },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  headerTitle: {
    fontSize: theme.typography.heading1.fontSize,
    fontWeight: theme.typography.heading1.fontWeight as
      | "normal"
      | "bold"
      | "100"
      | "200"
      | "300"
      | "400"
      | "500"
      | "600"
      | "700"
      | "800"
      | "900",
    color: theme.colors.primaryText,
  },
  profileIcon: { fontSize: 28, color: theme.colors.secondaryText },
  dailyStrengthWrapper: {
    paddingHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.lg,
  },
  authContainer: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.secondaryBackground,
  },
  authPrompt: {
    textAlign: "center",
    fontSize: theme.typography.body.fontSize,
    color: theme.colors.primaryText,
    marginBottom: theme.spacing.lg,
  },
});

export default HomeScreen;
