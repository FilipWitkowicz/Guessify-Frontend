import { View, Text, StyleSheet, FlatList, Button, KeyboardAvoidingView, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { getSocket } from "../socket";
import { getToken } from "../tokenManager";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode

export default function PreGameScreen() {
  const { roomId, nickname } = useLocalSearchParams();
  const [players, setPlayers] = React.useState<any[]>([]); // lista graczy
  const [userId, setUserId] = React.useState<string | null>(null); // user_id extracted from token
  const router = useRouter();

  React.useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = await getToken(); // Get the token from SecureStore
        if (token) {
          const decoded: any = jwtDecode(token); // Decode the token
          setUserId(decoded.id); // Extract and set the user_id (assuming it's stored as "id")
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    };

    fetchUserId();

    const socket = getSocket();
    socket.emit("joinRoom", roomId);
    console.log("Socket connected to room:", roomId);

    socket.on("roomUsers", (userList: any[]) => {
      console.log("Otrzymano listę graczy:", userList);
      setPlayers(userList);
    });

    socket.on("game_start", () => {
      router.push({ pathname: "/game", params: { roomId, nickname } });
      console.log("Gra rozpoczęta, przekierowanie do ekranu gry");
    });

    return () => {
      socket.off("roomUsers");
      socket.off("game_start");
    };
  }, [roomId, nickname]);

  // Funkcja do wysyłania eventu admin-game-start
  const handleStartGame = () => {
    const socket = getSocket();
    console.log("Socket ID:", socket.id);
    socket.emit("admin-game-start", roomId);
    console.log("Wysłano event admin-game-start do pokoju:", roomId);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <Text style={styles.title}>Pre-Game Screen</Text>
      <Text style={styles.text}>Room ID: {roomId}</Text>
      <Text style={styles.text}>Nickname: {nickname}</Text>
      <Text style={styles.text}>User ID: {userId}</Text>

      <Text style={styles.playersTitle}>Gracze:</Text>
      <FlatList
        data={players}
        keyExtractor={(item) => item.id_user.toString()} // Używamy id_user jako klucza
        renderItem={({ item }) => (
          <Text style={styles.player}>
            {item.user_room_name} {item.is_admin ? "(Admin)" : ""}
          </Text>
        )}
      />
      {players.some((player) => player.id_user === userId && player.is_admin) && (
        <View style={styles.buttonContainer}>
          <Button title="Rozpocznij grę" onPress={handleStartGame} />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#000", // Czarne tło
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#1ed760", // Zielony tekst
    textAlign: "center",
  },
  text: {
    fontSize: 18,
    marginBottom: 15,
    color: "#fff", // Biały tekst
    textAlign: "center",
  },
  playersTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 20,
    color: "#1ed760", // Zielony tekst
    textAlign: "center",
  },
  player: {
    fontSize: 16,
    padding: 8,
    marginVertical: 2,
    color: "#fff", // Biały tekst
    backgroundColor: "#1a1a1a", // Ciemne tło dla graczy
    borderRadius: 6,
    textAlign: "center",
    minWidth: 200,
  },
  buttonContainer: {
    marginTop: 30,
    width: "80%",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#1ed760", // Zielone tło przycisku
    shadowColor: "#1ed760",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
});
