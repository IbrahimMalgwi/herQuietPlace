// src/components/PrayerList.tsx
import React from "react";
import { FlatList, StyleSheet, RefreshControl } from "react-native";
import PrayerItem from "./PrayerItem";
import { theme } from "../theme/theme";

export interface Prayer {
  id: string;
  title: string;
  content?: string;
  approved: boolean;
  date?: string;
}

interface PrayerListProps {
  prayers: Prayer[];
  loading: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export default function PrayerList({
  prayers,
  loading,
  refreshing = false,
  onRefresh,
}: PrayerListProps) {
  return (
    <FlatList
      data={prayers}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <PrayerItem
          title={item.title}
          content={item.content}
          approved={item.approved}
        />
      )}
      style={styles.list}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing || loading}
            onRefresh={onRefresh}
            colors={[theme.colors.purpleDark]}
          />
        ) : undefined
      }
      contentContainerStyle={!prayers.length && styles.emptyList}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
