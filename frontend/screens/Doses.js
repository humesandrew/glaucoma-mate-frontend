import React, { useState, useEffect } from "react";
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
import Footer from "../components/Footer.js";

export default function Doses({ route }) {
  const { authToken } = route.params || {};
  const { logout } = useLogout();
  const [medications, setMedications] = useState([]); // Initialize medications state
  const { user } = useAuthContext(); // Access user data from AuthContext
  // const userId = auth.currentUser.uid; // Retrieve Firebase UID
  const handleLogout = async () => {
    await logout(); // Call the logout function
    // Additional logic after logout if needed
  };
  // Function to check if a dose has been taken today
  const isDoseTakenToday = (doseTimestamp) => {
    const today = new Date();
    const doseDate = new Date(doseTimestamp);
    return (
      today.getFullYear() === doseDate.getFullYear() &&
      today.getMonth() === doseDate.getMonth() &&
      today.getDate() === doseDate.getDate()
    );
  };
  const handleDoseButtonPress = async (medicationId) => {
    console.log("handleDoseButtonPress function called");
    console.log("Medication ID:", medicationId);
    console.log("User ID:", user ? user.firebaseUid : "No user ID");
  
    if (!user || !user.firebaseUid) {
      console.error("No user ID available to log dose.");
      return; // Stop the function if no user ID is available
    }
  
    try {
      if (authToken && auth.currentUser) {
        console.log("Making fetch request...");
  
        const timestamp = new Date().toISOString(); // Get current timestamp
  
        // Construct the request body
        const requestBody = {
          medicationId,
          user: user.firebaseUid, // Use firebaseUid instead of uid
          timestamp,
        };
  
        console.log("Request Body:", requestBody); // Log the request body before making the fetch request
  
        const requestOptions = {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        };
  
        const response = await fetch(
          "https://glaucoma-mate-backend.onrender.com/api/doses/",
          requestOptions
        );
  
        console.log("Response status:", response.status);
  
        if (response.ok) {
          const responseData = await response.json();
          console.log("Response data:", responseData);
          console.log("Dose logged successfully");
        } else {
          const errorData = await response.json();
          console.error("Failed to log dose:", errorData.error);
        }
      } else {
        console.log("authToken or auth.currentUser is missing");
      }
    } catch (error) {
      console.error("Error logging dose:", error.message);
    }
  };
  
  useEffect(() => {
    // This function sets up an auth state listener and fetches medications
    const setupAuthListenerAndFetchMedications = () => {
      console.log("Setting up auth state listener and fetching medications");

      // Set up auth state listener
      const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
        if (firebaseUser) {
          console.log("User is logged in:", firebaseUser);
          // User is logged in, proceed to fetch medications
          try {
            if (authToken) {
              const response = await fetch(
                "https://glaucoma-mate-backend.onrender.com/api/medications/assigned",
                {
                  headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                  },
                }
              );

              if (response.ok) {
                const data = await response.json();
                setMedications(data);
                console.log("Medications fetched successfully:", data);
              } else {
                console.error(
                  "Error fetching medications:",
                  response.statusText
                );
                // Attempt to log detailed error message if possible
                const errorData = await response.json();
                console.error("Backend Error:", errorData.error);
              }
            }
          } catch (error) {
            console.error("Error fetching medications:", error.message);
          }
        } else {
          // User is not logged in, clear medications
          console.log("User is logged out");
          setMedications([]);
        }
      });

      return unsubscribe; // Return the unsubscribe function for cleanup
    };

    const unsubscribe = setupAuthListenerAndFetchMedications();

    return () => {
      unsubscribe(); // Cleanup on component unmount or before re-running this effect
    };
  }, [authToken]); // Dependency on authToken, assuming it changes on login/logout

  return (
    <View style={styles.container}>
      <View style={styles.topContent}>
        <Text style={styles.title}>Welcome back</Text>
      </View>
      {/* <TouchableOpacity onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity> */}
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
                      onPress={() => {
                        handleDoseButtonPress(
                          medication._id,
                          user ? user.uid : null
                        );
                      }}
                      style={[
                        styles.doseButton,
                        i === medication.dosage ? styles.lastDoseButton : null,
                        medication.isTaken ? styles.doseButtonTaken : null,
                      ]}
                      key={i}
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
      <Footer authToken={authToken} />
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
  doseButtonTaken: {
    backgroundColor: "darkblue",
  },
});
