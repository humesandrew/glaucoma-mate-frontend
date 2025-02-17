import React, { useState } from "react";
import { Modal, View, Text, StyleSheet, Button, TouchableOpacity, FlatList } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function NotificationModal({ onClose, visible, medication, onConfirm }) {
  if (!medication) return null; // Prevent rendering if medication is undefined

  const [selectedTimes, setSelectedTimes] = useState(
    Array(medication.dosage).fill(new Date()) // Default to current time for each dose
  );
  const [showPickerIndex, setShowPickerIndex] = useState(null); // Track which picker is open

  console.log("NotificationModal received medication:", medication.name, "with dosage:", medication.dosage);

  const onTimeChange = (index, event, selected) => {
    if (selected) {
      const updatedTimes = [...selectedTimes];
      updatedTimes[index] = selected;
      setSelectedTimes(updatedTimes);
    }
    setShowPickerIndex(null); // Close picker after selection
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>
            Set notification times for {medication.name} ({medication.dosage}x per day)
          </Text>

          {/* Generate multiple time pickers based on dosage */}
          <FlatList
            data={selectedTimes}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.timePickerContainer}>
                <TouchableOpacity onPress={() => setShowPickerIndex(index)} style={styles.timeButton}>
                  <Text style={styles.timeText}>
                    {selectedTimes[index].toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </Text>
                </TouchableOpacity>

                {/* Show DateTimePicker only for the selected index */}
                {showPickerIndex === index && (
                  <DateTimePicker
                    value={selectedTimes[index]}
                    mode="time"
                    display="spinner"
                    onChange={(event, selected) => onTimeChange(index, event, selected)}
                  />
                )}
              </View>
            )}
          />

          {/* Confirm and Close Buttons */}
          <View style={styles.buttonContainer}>
            <Button title="Confirm" onPress={() => onConfirm(medication, selectedTimes)} />
            <Button title="Cancel" onPress={onClose} color="red" />
          </View>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
    textAlign: "center",
  },
  timePickerContainer: {
    marginVertical: 5,
  },
  timeButton: {
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 5,
  },
  timeText: {
    color: "white",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
});
