import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import Header from "../components/Header";
import { useLogout } from "../hooks/useLogout";

export default function Doses() {
  const [user, setUser] = useState(null);
  const [medications, setMedications] = useState([]);
 

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser && storedUser.email) {
          setUser(storedUser);

          const response = await fetch(
            "https://glaucoma-mate-backend.onrender.com/api/medications/assigned",
            {
              headers: {
                Authorization: `Bearer ${storedUser.token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            setMedications(data);
          } else {
            console.error("Error fetching medications:", response.statusText);
          }
        }
      } catch (error) {
        console.error("Error fetching medications:", error.message);
      }
    };

    fetchMedications();
  }, []);

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.topContent}>
        <Text style={styles.title}>Welcome back</Text>
        <TouchableOpacity>
          <Text style={styles.logoutButton}>Logout</Text>
        </TouchableOpacity>
        <Text style={styles.subtitle}>{user ? user.email : ""}</Text>
      </View>
      <View style={styles.centerContent}>
        <Text style={styles.doseTitle}>Doses Taken</Text>
      </View>
      <View style={styles.bottomContent}>
        <View style={styles.doseBox}>
          <Text>Latanoprost</Text>
        </View>
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
    marginTop: 50
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
  logoutButton: {
    color: "blue",
    textDecorationLine: "underline",
    marginTop: 10,
  },
});
