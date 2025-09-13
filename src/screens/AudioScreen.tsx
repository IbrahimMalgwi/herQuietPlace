// src/screens/AudioScreen.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";

export default function AudioScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Audio Comforts</Text>
      <TouchableOpacity style={styles.audioCard}>
        <Ionicons
          name="play-circle-outline"
          size={40}
          color={colors.primaryAccent}
        />
        <Text style={styles.audioText}>Morning Encouragement</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.audioCard}>
        <Ionicons
          name="play-circle-outline"
          size={40}
          color={colors.primaryAccent}
        />
        <Text style={styles.audioText}>Evening Calm</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: colors.primaryText,
    marginBottom: 20,
  },
  audioCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondaryBackground,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  audioText: {
    marginLeft: 12,
    fontSize: 16,
    color: colors.primaryText,
  },
});
