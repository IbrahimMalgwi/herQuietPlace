// src/screens/JournalScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import { createJournalEntry, fetchUserJournals } from "../api/journal";
import { useAuth } from "../hooks/useAuth";
import { Journal } from "../types/journal"; // ✅ central type

export default function JournalScreen() {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [entries, setEntries] = useState<Journal[]>([]); // ✅ use Journal[]

  useEffect(() => {
    if (user) {
      fetchUserJournals(user.id)
        .then(setEntries)
        .catch((err) => console.error("Failed to load journals:", err));
    }
  }, [user]);

  const handleAddEntry = async () => {
    if (!user || !content.trim()) return;
    try {
      const newEntry = await createJournalEntry(user.id, content);
      setEntries((prev) => [newEntry, ...prev]); // ✅ functional update
      setContent("");
    } catch (err) {
      console.error("Failed to create journal entry:", err);
    }
  };

  return (
    <View style={{ padding: 20, flex: 1 }}>
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
      />
      <Button title="Save" onPress={handleAddEntry} />

      <FlatList
        data={entries}
        keyExtractor={(item) => item.id} // ✅ TS knows id exists now
        renderItem={({ item }) => (
          <View
            style={{
              paddingVertical: 8,
              borderBottomWidth: 1,
              borderBottomColor: "#eee",
            }}
          >
            <Text>{item.content}</Text>
            <Text style={{ fontSize: 12, color: "#666" }}>
              {new Date(item.created_at).toLocaleString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
