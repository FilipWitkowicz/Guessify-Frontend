import { View, Text, StyleSheet, TextInput, Button, Alert } from "react-native";
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
    <View style={styles.container}>
      <Text style={styles.text}>Strona 2</Text>
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
