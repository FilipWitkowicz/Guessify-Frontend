import { View, Text, StyleSheet, TextInput, Button, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from "react";
import { getToken } from "../tokenManager"; // Importujemy funkcję getToken

export default function CreateRoomScreen() {
  const { nickname } = useLocalSearchParams(); // Odbieramy przekazany pseudonim
  const [roomId, setroomId] = useState(""); // Stan dla linku do playlisty
  const [token, setToken] = useState(null);


  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await getToken();
      setToken(storedToken);
    };
    fetchToken();
  }, []);


  const handleJoinRoom = async () => {
    try {
      const response = await fetch("http://212.127.78.90:3000/join-room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({ roomId, nickname }),
      });
      
      console.log("Response status:", response.status); // Debugging line
      if (response.status === 200) {
        // Jeśli status 200, przekieruj na ekran choosePlayer
        router.push({ pathname: "/choosePlayer", params: { roomId, nickname } });
      }
      else if(response.status === 401 || response.status === 403) 
      {
        router.push({ pathname: '/index', params: {} });
      }
      else {
        // Jeśli status inny niż 200, wyświetl błąd
        const errorData = await response.json();
        Alert.alert("Błąd", errorData.message || "Nie udało się dołączyć do pokoju.");
      }
    } catch (error) {
      // Obsługa błędów sieciowych
      Alert.alert("Błąd", "Wystąpił problem z połączeniem z serwerem.");
      console.error("Error joining room:", error);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <Text style={styles.text}>Witaj, {nickname}!</Text>
      <TextInput
        style={styles.input}
        placeholder="Podaj kod pokoju"
        value={roomId}
        onChangeText={setroomId}
      />
      <Button title="Dołącz do pokoju" onPress={handleJoinRoom} color="#1ed760" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#000", // Czarne tło
  },
  text: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#1ed760", // Zielony tekst
    textAlign: "center",
  },
  input: {
    width: "80%",
    height: 50,
    borderColor: "#1ed760", // Zielone obramowanie
    borderWidth: 2,
    marginBottom: 30,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: "#1a1a1a", // Ciemne tło inputu
    color: "#fff", // Biały tekst w inpucie
    fontSize: 16,
  },
});
