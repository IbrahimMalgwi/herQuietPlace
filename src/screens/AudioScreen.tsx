// src/screens/AudioScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

// Example audio data (replace with your real audio URLs)
const audioTracks = [
  {
    id: "1",
    title: "Morning Meditation",
    uri: "https://example.com/audio1.mp3",
  },
  {
    id: "2",
    title: "Evening Reflection",
    uri: "https://example.com/audio2.mp3",
  },
  {
    id: "3",
    title: "Daily Affirmation",
    uri: "https://example.com/audio3.mp3",
  },
];

export default function AudioScreen() {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const playAudio = async (track: {
    id: string;
    title: string;
    uri: string;
  }) => {
    try {
      setLoading(true);
      if (sound) {
        await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: track.uri },
        { shouldPlay: true }
      );
      setSound(newSound);
      setCurrentTrack(track.id);
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setIsPlaying(status.isPlaying);
        }
      });
    } catch (error) {
      console.log("Error loading audio:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePlayPause = async () => {
    if (!sound) return;
    const status = await sound.getStatusAsync();
    if (status.isLoaded) {
      if (status.isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    }
  };

  const renderItem = ({ item }: { item: (typeof audioTracks)[0] }) => {
    const isCurrent = currentTrack === item.id;
    return (
      <TouchableOpacity
        style={[styles.trackItem, isCurrent && styles.activeTrack]}
        onPress={() => playAudio(item)}
      >
        <Text style={styles.trackTitle}>{item.title}</Text>
        {isCurrent && (
          <Ionicons
            name={isPlaying ? "pause-circle" : "play-circle"}
            size={28}
            color="#4A90E2"
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Audio Library</Text>
      {loading && <ActivityIndicator size="large" color="#4A90E2" />}
      <FlatList
        data={audioTracks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      {sound && (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={togglePlayPause}
        >
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={28}
            color="#fff"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAEBD7",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#4A4A4A",
  },
  trackItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#E6E6FA",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
  },
  activeTrack: {
    backgroundColor: "#D0E8F2",
  },
  trackTitle: {
    fontSize: 16,
    color: "#4A4A4A",
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#4A90E2",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
});
