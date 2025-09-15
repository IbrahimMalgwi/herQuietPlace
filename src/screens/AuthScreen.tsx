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
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        if (data.user) {
          const { error: profileError } = await supabase
            .from("profiles")
            .insert([
              { id: data.user.id, email: data.user.email, role: "user" },
            ]);
          if (profileError) throw profileError;
        }

        Alert.alert(
          "Success",
          "Account created! Check your email for confirmation."
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert(
        "Enter your email",
        "Please enter your email to reset password"
      );
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `herquietplace://reset-password?email=${encodeURIComponent(
          email
        )}`,
      });
      if (error) throw error;

      Alert.alert("Check your email", "Password reset link has been sent.");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (user)
    return (
      <View style={styles.container}>
        <Text>You are already logged in!</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isSignUp ? "Sign Up" : "Login"}</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        autoCapitalize="none"
        keyboardType="email-address"
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

      {!isSignUp && (
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={[styles.toggleText, { marginTop: 5 }]}>
            Forgot Password?
          </Text>
        </TouchableOpacity>
      )}

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
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  toggleText: {
    color: "#4A4A4A",
    textAlign: "center",
    marginTop: 10,
    textDecorationLine: "underline",
  },
});
