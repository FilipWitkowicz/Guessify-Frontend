import { View, Text, StyleSheet, Alert, TextInput, Button } from "react-native";
import React, { useState } from "react";
import { useRouter } from 'expo-router';
import { saveToken } from "../tokenManager";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); 

  async function handleLogin(email, password) {
    try {
      const response = await fetch("http://212.127.78.90:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await saveToken(data.token); // Zapisz token
        Alert.alert("Success", "Login successful!");
        router.push('/home');
      } else {
        Alert.alert("Error", data.error || "Login failed.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred: " + error.message);
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button
        title="Login"
        onPress={() => handleLogin(username, password)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
});