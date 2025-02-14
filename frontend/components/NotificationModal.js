import React from "react";
import { Modal, View, Text, StyleSheet, Button } from "react-native";

export default function NotificationModal({ onClose, visible, medicationId, onConfirm }) {
  console.log("NotificationModal rendered. Visible:", visible);

  const handleConfirm = () => {
    console.log("User confirmed medication:", medicationId);
    onConfirm(medicationId); // Call parent function to handle API
    onClose(); // Close the modal
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>Set up your notification time</Text>
          {/* Future: Notification Time Picker goes here */}
          <Button title="Confirm" onPress={handleConfirm} />
          <Button title="Cancel" onPress={onClose} />
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
