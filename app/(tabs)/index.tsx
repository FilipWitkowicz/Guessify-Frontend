import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Guessify</Text>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Button title="Zaloguj się" onPress={() => router.push('/login')} color="#1ed760" />
        </View>
        <View style={styles.buttonWrapper}>
          <Button title="Zarejestruj się" onPress={() => router.push('/register')} color="#1ed760" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000', // Czarne tło
    padding: 20,
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#1ed760', // Zielony tekst
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  buttonWrapper: {
    width: '80%',
    marginVertical: 15,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#1ed760', // Zielone tło przycisków
  },
});
