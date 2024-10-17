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
  Alert,
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
  const handleTakeAllButtonPress = async (medicationId) => {
    try {
      if (!user || !user.firebaseUid) {
        console.error("No user ID available to take all doses.");
        return; // Stop the function if no user ID is available
      }

      if (authToken && auth.currentUser) {
        const requestBody = {
          medicationId,
          user: user.firebaseUid, // Use firebaseUid instead of uid
        };

        const requestOptions = {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        };

        const response = await fetch(
          "https://glaucoma-mate-backend.onrender.com/api/doses/takeAll",
          requestOptions
        );

        if (response.ok) {
          const responseData = await response.json();
          console.log("All doses taken successfully:", responseData);
          Alert.alert("Success", "All remaining doses taken for today.");
          fetchMedications(); // Refresh medications list to reflect the new doses
        } else {
          const errorData = await response.json();
          console.error("Failed to take all doses:", errorData.error);
          Alert.alert("Error", errorData.error);
        }
      } else {
        console.error("authToken or auth.currentUser is missing");
      }
    } catch (error) {
      console.error("Error taking all doses:", error.message);
      Alert.alert("Error", "Failed to take all doses.");
    }
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
          console.error("Error fetching medications:", response.statusText);
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
    const unsubscribe = navigation.addListener("focus", fetchMedications);

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
                ? {
                    ...medication,
                    dosesTakenToday: (medication.dosesTakenToday || 0) + 1,
                  }
                : medication
            )
          );
        } else {
          const errorData = await response.json();
          console.log("Failed to log dose:", errorData.error);
          Alert.alert(
            "Maximum dosage reached.",
            "You do not need to take any more today."
          );
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
      <View style={styles.centerContent}>
        <Text style={styles.doseTitle}>Click bubble to log a dose</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        {medications.map((medication, index) => (
          <View style={styles.medicationOuterContainer} key={index}>
            <View
              style={[
                styles.doseBox,
                {
                  backgroundColor: medication.capColor,
                  borderColor: medication.capColor,
                },
              ]}
            >
              <View style={styles.medicationInfo}>
                <View style={styles.medInfoLeft}>
                  <Text style={styles.medicationName}>{medication.name}</Text>
                  <Text style={styles.brandName}>{medication.brand}</Text>
                  <Text style={styles.brandName}>{medication.sig}</Text>
                </View>
                <View style={styles.doseButtonsContainer}>
                  {[...Array(medication.dosage)].map((_, i) => (
                    <TouchableOpacity
                      onPress={() => handleDoseButtonPress(medication._id)}
                      style={[
                        styles.doseButton,
                        i === medication.dosage ? styles.lastDoseButton : null,
                      ]}
                      key={i}
                    >
                      <Text>{i + 1}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => handleTakeAllButtonPress(medication._id)}
              style={styles.takeAllButtonOutside}
            >
              <Text style={styles.takeAllButtonText}>Take All</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <Footer authToken={authToken} />
    </View>
  );
}

const styles = StyleSheet.create({
  medicationOuterContainer: {
    flexDirection: "row", // Align children (doseBox and Take All button) in a row
    justifyContent: "space-between", // Space between the doseBox and the Take All button
    alignItems: "center", // Align items vertically
    width: "100%", // Ensures that the row takes up the full width
    padding: 6,
    
  },
  takeAllButtonOutside: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "lightgrey", // Make it visually distinct
    justifyContent: "center", // Center the text vertically
    alignItems: "center",
    marginRight: 10,
    marginLeft: 10,
    // Space between doseBox and Take All button
    height: 50, // Set a fixed height for the button
    width: 90, // Optional: Set a fixed width to control size
  },

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
    position: "relative",
  },
  medicationInfo: {
    flexDirection: "row", // Ensures the dose buttons are on the same row as the name
    justifyContent: "space-between", // Ensure both the name and buttons are aligned within the row
    alignItems: "center", // Vertically center the content
    flex: 1, // Makes sure this takes up the remaining width
  },
  doseBox: {
    flex: 1, // Takes up the remaining space in the row
    borderWidth: 2,
    borderRadius: 25,
    padding: 6,
    marginVertical: 6,
    marginLeft: 10,
    borderRadius: 12,
    // Remove width here to allow it to flex
  },
  medInfoLeft: {
    alignItems: "flex-start",
    marginLeft: 10, // Add margin to the left
  },
  medicationName: {
    fontWeight: "bold",      // Keep it bold
    fontSize: 22,            // Increase the font size
    color: "#333",           // Use a dark gray color for better readability
    marginBottom: 9,         // Add some space below the name
  },
  brandName: {
    fontSize: 14,
    color: "#333",  // Subtle text for brand name
    marginTop: 2,
  },
  
  doseButtonsContainer: {
    flexDirection: "row", // Align dose buttons in a row
    justifyContent: "flex-end", // Push buttons to the right
    alignItems: "center", // Align buttons vertically
    flex: 1, // This ensures the container fills the remaining space inside medicationInfo
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
    marginTop: 15,
    marginBottom: 15,
  },
  doseButtonTaken: {
    backgroundColor: "darkblue",
  },
  takeAllButton: {
    // position: "absolute", // Position the button absolutely to float it on the right
    // right: 10, // Distance from the right edge of the doseBox
    top: "50%", // Center it vertically
    transform: [{ translateY: -17 }], // Adjust vertical centering
    backgroundColor: "lightgray",
    padding: 10,
    borderRadius: 5,
    marginLeft: 0,
    marginRight: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  takeAllButtonText: {
    color: "black",
    textAlign: "center",
  },
});
