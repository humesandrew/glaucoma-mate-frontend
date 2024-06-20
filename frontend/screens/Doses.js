import React, { useState, useEffect, useCallback } from "react";
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

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchMedications();
    });

    return unsubscribe;
  }, [navigation, fetchMedications]);

  const handleDoseButtonPress = async (medicationId) => {
    try {
      if (authToken && auth.currentUser) {
        const timestamp = new Date().toISOString(); // Get current timestamp
        const requestBody = {
          medicationId,
          user: user.firebaseUid, // Use firebaseUid instead of uid
          timestamp,
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
          "https://glaucoma-mate-backend.onrender.com/api/doses/",
          requestOptions
        );

        if (response.ok) {
          const responseData = await response.json();
          console.log("Dose logged successfully");
          Alert.alert("Success", "Dose taken")
          await fetchMedications(); // Re-fetch medications to update the state
        } else {
          const errorData = await response.json();
          console.log("Failed to log dose:", errorData.error);
          Alert.alert("Maximum dosage reached", "You do not need to take any more today")
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
