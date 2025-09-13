import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import { createPrayer, fetchPrayers } from "../api/prayer";
import { useAuth } from "../hooks/useAuth";

type Prayer = {
  id: string;
  content: string; // ✅ matches DB column
  approved: boolean;
  user_id: string;
};

export default function PrayerScreen() {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [prayers, setPrayers] = useState<Prayer[]>([]);

  useEffect(() => {
    if (user) {
      // fetch only *approved* prayers for this user
      fetchPrayers(false, user.id).then(setPrayers).catch(console.error);
    }
  }, [user]);

  const handleAddPrayer = async () => {
    if (!user || !text.trim()) return;
    const newPrayer = await createPrayer(user.id, text);
    setPrayers([newPrayer, ...prayers]);
    setText("");
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Write your prayer..."
        value={text}
        onChangeText={setText}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          marginBottom: 10,
          padding: 8,
        }}
      />
      <Button title="Submit Prayer" onPress={handleAddPrayer} />
      <FlatList
        data={prayers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={{ marginVertical: 4 }}>{item.content}</Text>
        )}
      />
    </View>
  );
}
