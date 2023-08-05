import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Header() {
    return(
        <View style={styles.header}>
            <Text style={styles.title}>Glaucoma-mate</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
      height: 80,
      width: '100%', // Set the width to 100% to occupy the whole horizontal width
      paddingTop: 38,
      backgroundColor: 'coral',
    },
    title: {
      textAlign: 'center', // Center the text horizontally within the header
      color: '#fff',
      fontSize: 20,
      fontWeight: 'bold',
      paddingTop: 5
    },
  });
  
  
  
  