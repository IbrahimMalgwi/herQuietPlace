import React, { useContext } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { theme } from "../theme/theme";
import { useAuth } from "../contexts/AuthContext";
import { PrayerContext } from "../contexts/PrayerContext";
import PrayerForm from "../components/PrayerForm";
import PrayerList from "../components/PrayerList";
import EmptyState from "../components/EmptyState";
import AuthButtons from "../components/AuthButtons";

export default function PrayerScreen() {
  const { user } = useAuth();
  const { prayers, loading, addPrayer } = useContext(PrayerContext);

  const handleSubmit = async (title: string, content?: string) => {
    if (!title.trim()) return;
    await addPrayer(title, content);
    Alert.alert("Submitted", "Your prayer has been submitted!");
  };

  if (!user) {
    return (
      <View style={styles.center}>
        <EmptyState
          title="Sign in required"
          subtitle="You must be signed in to submit prayers."
        />
        <AuthButtons
          onSignIn={() => console.log("Navigate to Auth")}
          onSignUp={() => console.log("Navigate to Auth")}
        />
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
    <View style={styles.container}>
      <PrayerForm onSubmit={handleSubmit} />
      {safePrayers.length ? (
        <PrayerList prayers={safePrayers} loading={loading} />
      ) : (
        <EmptyState
          title="No prayers yet"
          subtitle="Create your first prayer"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primaryBackground,
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
