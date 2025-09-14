// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, Button } from "react-native";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../contexts/AuthContext";

type Prayer = {
    id: string;
    title: string;
    content: string;
    created_at: string;
    approved?: boolean;
    shared?: boolean;
};

const HomeScreen = ({ navigation }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [prayers, setPrayers] = useState<Prayer[]>([]);
    const [dailyStrength, setDailyStrength] = useState<string | null>(null);

    useEffect(() => {
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
        };

        loadData();
    }, [user]);

    if (loading) {
        return <ActivityIndicator size="large" style={{ flex: 1 }} />;
    }

    return (
        <View style={{ flex: 1, padding: 16 }}>
            {/* Daily Strength */}
            <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Daily Strength</Text>
                <Text>{dailyStrength}</Text>
            </View>

            {/* Prayers */}
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Prayers</Text>
                <FlatList
                    data={prayers}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View
                            style={{
                                padding: 12,
                                borderBottomWidth: 1,
                                borderColor: "#ddd",
                            }}
                        >
                            <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
                            <Text>{item.content}</Text>
                            <Text style={{ fontSize: 12, color: "gray" }}>
                                {new Date(item.created_at).toLocaleDateString()}
                            </Text>
                        </View>
                    )}
                />
            </View>

            {/* Sign in / Sign up options if guest */}
            {!user && (
                <View style={{ marginTop: 20 }}>
                    <Button title="Sign In" onPress={() => navigation.navigate("Login")} />
                    <Button title="Sign Up" onPress={() => navigation.navigate("Signup")} />
                </View>
            )}
        </View>
    );
};

export default HomeScreen;
