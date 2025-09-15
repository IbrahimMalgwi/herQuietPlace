import React, { useEffect, useState } from "react";
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
import { useRoute } from "@react-navigation/native";

export default function ResetPasswordScreen() {
  const route = useRoute();
  const params = route.params as { email?: string };
  const [email] = useState(params?.email ?? "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!password.trim())
      return Alert.alert("Error", "Please enter a new password.");
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      Alert.alert("Success", "Password has been updated. Please login again.");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      {email ? (
        <Text style={styles.info}>Resetting password for: {email}</Text>
      ) : null}
      <TextInput
        style={styles.input}
        placeholder="New Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleReset}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Reset Password</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#FAEBD7",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  info: { fontSize: 16, textAlign: "center", marginBottom: 15 },
  input: {
    height: 50,
    backgroundColor: "#E6E6FA",
    marginBottom: 15,
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#A8C1B4",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
