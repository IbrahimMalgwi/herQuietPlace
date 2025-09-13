import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { fetchAudio, fetchDailyStrength } from "../api/content";

type AudioItem = {
  id: string;
  title: string;
  url: string;
};

type DailyStrength = {
  id: string;
  message: string;
};

export default function HomeScreen() {
  const [audio, setAudio] = useState<AudioItem[]>([]);
  const [strength, setStrength] = useState<DailyStrength | null>(null);

  useEffect(() => {
    fetchAudio().then(setAudio).catch(console.error);
    fetchDailyStrength().then(setStrength).catch(console.error);
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
        Daily Strength: {strength?.message ?? "Loading..."}
      </Text>
      {audio.map((a) => (
        <Text key={a.id} style={{ marginVertical: 4 }}>
          🎵 {a.title}
        </Text>
      ))}
    </View>
  );
}
