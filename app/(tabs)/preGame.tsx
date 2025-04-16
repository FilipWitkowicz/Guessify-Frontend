import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { io } from "socket.io-client";


export default function PreGameScreen() {
  const { roomId } = useLocalSearchParams(); // Extract roomId from the parameters

  React.useEffect(() => {
    const socket = io("http://212.127.78.90:3000");
    socket.emit("joinRoom", roomId);
    console.log("Socket connected to room:", roomId);
    alert(`Connected to room: ${roomId}`);

    return () => {
      socket.disconnect(); // Clean up the socket connection when the component unmounts
    };
  }, [roomId]);



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pre-Game Screen</Text>
      <Text style={styles.text}>Room ID: {roomId}</Text>
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
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
  },
});