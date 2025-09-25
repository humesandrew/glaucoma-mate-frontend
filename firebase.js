// firebase.js

import { initializeApp, getApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  indexedDBLocalPersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform, Alert } from "react-native";

// ✅ Use process.env directly since EAS injects vars from eas.json
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

console.log("🔥 Firebase Config:", firebaseConfig); // ✅ Expect full keys here

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// 🔔 TEMP: Show which Firebase project this TestFlight build is using
try {
  const { projectId, apiKey } = getApp().options || {};
  Alert.alert(
    "Firebase Config",
    `projectId: ${projectId || "N/A"}\napiKey: ${(apiKey || "").slice(0, 8)}...`
  );
} catch (e) {
  Alert.alert("Firebase Config", `Unable to read config: ${String(e)}`);
}
// Conditional persistence
let auth;
if (Platform.OS === "web") {
  auth = getAuth(app);
  auth.setPersistence(indexedDBLocalPersistence);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

export { auth };
