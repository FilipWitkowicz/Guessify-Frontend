import { View, Text, StyleSheet, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { io } from "socket.io-client";

export default function PreGameScreen() {
  const { roomId } = useLocalSearchParams();
  const [players, setPlayers] = React.useState<string[]>([]); // lista graczy

  React.useEffect(() => {
    const socket = io("http://212.127.78.90:3000");

    socket.emit("joinRoom", roomId);
    console.log("Socket connected to room:", roomId);
    alert(`Connected to room: ${roomId}`);

    socket.on("roomUsers", (userList: string[]) => {
      console.log("Otrzymano listę graczy:", userList);
      setPlayers(userList);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pre-Game Screen</Text>
      <Text style={styles.text}>Room ID: {roomId}</Text>

      <Text style={styles.playersTitle}>Gracze:</Text>
      <FlatList
        data={players}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={({ item }) => <Text style={styles.player}>{item}</Text>}
      />
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
    marginBottom: 20,
  },
  playersTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  player: {
    fontSize: 16,
    padding: 5,
  },
});
