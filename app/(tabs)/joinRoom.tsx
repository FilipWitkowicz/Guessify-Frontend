import { View, Text, StyleSheet, TextInput, Button, Alert } from "react-native";
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from "react";
import { getToken } from "../tokenManager"; // Importujemy funkcję getToken

export default function CreateRoomScreen() {
  const { nickname } = useLocalSearchParams(); // Odbieramy przekazany pseudonim
  const [roomCode, setroomCode] = useState(""); // Stan dla linku do playlisty
  const [token, setToken] = useState(null);


  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await getToken();
      setToken(storedToken);
    };
    fetchToken();
  }, []);


  const handleCreateRoom = async () => {
    if (!roomCode.trim()) {
      Alert.alert("Błąd", "Podaj poprawny link do playlisty.");
      return;
    }

    try {
      const response = await fetch("http://212.127.78.90:3000/create-room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Dodajemy token do nagłówków
        },
        body: JSON.stringify({
          nickname: nickname,
          playlist: roomCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Sukces", "Pokój został utworzony!");
      } else {
        Alert.alert("Błąd", data.error || "Nie udało się utworzyć pokoju.");
      }
    } catch (error) {
      Alert.alert("Błąd", "Wystąpił problem: " + error.message);
    }
    router.push('/choosePlayer'); // tutaj przekazac id pokoju i na jakim uzytkowniku jestes zalogowany
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Witaj, {nickname}!</Text>
      <TextInput
        style={styles.input}
        placeholder="Podaj kod pokoju"
        value={roomCode}
        onChangeText={setroomCode}
      />
      <Button title="Dołącz do pokoju" onPress={handleCreateRoom} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 24,
    marginBottom: 10,
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
