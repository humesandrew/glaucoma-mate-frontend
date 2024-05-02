import React, { useState, useContext } from "react";
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

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useLogin();
  const { dispatch } = useContext(AuthContext);
  const navigation = useNavigation();
  const handleTemporaryLogout = () => {
    auth.signOut().then(() => {
      console.log("Logged out successfully");
      // Redirect to login or another appropriate page
    }).catch((error) => {
      console.error("Error logging out", error);
    });
  }
  const handleSubmit = async () => {
    try {
      const userCredential = await login(email, password);
      if (userCredential) {
        navigation.navigate("Doses");  // Assume successful login navigates to Doses
      }
    } catch (error) {
      console.error("Login failed with error:", error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.main}>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>This is IOP Buddy</Text>
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity onPress={handleSubmit} disabled={isLoading} style={styles.button}>
              <Text style={styles.buttonText}>
                {isLoading ? "Logging In..." : "Login"}
              </Text>
            </TouchableOpacity>
            <View style={styles.signupPromptContainer}>
              <Text>Not a user yet?</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                <Text style={styles.signupText}>Signup</Text>
              </TouchableOpacity>
            </View>
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
  signupPromptContainer: {
    marginTop: 10, // Adjust this value as needed to create space
    alignItems: "center", // This centers the text and button if that's what you want
  },
  signupText: {
    color: "blue", // Feel free to adjust this color
    // Any other styling you want for the "Signup" text
  },
});
