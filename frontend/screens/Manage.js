import React, { useState, useEffect } from "react";
import { auth } from "../firebase.js";
import { useAuthContext } from "../hooks/useAuthContext.js";
import {
    StyleSheet,
    Text,
    View,
    TouchableWithoutFeedback,
  } from "react-native";
  import Footer from "../components/Footer.js";



  export default function Auth() {
   

  
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <View style={styles.container}>
          <View style={styles.main}>
            <Text style={styles.title}>Welcome</Text>
            <Text style={styles.subtitle}>This is glaucoma-mate</Text>
            <View style={styles.medContainer}>
            </View>
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
  