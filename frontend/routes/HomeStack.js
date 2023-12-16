import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Auth from '../screens/Auth.js';
import Doses from '../screens/Doses.js';
import { onAuthStateChanged } from 'firebase/auth'; // Import onAuthStateChanged from Firebase Auth
import { auth } from '../firebase.js'; // Import your Firebase auth object

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  // State to track if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  // Check if the user is logged in when the component mounts
  useEffect(() => {
    // Use onAuthStateChanged to listen for changes in authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Update the state based on the authentication state
      setIsLoggedIn(!!user); // Convert to a boolean value

      // Note: You may want to add additional logic based on user roles or other conditions
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <>
      {isLoggedIn === null ? (
        // Render a loading component or null while the authentication state is being determined
        null
      ) : (
        // Render the appropriate stack based on the authentication state
        <Stack.Navigator initialRouteName={isLoggedIn ? 'Doses' : 'Signin'}>
          <Stack.Screen name="Signin" component={Auth} />
          <Stack.Screen name="Doses" component={Doses} />
        </Stack.Navigator>
      )}
    </>
  );
};

export default HomeStack;
