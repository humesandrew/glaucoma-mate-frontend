import React, { useState } from "react";
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
import { useSignup } from "../hooks/useSignup";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const navigateToDoses = () => navigation.navigate("Doses"); // Define navigation callback
  const { signup, isLoading, error } = useSignup(navigateToDoses); // Pass navigateToDoses to useSignup

  const handleSubmit = async () => {
    await signup(email, password, (params) => navigation.navigate("Doses", params)); // Pass navigateToDoses callback
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.main}>
          <Text style={styles.title}>Signup</Text>
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
            <Text>For your security, password must include a capital letter, a lower case letter, and a special character.</Text>
            <TouchableOpacity onPress={handleSubmit} disabled={isLoading} style={styles.button}>
              <Text style={styles.buttonText}>{isLoading ? "Signing Up..." : "Signup"}</Text>
            </TouchableOpacity>
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>
        </View>
        <Footer />
      </View>
    </TouchableWithoutFeedback>
  );
}

// Include your styles if necessary

// Styles can largely remain unchanged, though ensure they match your UI/UX design

// Styles...

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,  // Ensure there is padding on the sides of the screen
  },
  main: {
    flex: 1,
    justifyContent: "center",
    width: '100%',  // Ensure main container takes full available width
    paddingHorizontal: 20,  // Apply horizontal padding
  },
  title: {
    fontWeight: "bold",
    fontSize: 50,
    textAlign: "center",  // Ensure title is centered
  },
  formContainer: {
    width: '100%',  // Set width to 100% of its container
    maxWidth: 300,  // Max width can help to not stretch on larger screens
    alignSelf: 'center',  // Center the form container
    alignItems: "center",
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#777",
    padding: 8,
    marginVertical: 10,  // Consistent vertical margin
    width: '100%',  // Inputs take full width of the form container
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width: '100%',  // Button takes full width
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
