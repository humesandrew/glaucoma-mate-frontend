import React, { useState, useEffect, useContext } from "react";
import { auth } from "../firebase.js";

import { useAuthContext } from "../hooks/useAuthContext.js";
import { useLogout } from "../hooks/useLogout.js";

import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Header from "../components/Header";

export default function Doses({ route }) {
  const { authToken } = route.params || {};
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
        if (authToken) {
          // Make a request to your backend to get medications assigned to the user
          const response = await fetch(
            "https://glaucoma-mate-backend.onrender.com/api/medications/assigned",
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
                // Include the user's token for authentication
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            setMedications(data);
            console.log(data);
          } else {
            console.error("Error fetching medications:", response.statusText);
            // Log the actual error message if available
            const errorData = await response.json();
            console.error("Backend Error:", errorData.error);
          }
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
        {/* <Text style={styles.subtitle}>{user ? user.email : ""}</Text> */}
      </View>
      <TouchableOpacity onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      <View style={styles.centerContent}>
        <Text style={styles.doseTitle}>Doses Taken</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.medicationsContainer}>
          {medications.map((medication, index) => (
            <View style={styles.doseBox} key={index}>
              <Text>{medication.name}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  topContent: {
    alignItems: "center",
    marginTop: 25,
  },
  centerContent: {
    alignItems: "center",
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
    marginTop: 20,
  },
  logoutText: {
    fontSize: 18,
    color: "blue",
    marginTop: 10,
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  medicationsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: "center",
    marginTop: 20,
  },
  doseBox: {
    borderWidth: 2,
    borderRadius: 25,
    borderColor: "blue",
    backgroundColor: "lightblue",
    padding: 8,
    marginVertical: 10,
    width: "100%",
    height: "50%",
    justifyContent: "center",
  },
});
