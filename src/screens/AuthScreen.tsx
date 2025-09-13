// src/screens/AuthScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../contexts/AuthContext";

export default function AuthScreen() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    try {
      let response;
      if (isSignUp) {
        // Sign up user
        response = await supabase.auth.signUp({ email, password });
        if (response.error) throw response.error;

        // Create profile in `profiles` table
        const { user: newUser } = response.data;
        if (newUser) {
          const { error: profileError } = await supabase
            .from("profiles")
            .insert([
              {
                id: newUser.id,
                email: newUser.email,
                role: "user", // default role
              },
            ]);

          if (profileError) throw profileError;
        }

        Alert.alert(
          "Success",
          "Account created! Check your email for confirmation."
        );
      } else {
        // Login
        response = await supabase.auth.signInWithPassword({ email, password });
        if (response.error) throw response.error;
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isSignUp ? "Sign Up" : "Login"}</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleAuth}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {isSignUp ? "Sign Up" : "Login"}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
        <Text style={styles.toggleText}>
          {isSignUp
            ? "Already have an account? Login"
            : "Don't have an account? Sign Up"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles remain the same

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAEBD7",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4A4A4A",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    backgroundColor: "#E6E6FA",
    marginBottom: 15,
    borderRadius: 8,
    paddingHorizontal: 15,
    color: "#4A4A4A",
  },
  button: {
    backgroundColor: "#A8C1B4",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  toggleText: {
    color: "#4A4A4A",
    textAlign: "center",
    marginTop: 10,
    textDecorationLine: "underline",
  },
});
