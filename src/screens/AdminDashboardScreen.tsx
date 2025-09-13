import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, StyleSheet, Alert } from "react-native";
import { supabase } from "../lib/supabaseClient";
import { colors } from "../theme/colors";
import { useAuth } from "../contexts/AuthContext";

export default function AdminDashboardScreen() {
  const { role } = useAuth(); // ✅ from AuthContext
  const [prayers, setPrayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Only fetch if admin
  const fetchPrayers = async () => {
    if (role !== "admin") return;

    setLoading(true);
    const { data, error } = await supabase
      .from("prayers")
      .select("*")
      .eq("approved", false);

    if (error) {
      console.error(error);
      Alert.alert("Error", "Could not fetch pending prayers.");
    } else {
      setPrayers(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPrayers();
  }, [role]);

  const approvePrayer = async (id: string) => {
    const { error } = await supabase
      .from("prayers")
      .update({ approved: true })
      .eq("id", id);

    if (error) {
      Alert.alert("Error", "Could not approve prayer.");
    } else {
      setPrayers((prev) => prev.filter((p) => p.id !== id));
    }
  };

  if (role !== "admin") {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Access Denied</Text>
        <Text style={styles.text}>
          You do not have permission to view this page.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Admin Dashboard</Text>

      {/* ✅ Pending Prayers Section */}
      <Text style={styles.sectionTitle}>Pending Prayers</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={prayers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.text}>{item.content}</Text>
              <Button title="Approve" onPress={() => approvePrayer(item.id)} />
            </View>
          )}
        />
      )}

      {/* ✅ Daily Strength Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add Daily Strength</Text>
        <Button
          title="Add New Message"
          onPress={() => Alert.alert("TODO", "Add daily strength form")}
        />
      </View>

      {/* ✅ Upload Audio Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upload Audio</Text>
        <Button
          title="Upload File"
          onPress={() => Alert.alert("TODO", "Pick and upload audio")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBackground,
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "600",
    color: colors.primaryText,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
    marginTop: 16,
    marginBottom: 8,
    color: colors.primaryAccent,
  },
  section: {
    marginVertical: 12,
  },
  card: {
    backgroundColor: colors.secondaryBackground,
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
  },
  text: {
    fontSize: 16,
    color: colors.primaryText,
    marginBottom: 8,
  },
});
