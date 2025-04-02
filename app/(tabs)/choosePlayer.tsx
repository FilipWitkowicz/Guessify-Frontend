import { View, Text, StyleSheet, Button } from "react-native";
import { router } from 'expo-router';
import React from "react";
import { getToken } from "../tokenManager";

const players = ["Fiflon", "Piotr", "Marco", "Filip"];

export default function ChoosePlayerScreen() {
  const handleSelectPlayer = (player) => {
    router.push({ pathname: "/game", params: { player } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wybierz gracza:</Text>
      {players.map((player) => (
        <View key={player} style={styles.buttonContainer}>
          <Button title={player} onPress={() => handleSelectPlayer(player)} />
        </View>
      ))}
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
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttonContainer: {
    marginBottom: 10,
    width: "80%",
  },
});
