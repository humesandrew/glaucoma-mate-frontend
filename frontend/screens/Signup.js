import React, { useState, useContext, useEffect } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Footer from "../components/Footer.js";
import { useLogin } from "../hooks/useLogin";
import { AuthContext } from "../context/AuthContext";
import { auth } from "../firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useLogin();
  const { dispatch } = useContext(AuthContext);
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track if user is logged in

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User is signed in:", user);

        // Obtain the Firebase authentication token directly from the user
        const authToken = await user.getIdToken();
        console.log("Firebase Token:", authToken);

        // Navigate to the Doses screen with authToken as a parameter
        navigation.navigate("Doses", { authToken });
        setIsLoggedIn(true); // Set isLoggedIn to true
      } else {
        console.log("No user is signed in.");
        setIsLoggedIn(false); // Set isLoggedIn to false
      }
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, [navigation]); // Include navigation in the dependency array to prevent unnecessary re-renders

  const handleSubmit = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      if (user) {
        console.log("User signed up with Firebase:", user);
        const authToken = await user.getIdToken();
        console.log("Firebase Token:", authToken);
  
        // Make a request to your backend to create a MongoDB user record
        const backendResponse = await fetch('https://glaucoma-mate-backend.onrender.com/api/user/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`, // Assuming your backend uses this for validation
          },
          body: JSON.stringify({
            email: user.email, // Include any other user info necessary for your backend
            firebaseUid: user.uid,
          }),
        });
  
        if (!backendResponse.ok) {
          throw new Error('Failed to create user record in MongoDB.');
        }
  
        // Assuming backend responds with user data including MongoDB user ID
        const mongoUserData = await backendResponse.json();
        console.log("MongoDB user record created:", mongoUserData);
  
        dispatch({ type: "LOGIN", payload: { ...user, mongoUserId: mongoUserData._id } });
        navigation.navigate("Doses", { authToken });
  
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Signup or user record creation failed:", error);
    }
  };
  
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.container}>
        <View style={styles.main}>
          <Text style={styles.title}>Signup</Text>
          <Text style={styles.subtitle}>
            An app to manage your glaucoma medications
          </Text>
          <View style={styles.formContainer}>
            <Text>Email</Text>
            <TextInput
              style={styles.input}
              onChangeText={(val) => setEmail(val)}
            />
            <Text>Password</Text>
            <TextInput
              style={styles.input}
              onChangeText={(val) => setPassword(val)}
              secureTextEntry // For password fields
            />
            <TouchableOpacity
              onPress={handleSubmit}
              style={styles.button}
              disabled={isLoading} // Disable the button while loading
            >
              <Text style={styles.buttonText}>
                {isLoading ? "Signing up..." : "Signup"}
              </Text>
            </TouchableOpacity>
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>
        </View>
        <Footer />
        <StatusBar style="auto" />
      </View>
    </TouchableWithoutFeedback>
  );
}
// Styles...

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  formContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  main: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 50,
  },
  subtitle: {
    fontStyle: "italic",
  },
  input: {
    borderWidth: 1,
    borderColor: "#777",
    padding: 8,
    margin: 10,
    width: 300,
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
});
