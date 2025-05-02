import React, { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext.js";
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import * as Notifications from "expo-notifications"
import Footer from "../components/Footer.js";
import NotificationModal from "../components/NotificationModal.js";

export default function Manage({ route, navigation }) {
  const { authToken } = route.params || {}; // <-- Accept refreshMedications callback
  const { user } = useAuthContext();
  const [allMedications, setAllMedications] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);



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
        setAllMedications(data);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAllMedications();
  }, [authToken]);

  const handleMedicationPress = (medication) => {
    console.log("handleMedicationPress function called");
    console.log("Medication ID:", medication._id);
    console.log("User ID:", user ? user.firebaseUid : null);
  
    // Store the selected medication ID and open modal
    setSelectedMedication(medication)
    setModalVisible(true);
  };
  
  // API call now only happens when user confirms
  const assignMedication = async (medicationId) => {
    try {
      const requestBody = {
        medicationId,
        userId: user.firebaseUid || "",
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
        "https://glaucoma-mate-backend.onrender.com/api/medications/assign",
        requestOptions
      );
  
      console.log("Response status:", response.status);
  
      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(errorMessage.error);
      }
  
      const data = await response.json();
      console.log(data.message);
      Alert.alert("Success", "Medication assigned successfully");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", `Failed to assign medication: ${error.message}`);
    }
  };
  const handleConfirm = async (medication, times) => {
    // 1) Figure out “now”
    const now = new Date();
  
    // 2) For each picked time, create a Date object at that hour/minute…
    //    then if it’s already passed today, push it to tomorrow.
    for (const time of times) {
      const triggerDate = new Date(now);
      triggerDate.setHours(time.getHours(), time.getMinutes(), 0, 0);
      if (triggerDate <= now) {
        triggerDate.setDate(triggerDate.getDate() + 1);
      }
  
      // 3) Schedule exactly at that Date
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `💊 Time for ${medication.name}`,
          body: `Please take your ${medication.name} dose.`,
          data: { medicationId: medication._id },
        },
        trigger: triggerDate,
      });
    }
  
    // 4) Now call your backend assignment API
    await assignMedication(medication._id);
  
    // 5) Close the modal
    setModalVisible(false);
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
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => handleMedicationPress(item)}
                style={[
                  styles.medicationButton,
                  {
                    borderColor: item.capColor,
                    backgroundColor: item.capColor,
                    marginLeft: index % 2 === 0 ? 10 : 5,
                    marginRight: index % 2 !== 0 ? 10 : 10,
                  },
                ]}
              >
                <Text style={styles.medicationText}>{item.name}</Text>
                <Text style={styles.brandName}>{item.brand}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
        <NotificationModal
          visible={modalVisible}
          medication={selectedMedication}
          onClose={() => setModalVisible(false)}
          onConfirm={handleConfirm}
          // this will be onConfirm={assignMedication} //
        />
        <Footer authToken={authToken} />
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
    marginHorizontal: 5,

    alignItems: "center",
    width: "45%", // Set width for two-column layout
    borderWidth: 2,
    borderRadius: 12,
    height: 70, // Set a fixed height to make all buttons the same size
    justifyContent: "center", // Center content vertically
  },
  medicationText: {
    textAlign: "center",
    fontWeight: "bold",
  },
  brandName: {
    fontSize: 14,
    color: "#333", // Subtle text for brand name
    marginTop: 2,
    fontStyle: "italic",
  },
});
