// src/screens/AdminPrayerApprovalScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList } from "react-native";
import { fetchPrayers } from "../api/prayer";
import { approvePrayer, rejectPrayer } from "../api/admin";

type Prayer = {
  id: string;
  content: string;
  approved: boolean;
  user_id: string;
};

export default function AdminPrayerApprovalScreen() {
  const [pendingPrayers, setPendingPrayers] = useState<Prayer[]>([]);

  useEffect(() => {
    fetchPrayers()
      .then((allPrayers) =>
        setPendingPrayers(allPrayers.filter((p: Prayer) => !p.approved))
      )
      .catch(console.error);
  }, []);

  const handleApprove = async (id: string) => {
    await approvePrayer(id);
    setPendingPrayers(pendingPrayers.filter((p) => p.id !== id));
  };

  const handleReject = async (id: string) => {
    await rejectPrayer(id);
    setPendingPrayers(pendingPrayers.filter((p) => p.id !== id));
  };

  return (
    <FlatList
      data={pendingPrayers}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={{ padding: 10 }}>
          <Text>{item.content}</Text>
          <Button title="Approve" onPress={() => handleApprove(item.id)} />
          <Button title="Reject" onPress={() => handleReject(item.id)} />
        </View>
      )}
    />
  );
}
