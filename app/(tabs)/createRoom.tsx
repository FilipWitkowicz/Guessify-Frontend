import { View, Text, StyleSheet, TextInput, Button, Alert } from "react-native";
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from "react";

export default function CreateRoomScreen() {
  const { nickname } = useLocalSearchParams(); // Odbieramy przekazany pseudonim
  const [playlistLink, setPlaylistLink] = useState(""); // Stan dla linku do playlisty

  const handleCreateRoom = async () => {
    if (!playlistLink.trim()) {
      Alert.alert("Błąd", "Podaj poprawny link do playlisty.");
      return;
    }

    try {
      const response = await fetch("http://212.127.78.90:3000/create-room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nickname: nickname,
          playlist: playlistLink,
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
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Witaj, {nickname}!</Text>
      <TextInput
        style={styles.input}
        placeholder="Wklej link do playlisty Spotify"
        value={playlistLink}
        onChangeText={setPlaylistLink}
      />
      <Button title="Utwórz pokój" onPress={handleCreateRoom} />
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
