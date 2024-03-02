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
import Header from "../components/Header";

export default function Doses({ route }) {
  const { authToken } = route.params || {};
  const { logout } = useLogout();
  const [medications, setMedications] = useState([]); // Initialize medications state
  const { user } = useAuthContext(); // Access user data from AuthContext
  const userId = auth.currentUser.uid; // Retrieve Firebase UID
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
  const handleDoseButtonPress = async (medicationId, userId) => {
    console.log("handleDoseButtonPress function called");
    console.log("Medication ID:", medicationId);
    console.log("User ID:", userId);
    
    try {
      if (authToken && auth.currentUser) {
        console.log("Making fetch request...");
  
        const timestamp = new Date().toISOString(); // Get current timestamp
       
        // Construct the request body
        const requestBody = {
          medicationId,
          user: userId || "", // Use the user ID passed as an argument or default to an empty string
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
    console.log("authToken:", authToken);
    console.log("auth.currentUser:", auth.currentUser);
  
    // Check if auth.currentUser is not null before logging its value
    if (auth.currentUser !== null) {
      console.log("Firebase Auth Status:", auth.currentUser);
    }
  
    console.log("Doses route", route.params);
  
    const fetchMedications = async () => {
      console.log("User:", user);
      try {
        if (authToken && auth.currentUser) {
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
  }, [authToken, user]); // Remove auth.currentUser from dependency array
  
  return (
    <View style={styles.container}>
      
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
                     onPress={() => {
                       handleDoseButtonPress(medication._id, user ? user.uid : null);
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
      <Header />
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