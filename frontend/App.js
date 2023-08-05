import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>Hello world!</Text>
        <Text style={styles.subtitle}>This is glaucoma-mate.</Text>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  main: {
    flex: 1,
    justifyContent: 'center',
  }, 
  title: {
    fontWeight: 'bold',
    fontSize: 50,
  },
  subtitle: {
    fontStyle: 'italic'
  }
});
