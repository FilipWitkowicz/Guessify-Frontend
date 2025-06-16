import { View, Text, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { getSocket } from "../socket";
import { router } from "expo-router";

export default function PostGameScreen() {
  const { roomId } = useLocalSearchParams();
  const [players, setPlayers] = React.useState<{ user: string; points: number }[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const socket = getSocket();
    socket.emit("postgame-ready", roomId);

    const handleRoomInfo = (data: any) => {
      // data to tablica [{ user, points }]
      if (Array.isArray(data)) {
        setPlayers(data);
      }
      setLoading(false);
    };

    socket.on("postgame-room-info", handleRoomInfo);
    return () => {
      socket.off("postgame-room-info", handleRoomInfo);
    };
  }, [roomId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gra się skończyła</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#1ed760" />
      ) : (
        <FlatList
          data={players}
          keyExtractor={item => item.user}
          renderItem={({ item }) => (
            <Text style={styles.player}>{item.user}: {item.points} pkt</Text>
          )}
        />
      )}
      <View style={{ marginTop: 40 }}>
        <Text
          onPress={() => router.push("/home")}
          style={{
            color: "#fff",
            backgroundColor: "#1ed760",
            paddingVertical: 12,
            paddingHorizontal: 32,
            borderRadius: 10,
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
            overflow: "hidden",
            marginBottom: 30,
          }}
        >
          Wróć do strony głównej
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1ed760",
    marginBottom: 30,
    textAlign: "center",
  },
  player: {
    fontSize: 22,
    color: "#fff",
    marginVertical: 8,
    fontWeight: "bold",
    textAlign: "center",
  },
});
