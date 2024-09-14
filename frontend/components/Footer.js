import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useLogout } from "../hooks/useLogout.js";

export default function Footer({ authToken }) {
  const navigation = useNavigation();
  const { logout } = useLogout();

  const handleManagePress = () => {
    if (authToken) {
      navigation.navigate("Manage", { authToken });
    } else {
      // Optionally alert the user or navigate to the login screen
      Alert.alert("Access Denied", "You must be logged in to access Manage.");
      // navigation.navigate("Signin");
    }
  };

  const handleLogout = async () => {
    await logout();
    // Additional logic after logout if needed
  };

  return (
    <View style={styles.footer}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Glaucoma Buddy</Text>
      </View>
      <View style={styles.linksContainer}>
        {authToken && <TouchableOpacity onPress={handleManagePress}>
          <Text style={styles.link}>Manage</Text>
        </TouchableOpacity>}
        {authToken && (
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.link}>Logout</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0, // Ensure the footer extends to the right edge of the screen
    height: 50,
    backgroundColor: "coral",
    flexDirection: "row", // Arrange items horizontally
    alignItems: "center",
    justifyContent: "space-between", // Distribute items evenly along the main axis
    paddingHorizontal: 20, // Maintain horizontal padding for internal spacing
  },
  titleContainer: {
    flex: 1, // Allow this container to grow and fill space
    justifyContent: "center", // Center content vertically within the container
    alignItems: "center", // Center content horizontally within the container
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  linksContainer: {
    flexDirection: "row", // Layout links horizontally
  },
  link: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 20, // Add spacing between links
  },
});
