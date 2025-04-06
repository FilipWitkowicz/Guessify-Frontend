import { View, Text, StyleSheet, TextInput, Button, Alert } from "react-native";
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


  const handleCreateRoom = async () => {
     router.push({ pathname: '/choosePlayer', params: { roomId, nickname } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Witaj, {nickname}!</Text>
      <TextInput
        style={styles.input}
        placeholder="Podaj kod pokoju"
        value={roomId}
        onChangeText={setroomId}
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
