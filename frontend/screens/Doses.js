import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Header from "../components/Header";

export default function Doses() {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.main}>
        <Text style={styles.title}>Doses</Text>
        <Text style={styles.subtitle}>This will be doses</Text>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  formContainer: {
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
  input: {
    borderWidth: 1,
    borderColor: "#777",
    padding: 8,
    margin: 10,
    width: 300,
  },
});
