// firebase.js

import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence, indexedDBLocalPersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAts5SVgRfuCSV3kXNFOjWPsPd5hfX-TYY",
  authDomain: "glaucoma-mate-firebase.firebaseapp.com",
  projectId: "glaucoma-mate-firebase",
  storageBucket: "glaucoma-mate-firebase.appspot.com",
  messagingSenderId: "873501986644",
  appId: "1:873501986644:web:f075df3eb22c62a7c442c1"
};

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
