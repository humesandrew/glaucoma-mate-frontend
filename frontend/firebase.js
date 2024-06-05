// firebase.js

import { initializeApp } from "firebase/app";
import { initializeAuth, getAuth, onAuthStateChanged } from "firebase/auth";
import * as SecureStore from 'expo-secure-store';

// Custom persistence layer using Expo Secure Store
const secureStorePersistence = {
  type: 'LOCAL',
  async setItem(key, value) {
    await SecureStore.setItemAsync(key, value);
  },
  async getItem(key) {
    return await SecureStore.getItemAsync(key);
  },
  async removeItem(key) {
    await SecureStore.deleteItemAsync(key);
  }
};

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

// Initialize Firebase Auth with custom persistence
const auth = initializeAuth(app, {
  persistence: secureStorePersistence
});


export { auth, getAuth, onAuthStateChanged };

