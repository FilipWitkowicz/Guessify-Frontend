import { View, Text, StyleSheet, Button, TouchableOpacity, Animated, Alert, Image } from "react-native";
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
  const [users, setUsers] = React.useState<Record<string, number>>({});  const [selectedUser, setSelectedUser] = React.useState<string | null>(null);
  const [userId, setUserId] = React.useState<string | number | null>(null);  const [isConfirmed, setIsConfirmed] = React.useState(false);  const [fadeAnim] = React.useState(new Animated.Value(1));
  const [scaleAnim] = React.useState(new Animated.Value(1));
  const [showSuccessImage, setShowSuccessImage] = React.useState(false);
  const [showFailImage, setShowFailImage] = React.useState(false);

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
  );  React.useEffect(() => {
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

    const socket = getSocket();      const handleNextRound = (result: any) => {
      console.log("Wynik sprawdzenia odpowiedzi:", result);
      
      // Sprawdź czy result nie jest pustą tablicą
      if (!result || result.length === 0) {
        console.log("Brak wyników, przechodzę do następnej rundy");
        setTimeout(() => {
          router.replace({ pathname: "/game", params: { roomId, nickname } });
        }, 1000);
        return;
      }
      
      // Sprawdź czy użytkownik miał poprawną odpowiedź
      const userResult = result.find((item: any) => item.id_guesser === userId);
      const isCorrect = userResult && userResult.user_spotify_name === userResult.correct_spotify_name;
        if (isCorrect) {
        // Pokaż obrazek sukcesu na 2 sekundy
        setShowSuccessImage(true);
        
        // Ukryj obrazek po 2 sekundach
        setTimeout(() => {
          setShowSuccessImage(false);
        }, 2000);
        
        // Animacja pulsowania
        Animated.sequence([
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 1.2,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
              toValue: 0.8,
              duration: 300,
              useNativeDriver: true,
            })
          ]),
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            })
          ])
        ]).start(() => {          // Po animacji przejdź na następny ekran
          setTimeout(() => {
            router.replace({ pathname: "/game", params: { roomId, nickname } });
          }, 500);        });
      } else {
        // Pokaż obrazek niepowodzenia na 2 sekundy
        setShowFailImage(true);
        
        // Ukryj obrazek po 2 sekundach
        setTimeout(() => {
          setShowFailImage(false);
        }, 2000);
        
        // Animacja pulsowania dla błędnej odpowiedzi
        Animated.sequence([
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 1.2,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
              toValue: 0.8,
              duration: 300,
              useNativeDriver: true,
            })
          ]),
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            })
          ])
        ]).start(() => {
          // Po animacji przejdź na następny ekran
          setTimeout(() => {
            router.replace({ pathname: "/game", params: { roomId, nickname } });
          }, 500);
        });
      }
    };

    socket.on("next-round", handleNextRound);

    return () => {
      socket.off("next-round", handleNextRound);
    };
  }, [roomId, nickname, userId, fadeAnim, scaleAnim, router]);

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
    socket.emit("check-answers", roomId);
    console.log("Wysłano check-asnwers:", roomId);    
  };
  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
          backgroundColor: "#000", // Czarny jako tło
        }
      ]}
    >
      <Text style={[styles.round, { color: "#1ed760" }]}>Runda: {round}</Text>
      <Text style={[styles.text, { color: "#1ed760" }]}>Kto dodał to na playliste</Text>
      <View style={[styles.buttonsContainer, { borderColor: "#1ed760" }]}>
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
      {/* Obrazek sukcesu */}
      {showSuccessImage && (
        <View style={styles.successOverlay}>
          <Image 
            source={require('../../assets/images/success-checkmark.png')} 
            style={styles.successImage}
            resizeMode="contain"
          />
        </View>
      )}
      {/* Obrazek niepowodzenia */}
      {showFailImage && (
        <View style={styles.failOverlay}>
          <Image 
            source={require('../../assets/images/fail-checkmark.png')} 
            style={styles.failImage}
            resizeMode="contain"
          />
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    paddingTop: 40,
    backgroundColor: "#000",
  },
  round: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#1ed760",
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    color: "#1ed760",
  },
  buttonsContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    marginTop: 40,
    borderColor: "#1ed760",
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
    color: "#1ed760",
    marginVertical: 2,
    fontWeight: "bold",
    textAlign: "center",
  },  buttonContainer: {
    marginTop: 20,
    width: "70%",
  },
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },  successImage: {
    width: 150,
    height: 150,
  },
  failOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  failImage: {
    width: 150,
    height: 150,
  },
});
