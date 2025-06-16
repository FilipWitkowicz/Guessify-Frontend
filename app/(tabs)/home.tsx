import { View, Text, StyleSheet, TextInput, Button, Alert, KeyboardAvoidingView, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { getToken } from "../tokenManager"; 

export default function HomeScreen() {
  const [token, setToken] = useState(null);
  const [nickname, setNickname] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await getToken();
      setToken(storedToken);
    };
    fetchToken();
  }, []);


  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      {token ? (
        <View style={styles.loggedInContainer}>
          <Text style={styles.label}>Podaj swój pseudonim:</Text>
          <TextInput
            style={styles.input}
            placeholder="Twój pseudonim"
            value={nickname}
            onChangeText={setNickname}
          />
          {nickname.trim().length > 0 && (
            <View style={styles.buttonContainer}>
              <Button title="Utwórz grę" onPress={() => router.push({ pathname: '/createRoom', params: { nickname } })} />
              <Button title="Dołącz do gry" onPress={() => router.push({ pathname: '/joinRoom', params: { nickname } })} />
            </View>
          )}
        </View>
      ) : (
        <View>
          <Text>Nie jesteś zalogowany!</Text>
          <Button title="Zaloguj się" onPress={() => router.push('/login')} />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#000", // Czarny jako tło
  },
  loggedInContainer: {
    width: "80%",
    alignItems: "center",
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: "#1ed760", // Zielony tekst
  },  input: {
    width: "100%",
    height: 40,
    borderColor: "#1ed760", // Zielony obramowanie
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    color: "#fff", // Biały tekst w inpucie
    backgroundColor: "#1a1a1a", // Ciemne tło inputu
    borderRadius: 8,
  },
  buttonContainer: {
    marginTop: 10,
    width: "100%",
    gap: 10,
  },
});
