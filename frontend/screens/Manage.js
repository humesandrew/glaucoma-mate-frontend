import React, { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext.js";
import { StyleSheet, Text, View, TouchableWithoutFeedback, TouchableOpacity, FlatList, Alert } from "react-native";
import Footer from "../components/Footer.js";

export default function Manage({ route, navigation }) {
  const { authToken } = route.params || {}; // <-- Accept refreshMedications callback
  const { user } = useAuthContext();
  const [allMedications, setAllMedications] = useState([]);

  useEffect(() => {
    const fetchAllMedications = async () => {
      try {
        const response = await fetch("https://glaucoma-mate-backend.onrender.com/api/medications/", {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch medications");
        }
        const data = await response.json();
        setAllMedications(data);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAllMedications();
  }, [authToken]);

  const handleMedicationPress = async (medicationId) => {
    console.log("handleMedicationPress function called");
    console.log("Medication ID:", medicationId);
    console.log("User ID:", user ? user.firebaseUid : null); // Ensure this matches your backend expectation

    try {
      const requestBody = {
        medicationId,
        userId: user.firebaseUid || "", // Make sure you're using firebaseUid or the correct user identifier
      };
  
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      };
  
      const response = await fetch("https://glaucoma-mate-backend.onrender.com/api/medications/assign", requestOptions);
      console.log("response status:", response.status);
  
      if (!response.ok) {
        const errorMessage = await response.json();
        // console.error("Failed to assign medication to user:", errorMessage.error);
        throw new Error(errorMessage.error);
      }
      const data = await response.json();
      console.log(data.message);
      Alert.alert("Success", "Medication assigned successfully");
      navigation.goBack(); // <-- Navigate back to the previous screen
    } catch (error) {
      // console.error("Error assigning medication to user:", error.message);
      Alert.alert("Error", `Failed to assign medication: ${error.message}`);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Manage Medications</Text>
          <Text style={styles.subtitle}>Click to add or remove</Text>
        </View>
        <View style={styles.main}>
          <FlatList
            data={allMedications}
            keyExtractor={(item) => item._id}
            numColumns={2}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleMedicationPress(item._id)}
                style={[styles.medicationButton, { borderColor: item.capColor }]} // Set border color dynamically
              >
                <Text numberOfLines={2} style={styles.medicationText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
        <Footer authToken={authToken}/>
      </View>
    </TouchableWithoutFeedback>
  );
}

// Your StyleSheet remains unchanged

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
    borderWidth: 2, // Add border width
  },
  medicationText: {
    textAlign: "center",
  },
});
