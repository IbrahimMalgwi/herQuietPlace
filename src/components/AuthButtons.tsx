// src/components/AuthButtons.tsx
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { theme } from "../theme/theme";

interface AuthButtonsProps {
  onSignIn: () => void;
  onSignUp: () => void;
}

export default function AuthButtons({ onSignIn, onSignUp }: AuthButtonsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.signInButton} onPress={onSignIn}>
        <Text style={styles.signInText}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.signUpButton} onPress={onSignUp}>
        <Text style={styles.signUpText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    gap: theme.spacing.md,
  },
  signInButton: {
    backgroundColor: theme.colors.purpleDark,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
  },
  signInText: {
    color: theme.colors.white,
    fontWeight: "500",
    fontSize: theme.typography.body.fontSize,
  },
  signUpButton: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.purpleDark,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
  },
  signUpText: {
    color: theme.colors.purpleDark,
    fontWeight: "500",
    fontSize: theme.typography.body.fontSize,
  },
});
