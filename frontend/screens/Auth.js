import React, { useState, useContext } from "react";
import {
  Image,
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
      <Image
            source={require('../assets/glaucomabuddylogo.png')}
            style={styles.logo}
            resizeMode="cover"
          />
        <View style={styles.main}>
      
          {/* <Text style={styles.title}>Glaucoma Buddy</Text> */}
          <Text style={styles.subtitle}>An app to help you manage and track your dosage of glaucoma eye drops. Developed by Andy Humes, humes.andrew@gmail.com. </Text>
          {/* <Text>Developed by Andy Humes, humes.andrew@gmail.com.</Text> */}
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setEmail}
              autoCapitalize="none"
              placeholder="Email"
            />
            <TextInput
              style={styles.input}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Password"
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
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 0,  // Maintain padding to prevent content from touching the edges
  },
  main: {
    flex: 1,
    justifyContent: "center",
    width: '100%',  // Ensure the main container takes the full available width
    paddingHorizontal: 50,  // Apply horizontal padding
  },
  logo: {
    width: '100%',  // Use the full width of the container
    height: '50%',  // Use 50% of the screen height
    marginBottom: -70,  // Apply negative margin if needed to pull the subtitle up
  },
  subtitle: {
    fontStyle: "italic",
    textAlign: "left", 
    marginTop: 0,  // Ensure there's no top margin adding space
    marginBottom: 10,  // Minimize the bottom margin
  },
  input: {
    borderWidth: 1,
    borderColor: "#777",
    padding: 8,
    marginVertical: 10,  // Apply vertical margin
    width: '100%',  // Input takes full width of the form container
    maxWidth: 300,  // Max width for better control on large screens
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',  // Button takes full width
    maxWidth: 300,  // Max width for the button
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginTop: 10,
    textAlign: "center",  // Center the error text
  },
  signupPromptContainer: {
    marginTop: 20,  // Adjust this value as needed to create space
    flexDirection: "row",  // Align text and button in a row if needed
    justifyContent: "center",  // Center content horizontally
  },
  signupText: {
    color: "blue",
    marginLeft: 5,  // Add space between text "Not a user yet?" and "Signup"
  },
});
