import { View, Text, StyleSheet, Button } from "react-native";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { getSocket } from "../socket";
import { useFocusEffect } from "@react-navigation/native";

export default function GameScreen() {
  const { roomId, nickname } = useLocalSearchParams();
  const [ownerId, setOwnerId] = React.useState<string | number | null>(null);
  const [round, setRound] = React.useState<number | null>(null);
  const [users, setUsers] = React.useState<Record<string, number>>({});

  useFocusEffect(
    React.useCallback(() => {
      const socket = getSocket();
      console.log("Socket ID:", socket.id);

      socket.emit("round-info", roomId);

      const handleRoundInfo = (data: any) => {
        // data ma strukturę: { id_owner, round, users }
        setOwnerId(data.id_owner);
        setRound(data.round);
        setUsers(data.users);
        console.log("Odpowiedź serwera round-info:", data);
      };

      socket.on("round-info-answer", handleRoundInfo);

      return () => {
        socket.off("round-info-answer", handleRoundInfo);
      };
    }, [roomId])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.round}>Runda: {round}</Text>
      <Text style={styles.text}>Kto dodał to na playliste</Text>
      <View style={styles.buttonsContainer}>
        {Object.entries(users).map(([user]) => (
          <View key={user} style={styles.userBlock}>
            <Button title={user} onPress={() => console.log(`Kliknięto: ${user}`)} color="#1976D2" />
          </View>
        ))}
      </View>
      <View style={styles.pointsContainer}>
        {Object.entries(users).map(([user, points]) => (
          <Text key={user} style={styles.points}>{user}: {points} pkt</Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    paddingTop: 40,
    backgroundColor: "#fff",
  },
  round: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  buttonsContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    marginTop: 40, // przesunięcie guzików niżej
  },
  userBlock: {
    width: "90%",
    marginBottom: 22,
    alignItems: "center",
    // powiększenie przycisku przez styl wrappera
  },
  pointsContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  points: {
    fontSize: 20,
    color: "#1976D2",
    marginVertical: 2,
    fontWeight: "bold",
    textAlign: "center",
  },
});
