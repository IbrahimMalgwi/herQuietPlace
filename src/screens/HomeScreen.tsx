// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

type Prayer = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  approved?: boolean;
  shared?: boolean;
};

// Define the navigation prop for the UserStack screens
type UserStackParamList = {
  Home: undefined;
  Profile: undefined;
  CreatePrayer: undefined;
  PrayerDetail: { prayerId: string };
  // Add other UserStack screens here
};

type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "User"
> & {
  // Add the nested navigation methods
  navigate: <T extends keyof UserStackParamList>(
    screen: T,
    params?: UserStackParamList[T]
  ) => void;
};

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen = ({ navigation }: Props) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [dailyStrength, setDailyStrength] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);

    // 1. Fetch daily strength (always one for the day)
    const { data: ds } = await supabase
      .from("daily_strength")
      .select("message")
      .order("date", { ascending: false })
      .limit(1)
      .single();

    setDailyStrength(ds?.message || "No devotional today");

    // 2. Fetch prayers
    if (user) {
      // logged-in user → can see their own + admins will see all
      const { data: myPrayers, error } = await supabase
        .from("prayers")
        .select("id, title, content, created_at, approved, shared")
        .order("created_at", { ascending: false });

      if (!error && myPrayers) setPrayers(myPrayers);
    } else {
      // guest user → only from public_prayers
      const { data: publicPrayers, error } = await supabase
        .from("public_prayers")
        .select("id, title, content, created_at")
        .order("created_at", { ascending: false });

      if (!error && publicPrayers) setPrayers(publicPrayers);
    }

    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const renderPrayerItem = ({ item }: { item: Prayer }) => (
    <TouchableOpacity
      style={styles.prayerCard}
      onPress={() => {
        // For PrayerDetail, we'll need to handle this differently
        // since it's likely in the UserStack
        console.log("Navigate to prayer detail:", item.id);
        // You might want to use a different navigation approach here
      }}
    >
      <LinearGradient
        colors={["#FFFFFF", "#F8FAFC"]}
        style={styles.cardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.prayerTitle}>{item.title}</Text>
        <Text style={styles.prayerContent} numberOfLines={3}>
          {item.content}
        </Text>
        <View style={styles.prayerFooter}>
          <Text style={styles.prayerDate}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
          {item.shared && <Ionicons name="earth" size={16} color="#64748B" />}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Her Quiet Place</Text>
        {user && (
          <TouchableOpacity
            onPress={() => {
              // Profile is likely in UserStack, so we can navigate directly
              navigation.navigate("Profile");
            }}
          >
            <Ionicons name="person-circle" size={28} color="#64748B" />
          </TouchableOpacity>
        )}
      </View>

      {/* Daily Strength Card */}
      <View style={styles.dailyStrengthContainer}>
        <LinearGradient
          colors={["#7C3AED", "#6D28D9"]}
          style={styles.dailyStrengthCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.dailyStrengthHeader}>
            <Ionicons name="sparkles" size={20} color="#FFFFFF" />
            <Text style={styles.dailyStrengthTitle}>Daily Strength</Text>
          </View>
          <Text style={styles.dailyStrengthText}>{dailyStrength}</Text>
        </LinearGradient>
      </View>

      {/* Prayers Section */}
      <View style={styles.prayersContainer}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="heart" size={20} color="#7C3AED" />
            <Text style={styles.sectionTitle}>Recent Prayers</Text>
          </View>
          {user && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                // CreatePrayer is likely in UserStack
                navigation.navigate("CreatePrayer");
              }}
            >
              <Ionicons name="add-circle" size={24} color="#7C3AED" />
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={prayers}
          keyExtractor={(item) => item.id}
          renderItem={renderPrayerItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#7C3AED"]}
              tintColor="#7C3AED"
            />
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons
                name="document-text-outline"
                size={48}
                color="#CBD5E1"
              />
              <Text style={styles.emptyStateText}>No prayers yet</Text>
              <Text style={styles.emptyStateSubtext}>
                {user
                  ? "Create your first prayer"
                  : "Sign in to share your prayers"}
              </Text>
            </View>
          }
        />
      </View>

      {/* Sign in / Sign up options if guest */}
      {!user && (
        <View style={styles.authContainer}>
          <Text style={styles.authPrompt}>Join our community of faith</Text>
          <View style={styles.authButtons}>
            <TouchableOpacity
              style={[styles.authButton, styles.signInButton]}
              onPress={() => {
                // Navigate to Auth screen which should handle login
                navigation.navigate("Auth");
              }}
            >
              <Text style={styles.signInButtonText}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.authButton, styles.signUpButton]}
              onPress={() => {
                // Navigate to Auth screen which should handle signup
                navigation.navigate("Auth");
              }}
            >
              <Text style={styles.signUpButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    paddingTop: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E293B",
    fontFamily: "System",
  },
  dailyStrengthContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
    marginTop: 16,
  },
  dailyStrengthCard: {
    padding: 24,
    borderRadius: 20,
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  dailyStrengthHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  dailyStrengthTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  dailyStrengthText: {
    fontSize: 16,
    color: "#FFFFFF",
    lineHeight: 24,
    opacity: 0.95,
  },
  prayersContainer: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E293B",
  },
  addButton: {
    padding: 4,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  prayerCard: {
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    backgroundColor: "#FFFFFF",
  },
  cardGradient: {
    padding: 20,
    borderRadius: 16,
  },
  prayerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 8,
  },
  prayerContent: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
    marginBottom: 12,
  },
  prayerFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  prayerDate: {
    fontSize: 12,
    color: "#64748B",
    fontFamily: "System",
  },
  authContainer: {
    padding: 24,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  authPrompt: {
    textAlign: "center",
    fontSize: 16,
    color: "#475569",
    marginBottom: 20,
    fontFamily: "System",
  },
  authButtons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  authButton: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    minWidth: 120,
    alignItems: "center",
    borderWidth: 2,
  },
  signInButton: {
    backgroundColor: "transparent",
    borderColor: "#7C3AED",
  },
  signInButtonText: {
    color: "#7C3AED",
    fontWeight: "600",
    fontSize: 14,
  },
  signUpButton: {
    backgroundColor: "#7C3AED",
    borderColor: "#7C3AED",
  },
  signUpButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 48,
    marginTop: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#64748B",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
  },
});

export default HomeScreen;
