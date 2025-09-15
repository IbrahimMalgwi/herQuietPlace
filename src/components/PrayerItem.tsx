// src/components/PrayerItem.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../theme/theme";

interface PrayerItemProps {
  title: string;
  content?: string;
  approved: boolean;
}

export default function PrayerItem({
  title,
  content,
  approved,
}: PrayerItemProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {content && <Text style={styles.content}>{content}</Text>}
      <Text style={styles.status}>
        {approved ? "✅ Approved" : "⏳ Pending approval"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.cardBackground,
  },
  title: {
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
    color: theme.colors.primaryText,
    marginBottom: theme.spacing.xs,
  },
  content: {
    fontSize: theme.typography.small.fontSize,
    fontWeight: theme.typography.small.fontWeight as
      | "400"
      | "500"
      | "600"
      | "700"
      | "800"
      | "900"
      | "bold"
      | "normal",
    color: theme.colors.secondaryText,
    marginBottom: theme.spacing.xs,
  },
  status: {
    fontSize: theme.typography.small.fontSize,
    fontWeight: theme.typography.small.fontWeight as
      | "400"
      | "500"
      | "600"
      | "700"
      | "800"
      | "900"
      | "bold"
      | "normal",
    color: theme.colors.grayDark,
  },
});
