import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Header from "./components/Header";
import Home from "./screens/home";

export default function App() {
  const [email, setEmail] = useState("Email");
  const [password, setPassword] = useState("Password");

  return (
  
      <Home />
   
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
});
