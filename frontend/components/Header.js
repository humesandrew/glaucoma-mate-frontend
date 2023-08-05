import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Header() {
    return(
        <View style={styles.footer}>
            <Text style={styles.title}>Glaucoma-mate</Text>
        </View>
    )
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute', // Position the footer absolutely
    bottom: 0, // Place it at the bottom of the screen
    left: 0, // Align it to the left edge
    width: '100%', // Make it span the entire width of the screen
    height: 50, // Set the desired height
    backgroundColor: 'coral',
    alignItems: 'center', // Center the content horizontally
    justifyContent: 'center', // Center the content vertically
  },
    title: {
      textAlign: 'center', // Center the text horizontally within the header
      color: '#fff',
      fontSize: 20,
      fontWeight: 'bold',
      paddingTop: 5
    },
  });
  
  
  
  