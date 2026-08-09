import * as SecureStore from 'expo-secure-store';

export function getSecureItem(key: string) {
  return SecureStore.getItemAsync(key);
}

export async function setSecureItem(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

export async function removeSecureItem(key: string) {
  await SecureStore.deleteItemAsync(key);
}
