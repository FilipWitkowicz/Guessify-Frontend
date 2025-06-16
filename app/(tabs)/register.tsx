import { View, Text, StyleSheet, TextInput, Button, Alert, Image, KeyboardAvoidingView, Platform } from "react-native";
import React, { useState } from "react";
import { useRouter } from 'expo-router';

export default function Page2Screen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // Używamy routera do nawigacji

  function handleRegister(email: string, password: string) {
    fetch("http://212.127.78.90:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (response.ok) {
          Alert.alert("Success", "Registration successful!");
          router.push('/login');
        } else {
          Alert.alert("Error", "Registration failed.");
        }
      })
      .catch((error) => {
        Alert.alert("Error", "An error occurred: " + error.message);
      });
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
        title="Register"
        onPress={() => handleRegister(username, password)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
    backgroundColor: "#000", // Czarny jako tło
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 50,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1ed760", // Zielony tekst
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "#1ed760", // Zielony obramowanie
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
});
