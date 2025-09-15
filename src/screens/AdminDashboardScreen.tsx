import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { supabase } from "../lib/supabaseClient";

export default function AdminDashboardScreen() {
  const [audioFiles, setAudioFiles] = useState<string[]>([]);

  const fetchAudioFiles = async () => {
    const { data, error } = await supabase.storage
      .from("audio")
      .list("uploads");

    if (error) {
      console.error("Error fetching audio files:", error);
      return;
    }

    setAudioFiles(data?.map((file) => file.name) || []);
  };

  const pickAudio = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "audio/*",
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      console.log("User cancelled picker");
      return;
    }

    const file = result.assets[0]; // ✅ safely access file
    if (!file) {
      console.error("No file selected");
      return;
    }

    const { uri, name, mimeType } = file;

    const response = await fetch(uri);
    const blob = await response.blob();

    const { data, error } = await supabase.storage
      .from("audio")
      .upload(`uploads/${Date.now()}_${name}`, blob, {
        contentType: mimeType || "audio/mpeg",
      });

    if (error) {
      console.error("Upload error:", error);
    } else {
      console.log("Upload success:", data);
      fetchAudioFiles(); // refresh list
    }
  };

  useEffect(() => {
    fetchAudioFiles();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <TouchableOpacity style={styles.uploadButton} onPress={pickAudio}>
        <Text style={styles.buttonText}>Upload Audio</Text>
      </TouchableOpacity>

      <FlatList
        data={audioFiles}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.audioItem}>
            <Text style={styles.audioText}>{item}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#FAEBD7" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  uploadButton: {
    backgroundColor: "#A8C1B4",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  audioItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  audioText: { fontSize: 16, color: "#4A4A4A" },
});
