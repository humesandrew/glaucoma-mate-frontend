import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';


export default function App() {
  const [email, setEmail] = useState('Email');
  const [password, setPassword] = useState("Password");

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>Hello world!</Text>
        <Text style={styles.subtitle}>This is glaucoma-mate.</Text>
        <View style={styles.formContainer}>
          <Text>Email</Text>
        <TextInput 
        style={styles.input}
        onChangeText={(val) => setEmail(val)} />
        <Text>Password</Text>
        <TextInput 
        style={styles.input}
        onChangeText={(val) => setPassword(val)} />

      
        <Text>Email entered: {email}</Text>
        <Text>Password entered: {password}</Text>
        </View>
      
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
  formContainer: {
    alignItems: 'center', 
    marginTop: 20
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
  },
  input: {
    borderWidth: 1,
    borderColor: '#777',
    padding: 8,
    margin: 10,
    width: 300

  }
});
