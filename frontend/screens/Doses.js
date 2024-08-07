import React, { useState, useEffect, useCallback } from "react";
import { auth } from "../firebase.js";
import { useAuthContext } from "../hooks/useAuthContext.js";
import { useLogout } from "../hooks/useLogout.js";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert
} from "react-native";
import Footer from "../components/Footer.js";

export default function Doses({ route, navigation }) {
  const { authToken } = route.params || {};
  const { logout } = useLogout();
  const [medications, setMedications] = useState([]); // Initialize medications state
  const { user } = useAuthContext(); // Access user data from AuthContext

  const handleLogout = async () => {
    await logout(); // Call the logout function
    // Additional logic after logout if needed
  };
  const handleTakeAllButtonPress = () => {
    Alert.alert("Info", "Feature not programmed yet.");
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

  const fetchMedications = useCallback(async () => {
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
          const errorData = await response.json();
          console.error("Backend Error:", errorData.error);
        }
      }
    } catch (error) {
      console.error("Error fetching medications:", error.message);
    }
  }, [authToken]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        await fetchMedications();
      } else {
        setMedications([]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [fetchMedications]);

  // Add navigation listener for focusing the screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchMedications);

    return unsubscribe;
  }, [navigation, fetchMedications]);

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
          Alert.alert("Success", "Dose stored in database.");

          // Update the medication state directly instead of refetching all medications
          setMedications((prevMedications) =>
            prevMedications.map((medication) =>
              medication._id === medicationId
                ? { ...medication, dosesTakenToday: (medication.dosesTakenToday || 0) + 1 }
                : medication
            )
          );
        } else {
          const errorData = await response.json();
          console.log("Failed to log dose:", errorData.error);
          Alert.alert("Maximum dosage reached.", "You do not need to take any more today.");
        }
      } else {
        console.log("authToken or auth.currentUser is missing");
      }
    } catch (error) {
      console.error("Error logging dose:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContent}>
        <Text style={styles.title}>Welcome back</Text>
      </View>
      <View style={styles.centerContent}>
        <Text style={styles.doseTitle}>Doses Taken</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.medicationsContainer}>
          {medications.map((medication, index) => (
            <View style={[styles.doseBox, { backgroundColor: medication.capColor }]} key={index}>
              <View style={styles.medicationInfo}>
                <View style={styles.medInfoLeft}>
                  <Text style={styles.medicationName}>{medication.name}</Text>
                  <Text>Drops per day: {medication.dosage}</Text>
                  <Text>Doses Taken: {medication.dosesTakenToday || 0}</Text>
                </View>
                <View style={styles.doseButtonsContainer}>
                  {[...Array(medication.dosage)].map((_, i) => (
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
                      ]}
                      key={i}
                    >
                      <Text>{i + 1}</Text>
                    </TouchableOpacity>
                  ))}
                   <TouchableOpacity
                    onPress={() => {
                      handleTakeAllButtonPress(
                        medication._id,
                        user ? user.uid : null
                      );
                    }}
                    style={styles.takeAllButton}
                  >
                    <Text style={styles.takeAllButtonText}>Take All</Text>
                  </TouchableOpacity>
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
  medicationName: {
    fontWeight: "bold", // Make the medication name bold
  },
  doseButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  doseButton: {
    backgroundColor: "lightgray",
    width: 30, // Set width
    height: 30, // Set height
    borderRadius: 15, // Half of width/height to make it circular
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  lastDoseButton: {
    marginRight: 20,
  },
  doseTitle: {
    fontWeight: "bold",
    fontSize: 30,
    marginTop: 20,
  },
  doseButtonTaken: {
    backgroundColor: "darkblue",
  },
  takeAllButton: {
    backgroundColor: "lightgray",
    padding: 10,
    borderRadius: 5,
    marginLeft: 20,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  takeAllButtonText: {
    color: "black",
    textAlign: "center"
    
  },
});
