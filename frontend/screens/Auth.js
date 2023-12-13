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
import { useNavigation } from "@react-navigation/native"; // Import useNavigation hook
import Header from "../components/Header";
import { useLogin } from "../hooks/useLogin"; // Import your useLogin hook
import { useLogout } from "../hooks/useLogout"; // Import your useLogin hook
import {AsyncStorage} from 'react-native';

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, isLoading, error } = useLogin(); // Initialize the hook
  const { logout } = useLogout();

  // Get the navigation object
  const navigation = useNavigation();
  const handleSubmit = async () => {
    try {
      // Call the login function here
      await login(email, password);

      // Check if there is a user object in local storage
      const user = JSON.parse(localStorage.getItem("user"));
      console.log("User from local storage:", user);

      if (user && user.email && user.token) {
        // Navigate to the Doses screen
        console.log("Navigating to Doses screen");
        navigation.navigate("Doses");
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
        <Header />
        <StatusBar style="auto" />
      </View>
    </TouchableWithoutFeedback>
  );
}

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
