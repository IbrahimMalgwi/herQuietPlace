// src/screens/SplashScreen.tsx
import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Her Quiet Place</Text>
      <ActivityIndicator size="large" color={colors.primaryAccent} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.primaryText,
    marginBottom: 20,
  },
});
