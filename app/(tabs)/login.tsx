import { View, Text, StyleSheet, TextInput, Button, Alert, Image, KeyboardAvoidingView, Platform } from "react-native";
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
        router.push('/home');
      } else {
        Alert.alert("Error", data.error || "Login failed.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred: " + error.message);
    }
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <Image 
        source={require('../../assets/images/logo.png')} 
        style={styles.logo} 
        resizeMode="contain"
      />
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
        color="#1ed760"
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000", // Czarny jako tło
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1ed760", // Zielony tekst
  },  input: {
    width: "80%",
    height: 40,
    borderColor: "#1ed760", // Zielony obramowanie
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    color: "#fff", // Biały tekst w inpucie
    backgroundColor: "#1a1a1a", // Ciemne tło inputu
    borderRadius: 8,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 50,
  },
});