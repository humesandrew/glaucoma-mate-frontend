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
import { auth } from '../firebase.js';
import { onAuthStateChanged } from 'firebase/auth';

export default function Auth() {
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
      const userCredential = await login(email, password);
      const user = userCredential.user;

      if (user) {
        dispatch({ type: "LOGIN", payload: user });
        console.log("User token:", user.firebaseToken);
        setIsLoggedIn(true); // Update isLoggedIn state
      }
    } catch (error) {
      console.error("Login failed with error:", error);
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
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>This is glaucoma-mate</Text>
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
                {isLoading ? "Logging In..." : "Login"}
              </Text>
            </TouchableOpacity>
            <Text>Email entered: {email}</Text>
            <Text>Password entered: {password}</Text>
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
