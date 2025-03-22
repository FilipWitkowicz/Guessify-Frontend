import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import { TextInput, Button, Alert } from "react-native";
import { useRouter } from 'expo-router';



export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // Używamy routera do nawigacji

  function handleLogin(email: string, password: string) {
    fetch("http://212.127.78.90:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => {
        if (response.ok) {
          Alert.alert("Success", "Login successful!");
          console.log("YUPIII!")
          router.push('/home');
        } else {
          Alert.alert("Error", "Login failed. Please check your credentials.");
        }
      })
      .catch((error) => {
        Alert.alert("Error", "An error occurred: " + error.message);
      });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Login</Text>
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
