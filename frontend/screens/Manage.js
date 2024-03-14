import React, { useState, useEffect } from "react";
import { auth } from "../firebase.js";
import { useAuthContext } from "../hooks/useAuthContext.js";

import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Footer from "../components/Footer.js";

export default function Manage({ route }) {
  const { authToken } = route.params || {};
  const { user } = useAuthContext();
  const [allMedications, setAllMedications] = useState([]); // New state to store all medications

  useEffect(() => {
    const fetchAllMedications = async () => {
      try {
        const response = await fetch(
          "https://glaucoma-mate-backend.onrender.com/api/medications/",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch medications");
        }
        const data = await response.json();
        setAllMedications(data); // Set all medications in the state
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAllMedications();
  }, [authToken]); // Fetch medications when authToken changes

  const handleMedicationPress = async (medicationId, userId) => {
    console.log("handleMedicationPress function called");
    console.log("Medication ID:", medicationId);
    console.log("User ID:", userId);
    console.log(authToken);
    try {
      const requestBody = {
        medicationId,
        user: userId,
      };
      console.log("Request body", requestBody);
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      };

      const response = await fetch(
        "https://glaucoma-mate-backend.onrender.com/api/medications/assign",
        requestOptions
      );
      console.log("response status:", response.status);
      if (!response.ok) {
        throw new Error("Failed to assign medication to user");
      }

      const data = await response.json();
      console.log(data.message); // Log success message
    } catch (error) {
      console.error("Error assigning medication to user:", error.message);
      console.log(typeof userId, userId);
      // Handle error
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Manage Medications</Text>
          <Text style={styles.subtitle}>Click to add or remove</Text>
        </View>
        <View style={styles.main}>
          <FlatList
            data={allMedications} // Use allMedications state instead of medications
            keyExtractor={(medication) => medication._id}
            numColumns={2}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  handleMedicationPress(
                    item._id, 
                    user ? user.uid : null
                  )
                }
                style={styles.medicationButton}
              >
                <Text numberOfLines={2} style={styles.medicationText}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
        <Footer />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20, // Adjust vertical padding
    paddingHorizontal: 10, // Adjust horizontal padding
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    marginBottom: 20, // Add margin bottom to the header
  },
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 32,
  },
  subtitle: {
    fontStyle: "italic",
    textAlign: "center", // Center the text
  },
  medicationButton: {
    backgroundColor: "#DDDDDD",
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 5, // Adjust horizontal spacing between buttons
    alignItems: "center",
    width: "45%", // Set width for buttons to fit two columns
  },
  medicationText: {
    textAlign: "center",
  },
});
