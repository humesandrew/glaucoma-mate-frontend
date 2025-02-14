import React from "react";
import { Modal, View, Text, StyleSheet, Button } from "react-native";

export default function NotificationModal({ onClose, visible }) {
  console.log("NotificationModal rendered. Visible:", visible);

  return (
    <Modal
      animationType="slide"
      transparent={true} // ✅ Fix: Boolean value, not a string
      visible={visible} // ✅ Fix: Use the actual `visible` prop
      onRequestClose={onClose} // ✅ Fix: Handle Android back button
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>This is a modal.</Text>
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // ✅ Semi-transparent background
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
});
