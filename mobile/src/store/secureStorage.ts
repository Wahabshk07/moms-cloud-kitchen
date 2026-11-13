import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

/**
 * SecureStore (Keychain / Keystore) on native.
 * expo-secure-store has no web implementation, so web falls back to AsyncStorage (dev only).
 */
const useNative = Platform.OS !== 'web';

export const secureStorage = {
  async get(key: string): Promise<string | null> {
    try {
      return useNative ? await SecureStore.getItemAsync(key) : await AsyncStorage.getItem(key);
    } catch {
      return null;
    }
  },
  async set(key: string, value: string): Promise<void> {
    try {
      if (useNative) await SecureStore.setItemAsync(key, value);
      else await AsyncStorage.setItem(key, value);
    } catch {
      // Ignore persistence failures; the in-memory session still works.
    }
  },
  async remove(key: string): Promise<void> {
    try {
      if (useNative) await SecureStore.deleteItemAsync(key);
      else await AsyncStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
};
