// src/components/EmptyState.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../theme/theme";

interface EmptyStateProps {
  title: string;
  subtitle: string;
}

export default function EmptyState({ title, subtitle }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.lg,
    marginTop: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.heading3.fontSize,
    fontWeight: theme.typography.heading3.fontWeight as
      | "400"
      | "500"
      | "600"
      | "700"
      | "800"
      | "900"
      | "bold"
      | "normal",
    color: theme.colors.grayMedium,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: theme.typography.body.fontWeight as
      | "400"
      | "500"
      | "600"
      | "700"
      | "800"
      | "900"
      | "bold"
      | "normal",
    color: theme.colors.grayMedium,
    textAlign: "center",
  },
});
