import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { getSocket } from "../socket";
import { useFocusEffect } from "@react-navigation/native";
import { getToken } from "../tokenManager";
import { jwtDecode } from "jwt-decode";


export default function GameScreen() {
  const { roomId, nickname } = useLocalSearchParams();
  const [ownerId, setOwnerId] = React.useState<string | number | null>(null);
  const [round, setRound] = React.useState<number | null>(null);
  const [users, setUsers] = React.useState<Record<string, number>>({});
  const [selectedUser, setSelectedUser] = React.useState<string | null>(null);
  const [userId, setUserId] = React.useState<string | number | null>(null);
  const [isConfirmed, setIsConfirmed] = React.useState(false);

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

  React.useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = await getToken();
        if (token) {
          const decoded: any = jwtDecode(token);
          setUserId(decoded.id);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    };
    fetchUserId();
  }, []);

  const handleSelectUser = (user: string) => {
    if (!isConfirmed) {
      setSelectedUser(user);
    }
  };

  const handleConfirm = () => {
    const socket = getSocket();
    if (selectedUser) {
      socket.emit("select-choice", { roomId, selectedUser, userId });
      console.log("Wysłano select-choice:", { roomId, selectedUser, userId });
      setIsConfirmed(true); // blokuj dalsze wybory
    }
  };

  const handleNextRound = () => {
    const socket = getSocket();
    socket.emit("check-asnwers", roomId);

    socket.on("next-round", () => {
      console.log("Otrzymano wiadomość next-round na socket!");
      //sprawdzenie czy odpowiedz byla poprawna
      //animacja

      router.push({ pathname: "/game", params: { roomId, nickname } });
    });

  };

  return (
    <View style={styles.container}>
      <Text style={styles.round}>Runda: {round}</Text>
      <Text style={styles.text}>Kto dodał to na playliste</Text>
      <View style={styles.buttonsContainer}>
        {Object.entries(users).map(([user]) => (
          <TouchableOpacity
            key={user}
            style={[
              styles.userButton,
              selectedUser === user && styles.userButtonSelected,
            ]}
            onPress={() => handleSelectUser(user)}
            activeOpacity={0.7}
          >
            <Text style={styles.userButtonText}>{user}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.pointsContainer}>
        {Object.entries(users).map(([user, points]) => (
          <Text key={user} style={styles.points}>{user}: {points} pkt</Text>
        ))}
      </View>
      <TouchableOpacity
        style={[
          styles.confirmButton,
          selectedUser ? styles.confirmButtonActive : styles.confirmButtonDisabled,
        ]}
        onPress={handleConfirm}
        disabled={!selectedUser || isConfirmed}
        activeOpacity={0.8}
      >
        <Text style={styles.confirmButtonText}>Zatwierdź</Text>
      </TouchableOpacity>
      {userId && ownerId && userId.toString() === ownerId.toString() && (
        <View style={styles.buttonContainer}>
          <Button title="Przejdź do następnej rundy" onPress={handleNextRound} />
        </View>
      )}
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
    marginTop: 40,
  },
  userButton: {
    width: "90%",
    paddingVertical: 18,
    backgroundColor: "#1976D2",
    borderRadius: 12,
    marginBottom: 18,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#1976D2",
  },
  userButtonSelected: {
    backgroundColor: "#1565C0",
    borderColor: "#FFD600",
  },
  userButtonText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  confirmButton: {
    marginTop: 30,
    width: "70%",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmButtonActive: {
    backgroundColor: "#43A047",
  },
  confirmButtonDisabled: {
    backgroundColor: "#BDBDBD",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
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
  buttonContainer: {
    marginTop: 20,
    width: "70%",
  },
});
