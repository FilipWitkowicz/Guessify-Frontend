import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View>
      <Text>Ekran główny</Text>
      <Button title="Zaloguj się" onPress={() => router.push('/login')} />
      <Button title="Zarejestruj się" onPress={() => router.push('/register')} />
    </View>
  );
}
