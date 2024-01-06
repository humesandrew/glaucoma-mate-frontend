import React, { useState, useEffect, useContext } from "react";
import { auth } from '../firebase.js';

import { useAuthContext } from "../hooks/useAuthContext.js";
import { useLogout } from "../hooks/useLogout.js";

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Header from "../components/Header";

export default function Doses() {
  const { user } = useAuthContext(); // Access user data from AuthContext
  const { logout } = useLogout();
  const [medications, setMedications] = useState([]); // Initialize medications state

  const handleLogout = async () => {
    await logout(); // Call the logout function
    // Additional logic after logout if needed
  };

  useEffect(() => {
    const fetchMedications = async () => {
      console.log("User:", user);
      console.log("Firebase Auth Status:", auth.currentUser);
    // const firebaseData = auth.currentUser.uid;
    // console.log("uid:", firebaseData);
    try {
      if (auth.currentUser) {
        console.log(auth.currentUser);  // Add auth before currentUser
      }
    } catch (error) {
      console.error("Error fetching medications:", error.message);
    }
  };
    fetchMedications();
  }, [user]); // Include user in the dependency array to fetch medications when user changes

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.topContent}>
        <Text style={styles.title}>Welcome back</Text>
        {/* Display the user's email */}
        <Text style={styles.subtitle}>{user ? user.email : ""}</Text>
      </View>
      <View style={styles.centerContent}>
        <Text style={styles.doseTitle}>Doses Taken</Text>
      </View>
      <TouchableOpacity onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      <View style={styles.bottomContent}>
        {medications.map((medication, index) => (
          <View style={styles.doseBox} key={index}>
            <Text>{medication.name}</Text>
          </View>
        ))}
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    alignItems: "center",
    justifyContent: "space-around",
  },
  topContent: {
    flex: 1,
    justifyContent: "center",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center", // Center the text vertically
    marginTop: 50,
  },
  bottomContent: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 300, // Add padding to create space
  },
  title: {
    fontWeight: "bold",
    fontSize: 50,
  },
  subtitle: {
    fontStyle: "italic",
  },
  doseTitle: {
    fontWeight: "bold",
    fontSize: 30,
  },
  doseBox: {
    borderWidth: 2,
    borderRadius: 25,
    borderColor: "blue",
    backgroundColor: "lightblue",
    padding: 8,
    margin: 10,
    width: 300,
  },
});
