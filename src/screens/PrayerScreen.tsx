import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, Alert } from "react-native";
import { createPrayer, fetchPrayers, Prayer } from "../api/prayer";
import { useAuth } from "../hooks/useAuth";

export default function PrayerScreen() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);

  // Load prayers
  const loadPrayers = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await fetchPrayers(false, user.id);
      setPrayers(data);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrayers();
  }, [user]);

  const handleAddPrayer = async () => {
    if (!user || !title.trim()) return;

    try {
      const newPrayer = await createPrayer(user.id, title, content);
      setPrayers((prev) => [newPrayer, ...prev]);
      setTitle("");
      setContent("");
      Alert.alert("Submitted", "Your prayer has been submitted!");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>You must be signed in to submit prayers.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        placeholder="Prayer title..."
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
        placeholder="Write your prayer..."
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
      <Button title="Submit Prayer" onPress={handleAddPrayer} />

      {loading ? (
        <Text style={{ marginTop: 20, textAlign: "center" }}>
          Loading prayers...
        </Text>
      ) : (
        <FlatList
          style={{ marginTop: 20 }}
          data={prayers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 16 }}>{item.title}</Text>
              {item.content ? <Text>{item.content}</Text> : null}
              <Text style={{ fontSize: 12, color: "gray" }}>
                {item.approved ? "✅ Approved" : "⏳ Pending approval"}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
