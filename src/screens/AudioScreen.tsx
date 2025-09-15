// src/screens/AudioScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../theme/theme";

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
  const [currentTrack, setCurrentTrack] = useState<
    (typeof audioTracks)[0] | null
  >(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0); // seconds
  const [duration, setDuration] = useState(0); // seconds

  useEffect(() => {
    return () => {
      if (sound) sound.unloadAsync();
    };
  }, [sound]);

  const playAudio = async (track: (typeof audioTracks)[0]) => {
    try {
      setLoading(true);
      if (sound) await sound.unloadAsync();

      const { sound: newSound, status } = await Audio.Sound.createAsync(
        { uri: track.uri },
        { shouldPlay: true }
      );
      setSound(newSound);
      setCurrentTrack(track);
      setIsPlaying(true);
      setDuration(status.durationMillis ? status.durationMillis / 1000 : 0);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setIsPlaying(status.isPlaying);
          setProgress(status.positionMillis / 1000);
          if (status.didJustFinish) {
            setIsPlaying(false);
            setProgress(0);
          }
        }
      });
    } catch (err) {
      console.error("Error loading audio:", err);
    } finally {
      setLoading(false);
    }
  };

  const togglePlayPause = async () => {
    if (!sound) return;
    const status = await sound.getStatusAsync();
    if (!status.isLoaded) return;

    if (status.isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const skipForward = async () => {
    if (!sound) return;
    const status = await sound.getStatusAsync();
    if (!status.isLoaded) return;
    await sound.setPositionAsync(
      Math.min(status.positionMillis + 10000, status.durationMillis || 0)
    );
  };

  const skipBackward = async () => {
    if (!sound) return;
    const status = await sound.getStatusAsync();
    if (!status.isLoaded) return;
    await sound.setPositionAsync(Math.max(status.positionMillis - 10000, 0));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const renderItem = ({ item }: { item: (typeof audioTracks)[0] }) => {
    const isCurrent = currentTrack?.id === item.id;
    return (
      <TouchableOpacity
        style={[styles.trackCard, isCurrent && styles.activeTrack]}
        onPress={() => playAudio(item)}
      >
        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle}>{item.title}</Text>
          {isCurrent && (
            <>
              <View style={styles.progressBarBackground}>
                <View
                  style={[
                    styles.progressBarForeground,
                    { flex: progress / (duration || 1) },
                  ]}
                />
                <View
                  style={[
                    styles.progressBarRemaining,
                    { flex: 1 - progress / (duration || 1) },
                  ]}
                />
              </View>
              <Text style={styles.trackTime}>
                {formatTime(progress)} / {formatTime(duration)}
              </Text>
            </>
          )}
        </View>
        {isCurrent && (
          <Ionicons
            name={isPlaying ? "pause-circle" : "play-circle"}
            size={28}
            color={theme.colors.primaryAccent}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Audio Library</Text>

      {loading && (
        <ActivityIndicator size="large" color={theme.colors.primaryAccent} />
      )}

      <FlatList
        data={audioTracks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      {currentTrack && (
        <View style={styles.miniPlayer}>
          <Text style={styles.miniTrackTitle}>{currentTrack.title}</Text>
          <View style={styles.miniControls}>
            <TouchableOpacity onPress={skipBackward}>
              <Ionicons
                name="play-back"
                size={32}
                color={theme.colors.primaryAccent}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={togglePlayPause}
              style={{ marginHorizontal: 20 }}
            >
              <Ionicons
                name={isPlaying ? "pause-circle" : "play-circle"}
                size={44}
                color={theme.colors.primaryAccent}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={skipForward}>
              <Ionicons
                name="play-forward"
                size={32}
                color={theme.colors.primaryAccent}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarForeground,
                { flex: progress / (duration || 1) },
              ]}
            />
            <View
              style={[
                styles.progressBarRemaining,
                { flex: 1 - progress / (duration || 1) },
              ]}
            />
          </View>
          <Text style={styles.trackTime}>
            {formatTime(progress)} / {formatTime(duration)}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primaryBackground,
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.colors.primaryText,
    marginBottom: 20,
    textAlign: "center",
  },
  trackCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.secondaryBackground,
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  activeTrack: {
    backgroundColor: theme.colors.primaryAccent + "20",
  },
  trackInfo: {
    flex: 1,
    marginRight: 10,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.primaryText,
  },
  progressBarBackground: {
    flexDirection: "row",
    height: 4,
    backgroundColor: "#ccc",
    borderRadius: 2,
    overflow: "hidden",
    marginTop: 6,
  },
  progressBarForeground: {
    backgroundColor: theme.colors.primaryAccent,
  },
  progressBarRemaining: {
    backgroundColor: "#eee",
  },
  trackTime: {
    fontSize: 12,
    color: theme.colors.secondaryText,
    marginTop: 2,
    textAlign: "right",
  },
  miniPlayer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.secondaryBackground,
    padding: 12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -3 },
  },
  miniTrackTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.primaryText,
    marginBottom: 8,
    textAlign: "center",
  },
  miniControls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
});
