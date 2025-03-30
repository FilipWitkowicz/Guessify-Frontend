import * as SecureStore from 'expo-secure-store';

// Zapisuje token w SecureStore
export async function saveToken(token: string) {
    await SecureStore.setItemAsync('userToken', token);
}

// Pobiera token z SecureStore
export async function getToken(): Promise<string | null> {
    return await SecureStore.getItemAsync('userToken');
}

// Usuwa token (np. przy wylogowaniu)
export async function removeToken() {
    await SecureStore.deleteItemAsync('userToken');
}