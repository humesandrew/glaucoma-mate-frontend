// firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  indexedDBLocalPersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform, Alert } from "react-native";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

console.log("🔥 Firebase Config:", firebaseConfig);

const app = initializeApp(firebaseConfig);


import { Alert } from "react-native";
Alert.alert(
  "Firebase",
  `projectId=${firebaseConfig.projectId || "MISSING"}\napiKey=${firebaseConfig.apiKey ? firebaseConfig.apiKey.slice(0,8)+"…" : "MISSING"}`
);
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
