import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

function getWebStorage() {
  if (typeof localStorage === 'undefined') {
    return null;
  }

  return localStorage;
}

export function getSecureItem(key: string) {
  if (Platform.OS === 'web') {
    return Promise.resolve(getWebStorage()?.getItem(key) ?? null);
  }

  return SecureStore.getItemAsync(key);
}

export async function setSecureItem(key: string, value: string) {
  if (Platform.OS === 'web') {
    getWebStorage()?.setItem(key, value);
    return;
  }

  await SecureStore.setItemAsync(key, value);
}

export async function removeSecureItem(key: string) {
  if (Platform.OS === 'web') {
    getWebStorage()?.removeItem(key);
    return;
  }

  await SecureStore.deleteItemAsync(key);
}
