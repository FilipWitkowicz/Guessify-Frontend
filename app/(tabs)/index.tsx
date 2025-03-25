import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Guessify</Text>
      <View style={styles.buttonContainer}></View>
        <View style={styles.buttonWrapper}>
          <Button title="Zaloguj się" onPress={() => router.push('/login')} />
        </View>
        <View style={styles.buttonWrapper}>
          <Button title="Zarejestruj się" onPress={() => router.push('/register')} />
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24, // Zwiększenie rozmiaru tekstu
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  buttonWrapper: {
    width: '80%', // Różna szerokość przycisków
    marginVertical: 10, // Dodanie marginesu między przyciskami
  },
});
