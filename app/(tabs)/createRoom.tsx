import { View, Text, StyleSheet, TextInput, Button, Alert,  KeyboardAvoidingView, Platform } from "react-native";
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from "react";
import { getToken } from "../tokenManager";

export default function CreateRoomScreen() {
  const { nickname } = useLocalSearchParams(); // Odbieramy przekazany pseudonim
  const [playlistLink, setPlaylistLink] = useState(""); // Stan dla linku do playlisty

  const [token, setToken] = useState(null);
  useEffect(() => {
      const fetchToken = async () => {
        const storedToken = await getToken();
        setToken(storedToken);
      };
      fetchToken();
    }, []);

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
          "Authorization": `Bearer ${token}`, // Dodajemy token do nagłówków
        },
        body: JSON.stringify({
          nickname: nickname,
          playlist: playlistLink,
        }),
      });

      const data = await response.json();
      // console.log(data); 
      const roomId = data.roomId; 
      if (response.ok) 
      {
        router.push({ pathname: '/choosePlayer', params: { roomId, nickname } });  // tutaj przekazac id pokoju i na jakim uzytkowniku jestes zalogowany
      }
      else if(response.status === 401 || response.status === 403) 
      {
        router.push({ pathname: '/index', params: {} });
      }
      else {
        Alert.alert("Błąd", data.error || "Nie udało się utworzyć pokoju.");
      }
    } catch (error) {
      Alert.alert("Błąd", "Wystąpił problem: " + error.message);
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
        placeholder="Wklej link do playlisty Spotify"
        value={playlistLink}
        onChangeText={setPlaylistLink}
      />
      <Button title="Utwórz pokój" onPress={handleCreateRoom} />
    </KeyboardAvoidingView>
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
