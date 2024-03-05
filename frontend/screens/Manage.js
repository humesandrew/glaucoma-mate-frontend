import React, { useState, useEffect } from "react";
import { auth } from "../firebase.js";
import { useAuthContext } from "../hooks/useAuthContext.js";


import {
    StyleSheet,
    Text,
    View,
    TouchableWithoutFeedback,
    FlatList
  } from "react-native";
  import Footer from "../components/Footer.js";



  export default function Manage({ route }) {
    const { authToken } = route.params || {};
console.log(authToken);
const { user } = useAuthContext();
console.log(user);
const [medications, setMedications] = useState([]);

    useEffect(() => {
        const fetchMedications = async () => {
            try {
                const response = await fetch("https://glaucoma-mate-backend.onrender.com/api/medications/", {
                    headers: {
                        Authorization: `Bearer ${user.authToken}`, // Use the user's authToken for authentication
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch medications");
                }
                const data = await response.json();
                setMedications(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchMedications();
    }, []); // Fetch medications when authToken changes

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
                <View style={styles.main}>
                    <Text style={styles.title}>Manage Medications</Text>
                    <Text style={styles.subtitle}>Click to add or remove</Text>
                    <FlatList
                        data={medications}
                        keyExtractor={(medication) => medication._id}
                        renderItem={({ item }) => (
                            <View>
                                <Text>{item.name}</Text>
                                <Text>Dosage: {item.dosage}</Text>
                            </View>
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
      padding: 0,
      alignItems: "center",
      justifyContent: "center",
    },
    medContainer: {
      alignItems: "center",
      marginTop: 20,
    },
    main: {
      flex: 1,
      justifyContent: "center",
    },
    title: {
      fontWeight: "bold",
      fontSize: 50,
    },
    subtitle: {
      fontStyle: "italic",
    },
    button: {
      backgroundColor: "blue",
      padding: 10,
      borderRadius: 5,
      marginTop: 20,
      alignItems: "center",
    },
    buttonText: {
      color: "white",
      fontWeight: "bold",
    },
    errorText: {
      color: "red",
      marginTop: 10,
    },
  });
  