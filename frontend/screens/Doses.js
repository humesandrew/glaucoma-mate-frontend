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
  const handleDoseButtonPress = () => {
    console.log("Dose button pressed");
    // Add logic to handle dose button press here
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
              <View style={styles.medicationInfo}>
                <View style={styles.medInfoLeft}>
                  <Text>{medication.name}</Text>
                  <Text>Dosage: {medication.dosage}</Text>
                </View>
                <View style={styles.doseButtonsContainer}>
                  {[...Array(medication.dosage + 1)].map((_, i) => (
                    <TouchableOpacity
                      key={i}
                      onPress={() => handleDoseButtonPress()}
                      style={[styles.doseButton, i === medication.dosage ? styles.lastDoseButton : null]}
                    >
                      <Text>{i + 1}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
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
    marginTop: 20,
  },
  medicationInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  doseBox: {
    borderWidth: 2,
    borderRadius: 25,
    borderColor: "blue",
    backgroundColor: "lightblue",
    padding: 8,
    marginVertical: 10,
    width: "100%",
  },
  medInfoLeft: {
    alignItems: "flex-start",
    marginLeft: 10, // Add margin to the left
  },
  doseButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  doseButton: {
    backgroundColor: "lightgray",
    padding: 5,
    borderRadius: "50%",
    marginLeft: 10,
  },
  lastDoseButton: {
    marginRight: 10,
  },
  doseTitle: {
    fontWeight: "bold",
    fontSize: 30,
    marginTop: 20,
  },
});