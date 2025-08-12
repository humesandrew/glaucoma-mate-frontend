import React, { useState } from "react";
import { Modal, View, Text, StyleSheet, Button, TouchableOpacity, FlatList, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from 'expo-notifications';

export default function NotificationModal({ onClose, visible, medication, onConfirm }) {
  if (!medication) return null;

  // Create UNIQUE Date objects (not one shared instance) and zero out seconds
  const [selectedTimes, setSelectedTimes] = useState(() =>
    Array.from({ length: medication.dosage }, () => {
      const d = new Date();
      d.setSeconds(0, 0);
      return d;
    })
  );
  const [showPickerIndex, setShowPickerIndex] = useState(null);

  const onTimeChange = (index, event, selected) => {
    if (selected) {
      const updated = [...selectedTimes];
      const fixed = new Date(selected);
      fixed.setSeconds(0, 0); // keep seconds at :00 to avoid "now" edge cases
      updated[index] = fixed;
      setSelectedTimes(updated);
    }
    setShowPickerIndex(null);
  };

  const ensurePermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const req = await Notifications.requestPermissionsAsync();
      if (req.status !== 'granted') {
        Alert.alert('Notifications disabled', 'Enable notifications in Settings to receive reminders.');
        return false;
      }
    }
    return true;
  };

  const handleConfirm = async () => {
    const ok = await ensurePermissions();
    if (!ok) return;

    // Optional: clear existing schedules
    await Notifications.cancelAllScheduledNotificationsAsync();

    const now = new Date();

    for (const time of selectedTimes) {
      let hour = time.getHours();
      let minute = time.getMinutes();
      let second = 0;

      // If the chosen time equals the current hour:minute, bump 1 minute to avoid an immediate fire today
      if (hour === now.getHours() && minute === now.getMinutes()) {
        minute = (minute + 1) % 60;
        if (minute === 0) hour = (hour + 1) % 24;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Time for ${medication.name}`,
          body: `Take your dose now`,
        },
        trigger: {
          hour,
          minute,
          second, // keep at :00 for consistency
          repeats: true, // daily at the same time
        },
      });
    }

    // Propagate confirm event (e.g., save to backend)
    onConfirm?.(medication, selectedTimes);
    onClose();
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>
            Set notification times for {medication.name} ({medication.dosage}x per day)
          </Text>

          <FlatList
            data={selectedTimes}
            keyExtractor={(_, idx) => idx.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.timePickerContainer}>
                <TouchableOpacity onPress={() => setShowPickerIndex(index)} style={styles.timeButton}>
                  <Text style={styles.timeText}>
                    {item.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </TouchableOpacity>

                {showPickerIndex === index && (
                  <DateTimePicker
                    value={item}
                    mode="time"
                    display="spinner"
                    onChange={(e, t) => onTimeChange(index, e, t)}
                  />
                )}
              </View>
            )}
          />

          <View style={styles.buttonContainer}>
            <Button title="Confirm" onPress={handleConfirm} />
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  timePickerContainer: {
    marginVertical: 5,
  },
  timeButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
  },
  timeText: {
    color: 'white',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    width: '100%',
  },
});
