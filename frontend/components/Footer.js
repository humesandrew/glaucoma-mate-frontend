import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useLogout } from "../hooks/useLogout.js";

export default function Footer({ authToken }) {
  const navigation = useNavigation();
  const { logout } = useLogout();

  const handleManagePress = () => {
    navigation.navigate("Manage", { authToken: authToken }); // Navigate to the Manage screen
  };

  const handleLogout = async () => {
    await logout(); // Call the logout function
    // Additional logic after logout if needed
  };

  return (
    <View style={styles.footer}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Glaucoma-mate</Text>
      </View>
      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={handleManagePress}>
          <Text style={styles.link}>Manage</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.link}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: 50,
    backgroundColor: "coral",
    flexDirection: "row", // Arrange items horizontally
    alignItems: "center",
    justifyContent: "space-between", // Distribute items evenly along the main axis
    paddingHorizontal: 20, // Add padding horizontally
  },
  titleContainer: {
    flex: 1, // Take up remaining space
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  linksContainer: {
    flexDirection: "row", // Arrange items horizontally
  },
  link: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 20,
    // Add some space between the links
  },
});
