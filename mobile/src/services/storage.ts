import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    if (Platform.OS === "web") {
      return AsyncStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    if (Platform.OS === "web") {
      return AsyncStorage.setItem(key, value);
    }
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    if (Platform.OS === "web") {
      return AsyncStorage.removeItem(key);
    }
    return SecureStore.deleteItemAsync(key);
  },
  hasCompletedOnboarding: async (): Promise<boolean> => {
    try {
      const val = await ExpoSecureStoreAdapter.getItem("has_completed_onboarding");
      return val === "true";
    } catch {
      return false;
    }
  },
  setOnboardingCompleted: async (completed: boolean): Promise<void> => {
    try {
      await ExpoSecureStoreAdapter.setItem("has_completed_onboarding", completed ? "true" : "false");
    } catch (err) {
      // Storage error fallback
    }
  },
};
