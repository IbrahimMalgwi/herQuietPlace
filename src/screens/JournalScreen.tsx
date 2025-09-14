import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, Alert } from "react-native";
import { createJournalEntry, fetchUserJournals } from "../api/journal";
import { useAuth } from "../hooks/useAuth";
import { Journal } from "../types/journal";

export default function JournalScreen() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [entries, setEntries] = useState<Journal[]>([]);

  // Load user's journal entries
  const loadJournals = async () => {
    if (!user) return;
    try {
      const data = await fetchUserJournals(user.id);
      setEntries(data);
    } catch (err: any) {
      console.error("Failed to load journals:", err.message);
    }
  };

  useEffect(() => {
    loadJournals();
  }, [user]);

  // Add a new journal entry
  const handleAddEntry = async () => {
    if (!user || !title.trim() || !content.trim()) {
      Alert.alert("Validation", "Please provide both a title and content.");
      return;
    }

    try {
      const newEntry = await createJournalEntry(user.id, title, content);
      setEntries((prev) => [newEntry, ...prev]); // add to top
      setTitle("");
      setContent("");
    } catch (err: any) {
      console.error("Failed to create journal entry:", err.message);
      Alert.alert("Error", err.message || "Could not create journal entry.");
    }
  };

  return (
    <View style={{ padding: 20, flex: 1 }}>
      <TextInput
        placeholder="Journal title..."
        value={title}
        onChangeText={setTitle}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          marginBottom: 10,
          padding: 8,
          borderRadius: 6,
        }}
      />

      <TextInput
        placeholder="Write your journal..."
        value={content}
        onChangeText={setContent}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          marginBottom: 10,
          padding: 8,
          borderRadius: 6,
        }}
        multiline
      />

      <Button title="Save Entry" onPress={handleAddEntry} />

      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              paddingVertical: 8,
              borderBottomWidth: 1,
              borderBottomColor: "#eee",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
            <Text>{item.content}</Text>
            {item.created_at && (
              <Text style={{ fontSize: 12, color: "#666" }}>
                {new Date(item.created_at).toLocaleString()}
              </Text>
            )}
          </View>
        )}
      />
    </View>
  );
}
