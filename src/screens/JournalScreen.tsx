import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { supabase } from "../lib/supabaseClient";
import { Journal } from "../types/journal";

export default function JournalScreen() {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [newEntry, setNewEntry] = useState("");

  const fetchJournals = async () => {
    const { data, error } = await supabase
      .from("journals")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching journals:", error);
      return;
    }

    setJournals(data || []);
  };

  const addJournal = async () => {
    if (!newEntry.trim()) return;

    const { data, error } = await supabase
      .from("journals")
      .insert([{ title: newEntry }])
      .select()
      .single();

    if (error) {
      console.error("Error adding journal:", error);
      return;
    }

    setJournals([data, ...journals]);
    setNewEntry("");
  };

  useEffect(() => {
    fetchJournals();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Journal</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Write a new entry..."
          value={newEntry}
          onChangeText={setNewEntry}
        />
        <TouchableOpacity style={styles.addButton} onPress={addJournal}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={journals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.entryCard}>
            <Text style={styles.entryTitle}>{item.title}</Text>
            {item.content ? (
              <Text style={styles.entryContent}>{item.content}</Text>
            ) : null}
            <Text style={styles.date}>
              {new Date(item.created_at).toLocaleDateString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FFF" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  inputRow: { flexDirection: "row", marginBottom: 15 },
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: "#A8C1B4",
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  entryCard: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  entryTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  entryContent: { fontSize: 14, color: "#555", marginTop: 5 },
  date: { fontSize: 12, color: "#999", marginTop: 8 },
});
