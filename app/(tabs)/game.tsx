import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { getSocket } from "../socket";

export default function GameScreen() {
  const { roomId, nickname } = useLocalSearchParams();

  React.useEffect(() => {
    const socket = getSocket();
    console.log("Socket ID:", socket.id);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Witaj, {nickname} w pokoju o id: {roomId}</Text>
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
    fontWeight: "bold",
    textAlign: "center",
  },
});
