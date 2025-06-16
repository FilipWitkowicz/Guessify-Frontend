import { View, Text, StyleSheet, Button } from "react-native";
import { router, useLocalSearchParams } from 'expo-router';
import React from "react";
import { getToken } from "../tokenManager";


export default function ChoosePlayerScreen() {
const { roomId, nickname } = useLocalSearchParams();
const [players, setPlayers] = React.useState([]);

  
React.useEffect(() => {

  const fetchPlayers = async () => {
    try {
      const token = await getToken();
      const response = await fetch("http://212.127.78.90:3000/get-room-players", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id_room: roomId }),
      });

      if (!response.ok) {
        console.error("Failed to fetch players:", response.statusText);
        throw new Error("Failed to fetch players");
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        console.log("Fetched players:", data);
        setPlayers(data);
      } else {
        console.error("Invalid players data:", data);
        setPlayers([]); // Fallback to an empty array
      }
    } catch (error) {
      console.error("Error fetching players:", error);
      setPlayers([]); // Fallback to an empty array
    }
  };

  fetchPlayers();
}, [roomId, nickname]);

const handleSelectPlayer = (selectedPlayer) => {
  const updateUserRoomName = async () => {
    try {
      const token = await getToken();
      const response = await fetch("http://212.127.78.90:3000/set-user-room-name", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id_room: roomId, user_room_name: nickname, user_spotify_name: selectedPlayer }),
      });

      if (!response.ok) {
        if(response.status === 401 || response.status === 403) 
        {
          router.push({ pathname: '/index', params: {} });
        }
        else if (response.status === 500) {
          alert("Ten użytkownik jest już przypisany.");
        } else {
          console.error("Failed to update user room name:", response.statusText);
          throw new Error("Failed to update user room name");
        }
        return;
      }

      console.log("User room name updated successfully");
      router.push({
        pathname: "/preGame",
        params: { roomId, nickname },
      });
    } catch (error) {
      console.error("Error updating user room name:", error);
    }
  };

  updateUserRoomName();
};

return (
  <View style={styles.container}>
    <Text style={styles.title}>{roomId} Wybierz gracza:</Text>
    {players.length > 0 ? (
      players.map((player, index) => (
        <View key={index} style={styles.buttonContainer}>
          <Button title={player} onPress={() => handleSelectPlayer(player)} />
        </View>
      ))    ) : (
      <Text style={styles.noPlayersText}>Brak dostępnych graczy.</Text>
    )}
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#000", // Czarne tło
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#1ed760", // Zielony tekst
    textAlign: "center",
  },
  buttonContainer: {
    marginBottom: 15,
    width: "80%",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#1ed760", // Zielone tło przycisków
    shadowColor: "#1ed760",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  noPlayersText: {
    fontSize: 18,
    color: "#888", // Szary tekst dla komunikatu o braku graczy
    fontStyle: "italic",
  },
});
