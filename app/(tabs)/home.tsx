import { View, Text, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import * as SecureStore from 'expo-secure-store';

export default function HomeScreen() {
  useEffect(() => {
    const fetchToken = async () => {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        console.log("Token:", token);
      } else {
        console.log("Brak tokena.");
      }
    };

    fetchToken();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>HOME</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 48, // Duży napis "HOME"
    fontWeight: "bold",
  },
});
