import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000", // Czarny jako tło
    padding: 20,
  },
  text: {
    fontSize: 18,
    color: "#1ed760", // Zielony tekst
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1ed760", // Zielony jako akcent
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "#1ed760", // Zielony obramowanie
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    color: "#fff", // Biały tekst w polu
    backgroundColor: "#222", // Ciemnoszare tło
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#1ed760", // Zielony przycisk
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#000", // Czarny tekst na zielonym przycisku
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonDisabled: {
    backgroundColor: "#555", // Szary dla nieaktywnego przycisku
  },
});