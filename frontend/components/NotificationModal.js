import React from "react";
import { Modal, View, Text, StyleSheet, Button } from "react-native";

export default function NotificationModal({ visible, medication, onClose, onConfirm }) {
  console.log("NotificationModal received medication:", medication);

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>
            Add Medication: {medication?.name || "Unknown"}?
          </Text>
          <Button title="Confirm" onPress={() => onConfirm(medication)} />
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
