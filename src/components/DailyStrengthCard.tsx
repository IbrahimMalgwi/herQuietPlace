// src/components/DailyStrengthCard.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../theme/theme";

interface DailyStrengthCardProps {
  message: string;
}

export default function DailyStrengthCard({ message }: DailyStrengthCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.purpleLight,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  message: {
    color: theme.colors.white,
    fontSize: theme.typography.body.fontSize,
    fontWeight: "500",
  },
});
