import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import React from "react";

export default function PreGameScreen() {
  const { roomId } = useLocalSearchParams(); // Extract roomId from the parameters

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