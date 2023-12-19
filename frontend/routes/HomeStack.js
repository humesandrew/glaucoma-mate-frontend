import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Auth from '../screens/Auth.js';
import Doses from '../screens/Doses.js';

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  // State to track if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if the user is logged in when the component mounts
  useEffect(() => {
    const user = localStorage.getItem('user');
    console.log('User data from localStorage:', user);

    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Stack.Navigator initialRouteName={isLoggedIn ? 'Doses' : 'Signin'}>
      <Stack.Screen name="Signin" component={Auth} />
      <Stack.Screen name="Doses" component={Doses} />
    </Stack.Navigator>
  );
};
export default HomeStack;