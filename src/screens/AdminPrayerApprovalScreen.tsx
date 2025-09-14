// src/screens/AdminPrayerApprovalScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { fetchPrayers } from "../api/prayer";
import { approvePrayer, rejectPrayer } from "../api/admin";
import { Prayer } from "../types/prayers";

export default function AdminPrayerApprovalScreen() {
  const [pendingPrayers, setPendingPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPending = async () => {
    try {
      setLoading(true);
      const allPrayers = await fetchPrayers(false, ""); // fetch all, admin use
      const pending = allPrayers.filter((p) => !p.approved);
      setPendingPrayers(pending);
    } catch (err: any) {
      console.error("Failed to fetch prayers:", err.message);
      Alert.alert("Error", "Could not load prayers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPending();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await approvePrayer(id);
      setPendingPrayers((prev) => prev.filter((p) => p.id !== id));
      Alert.alert("Success", "Prayer approved & shared.");
    } catch (err: any) {
      console.error("Approve failed:", err.message);
      Alert.alert("Error", "Failed to approve prayer.");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectPrayer(id);
      setPendingPrayers((prev) => prev.filter((p) => p.id !== id));
      Alert.alert("Rejected", "Prayer was rejected.");
    } catch (err: any) {
      console.error("Reject failed:", err.message);
      Alert.alert("Error", "Failed to reject prayer.");
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading pending prayers...</Text>
      </View>
    );
  }

  if (pendingPrayers.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No pending prayers 🎉</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={pendingPrayers}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View
          style={{
            padding: 12,
            borderBottomWidth: 1,
            borderBottomColor: "#eee",
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.title}</Text>
          {item.content ? <Text>{item.content}</Text> : null}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 8,
            }}
          >
            <Button title="✅ Approve" onPress={() => handleApprove(item.id)} />
            <Button title="❌ Reject" onPress={() => handleReject(item.id)} />
          </View>
        </View>
      )}
    />
  );
}
