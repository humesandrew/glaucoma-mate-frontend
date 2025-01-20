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
import Footer from "../components/Footer.js";

export default function Manage({ route, navigation }) {
  const { authToken } = route.params || {}; 
  const { user } = useAuthContext();
  const [allMedications, setAllMedications] = useState([]);

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

  const handleMedicationPress = async (medicationId) => {
    console.log("handleMedicationPress function called");
    console.log("Medication ID:", medicationId);
    console.log("User ID:", user ? user.firebaseUid : null); 

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
      console.log("response status:", response.status);

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
                onPress={() => handleMedicationPress(item._id)}
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
        <Footer authToken={authToken} />
      </View>
    </TouchableWithoutFeedback>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20, 
    paddingHorizontal: 10, 
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    marginBottom: 20, 
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
    textAlign: "center", 
  },
  medicationButton: {
    backgroundColor: "#DDDDDD",
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 5,

    alignItems: "center",
    width: "45%",
    borderWidth: 2,
    borderRadius: 12,
    height: 70, 
    justifyContent: "center", 
  },
  medicationText: {
    textAlign: "center",
    fontWeight: "bold",
  },
  brandName: {
    fontSize: 14,
    color: "#333", 
    marginTop: 2,
    fontStyle: "italic",
  },
});
