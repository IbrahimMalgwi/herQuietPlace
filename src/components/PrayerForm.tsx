// src/components/PrayerForm.tsx
import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import { theme } from "../theme/theme";

interface PrayerFormProps {
  onSubmit: (title: string, content: string) => void;
}

export default function PrayerForm({ onSubmit }: PrayerFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert("Validation", "Please enter a prayer title.");
      return;
    }
    onSubmit(title.trim(), content.trim());
    setTitle("");
    setContent("");
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Prayer title..."
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        placeholderTextColor={theme.colors.grayDark}
      />
      <TextInput
        placeholder="Write your prayer..."
        value={content}
        onChangeText={setContent}
        style={[styles.input, styles.textArea]}
        multiline
        numberOfLines={4}
        placeholderTextColor={theme.colors.grayDark}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Prayer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.grayMedium,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    color: theme.colors.primaryText,
    fontSize: theme.typography.body.fontSize,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: theme.colors.purpleDark,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: theme.typography.body.fontSize,
    fontWeight: "600",
  },
});
