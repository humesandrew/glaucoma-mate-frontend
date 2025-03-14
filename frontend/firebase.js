// firebase.js

import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence, indexedDBLocalPersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import Constants from "expo-constants";

// Your web app's Firebase configuration
const firebaseConfig = Constants.expoConfig.extra.firebase;

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Conditional persistence
let auth;
if (Platform.OS === 'web') {
  auth = getAuth(app);
  auth.setPersistence(indexedDBLocalPersistence);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}

export { auth };
