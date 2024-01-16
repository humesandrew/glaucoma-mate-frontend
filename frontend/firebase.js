// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

export const auth = getAuth(app); // Initialize the authentication module

