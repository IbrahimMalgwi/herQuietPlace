// src/components/PrayerCard.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";

export interface PrayerCardProps {
  title: string;
  content: string;
  date: string;
  shared?: boolean;
  onPress?: () => void;
}

const PrayerCard = ({
  title,
  content,
  date,
  shared,
  onPress,
}: PrayerCardProps) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <LinearGradient
      colors={[colors.cardBackground, colors.secondaryBackground]}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.content} numberOfLines={3}>
        {content}
      </Text>
      <View style={styles.footer}>
        <Text style={styles.date}>{new Date(date).toLocaleDateString()}</Text>
        {shared && (
          <Ionicons name="earth" size={16} color={colors.secondaryText} />
        )}
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: colors.cardBackground,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  gradient: { padding: 20, borderRadius: 16 },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.primaryText,
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    color: colors.secondaryText,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: { fontSize: 12, color: colors.secondaryText },
});

export default PrayerCard;
