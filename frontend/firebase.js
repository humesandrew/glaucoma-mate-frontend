// firebase.js

import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

// Initialize Firebase Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { auth };
